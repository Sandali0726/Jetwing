# Jetwing Scoring & ETL Worker (Celery)

Background pipeline for **Module B** of the Guest Intelligence Layer:
- `nightly_pms_etl` — pulls bookings from the PMS into `bookings` (00:30)
- `refresh_customer_features` — recomputes feature vectors via the DB function (02:00)
- `score_customers` — batch-scores every customer via the HuggingFace model and writes `customer_scores` (03:00)

It authenticates to Supabase with the **service-role key** (the `SYSTEM` identity → bypasses RLS). Until the ML model is deployed, scoring falls back to a local RFM heuristic so the pipeline runs end-to-end today.

## Run it

```bash
cd worker
cp .env.example .env          # fill SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
docker compose up --build     # starts redis + worker + beat (+ flower on :5555)
```

Trigger a scoring run immediately (instead of waiting for 03:00):

```bash
docker compose exec worker python -c "import tasks; print(tasks.score_customers.delay().id)"
# or run synchronously:
docker compose exec worker python -c "import tasks; print(tasks.score_customers.run())"
```

Local (no Docker):

```bash
pip install -r requirements.txt
celery -A celery_app worker --loglevel=info        # terminal 1
celery -A celery_app beat   --loglevel=info        # terminal 2 (needs a Redis running)
```

## Reliability (per the plan)
- Tasks use exponential backoff, **max 3 retries** (`autoretry_for=(Exception,)`).
- HF batch calls **split in half on failure** to isolate bad records (`scoring_model._hf_safe`).
- `task_acks_late` + `task_reject_on_worker_lost` redeliver work if a worker dies.
- Failures are written to `scoring_runs.error_log` and re-raised so Celery can retry / dead-letter.

---

# 🧪 Model-training guide (for the ML engineer)

You own the model; this worker owns the data plumbing. The **only thing we must agree on is the feature contract** below — get that right and your endpoint drops straight in.

### 1. What to build
A supervised regressor (XGBoost or LightGBM recommended) that outputs a **0–100 composite customer-value score**. Suggested target label = a blend of: future-booking probability (next 6 months) + expected LTV increment + inverse churn risk, derived from historical `bookings`. Normalise the target to 0–100.

### 2. Feature contract — MUST MATCH `scoring_model.py`
16 features, **this exact order and these transforms** (the worker builds vectors this way in `build_vector()`):

| idx | feature | transform |
| --- | --- | --- |
| 0 | recency_days | raw |
| 1 | frequency_total | raw |
| 2 | frequency_12m | raw |
| 3 | monetary_total_lkr | **log1p** |
| 4 | monetary_avg_per_stay_lkr | raw |
| 5 | monetary_12m_lkr | raw |
| 6 | avg_length_of_stay | raw |
| 7 | avg_lead_time_days | raw |
| 8 | direct_booking_ratio | 0–1 |
| 9 | cancellation_ratio | 0–1 |
| 10 | avg_satisfaction_score | missing → **-1.0** sentinel |
| 11 | property_diversity_score | 0–1 |
| 12 | luxury_reserve_visits | raw |
| 13 | eco_engagement_flag | 0/1 |
| 14 | high_season_preference | 0/1 |
| 15 | domestic_guest | 0/1 |

Pull the training table straight from Supabase: `select * from customer_features` (apply the same log1p / sentinel in your training featurizer).

### 3. Endpoint I/O contract
Deploy as a **HuggingFace Dedicated Inference Endpoint** with a custom handler. Request/response:

```
POST  { "inputs": [[f0, f1, ..., f15], ...] }     # batch of up to 500 vectors
200   { "scores": [88.4, 71.2, ...] }             # 0–100, same order as inputs
```

Minimal `handler.py` skeleton for the endpoint:

```python
# handler.py — HuggingFace Inference Endpoint custom handler
import numpy as np, joblib

class EndpointHandler:
    def __init__(self, path="."):
        self.model = joblib.load(f"{path}/model.joblib")  # your trained XGB/LGBM

    def __call__(self, data):
        X = np.array(data["inputs"], dtype=float)          # (n, 16)
        preds = self.model.predict(X)                      # raw model output
        scores = np.clip(preds, 0, 100).round(2)           # ensure 0–100
        return {"scores": scores.tolist()}
```

Package: `model.joblib` + `handler.py` + `requirements.txt` (xgboost/lightgbm, scikit-learn, joblib, numpy) in the HF model repo.

### 4. Hand-off
Give me three values and I'll flip the worker from heuristic to your model — no code change:

```
HF_SCORING_ENDPOINT=https://xxxx.endpoints.huggingface.cloud
HF_API_TOKEN=hf_...
HF_MODEL_VERSION=customer-scorer-v1      # written into customer_scores.model_version
```

That's it — set them in `worker/.env`, restart, and `score_customers` will batch your vectors to the endpoint and persist the tiers (Platinum ≥80, Gold ≥60, Silver ≥40, else Standard).
