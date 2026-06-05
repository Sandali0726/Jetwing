"""
Customer scoring — the contract between this pipeline and the HuggingFace model.

⚠️  FEATURE CONTRACT (must match the trained model EXACTLY)
The model receives a flat list of 16 floats per customer, in THIS ORDER, with
THESE transforms. If your friend trains with a different order/transform, scores
will be garbage. Keep this list and the training code in lockstep.

  idx feature                      transform / encoding
  ──────────────────────────────────────────────────────────────────────────
   0  recency_days                 raw int
   1  frequency_total              raw int
   2  frequency_12m                raw int
   3  monetary_total_lkr           log1p(x)            ← log-transformed here
   4  monetary_avg_per_stay_lkr    raw float
   5  monetary_12m_lkr             raw float
   6  avg_length_of_stay           raw float
   7  avg_lead_time_days           raw int
   8  direct_booking_ratio         0.0–1.0
   9  cancellation_ratio           0.0–1.0
  10  avg_satisfaction_score       missing → -1.0 sentinel (NOT NaN — JSON-safe)
  11  property_diversity_score     0.0–1.0
  12  luxury_reserve_visits        raw int
  13  eco_engagement_flag          0 / 1
  14  high_season_preference       0 / 1
  15  domestic_guest               0 / 1

Endpoint I/O (HuggingFace dedicated inference endpoint):
  POST {"inputs": [[...16 floats...], ...]}  ->  {"scores": [88.4, 71.2, ...]}
  scores are 0–100 composite customer-value scores.
"""
import math

import requests

import config

FEATURE_ORDER = [
    "recency_days", "frequency_total", "frequency_12m", "monetary_total_lkr",
    "monetary_avg_per_stay_lkr", "monetary_12m_lkr", "avg_length_of_stay",
    "avg_lead_time_days", "direct_booking_ratio", "cancellation_ratio",
    "avg_satisfaction_score", "property_diversity_score", "luxury_reserve_visits",
    "eco_engagement_flag", "high_season_preference", "domestic_guest",
]

SATISFACTION_MISSING = -1.0


def _f(v, default=0.0) -> float:
    try:
        return float(v) if v is not None else default
    except (TypeError, ValueError):
        return default


def build_vector(row: dict) -> list[float]:
    """Turn a customer_features row into the model's input vector."""
    return [
        _f(row.get("recency_days")),
        _f(row.get("frequency_total")),
        _f(row.get("frequency_12m")),
        math.log1p(_f(row.get("monetary_total_lkr"))),
        _f(row.get("monetary_avg_per_stay_lkr")),
        _f(row.get("monetary_12m_lkr")),
        _f(row.get("avg_length_of_stay")),
        _f(row.get("avg_lead_time_days")),
        _f(row.get("direct_booking_ratio")),
        _f(row.get("cancellation_ratio")),
        _f(row.get("avg_satisfaction_score"), SATISFACTION_MISSING) if row.get("avg_satisfaction_score") is not None else SATISFACTION_MISSING,
        _f(row.get("property_diversity_score")),
        _f(row.get("luxury_reserve_visits")),
        1.0 if row.get("eco_engagement_flag") else 0.0,
        1.0 if row.get("high_season_preference") else 0.0,
        1.0 if row.get("domestic_guest") else 0.0,
    ]


def tier_for(score: float) -> str:
    if score >= 80:
        return "Platinum"
    if score >= 60:
        return "Gold"
    if score >= 40:
        return "Silver"
    return "Standard"


# ── HuggingFace inference (with PDF's split-on-failure retry) ─────────────────
def _hf_call(vectors: list[list[float]]) -> list[float]:
    resp = requests.post(
        config.HF_SCORING_ENDPOINT,
        headers={"Authorization": f"Bearer {config.HF_API_TOKEN}", "Content-Type": "application/json"},
        json={"inputs": vectors},
        timeout=60,
    )
    resp.raise_for_status()
    scores = resp.json()["scores"]
    if len(scores) != len(vectors):
        raise ValueError(f"HF returned {len(scores)} scores for {len(vectors)} inputs")
    return [float(s) for s in scores]


def _hf_safe(vectors: list[list[float]]) -> list[float]:
    """Isolate problematic records by splitting failed batches in half."""
    try:
        return _hf_call(vectors)
    except Exception:
        if len(vectors) <= 1:
            return [0.0] * len(vectors)  # un-scorable → Standard tier, logged upstream
        mid = len(vectors) // 2
        return _hf_safe(vectors[:mid]) + _hf_safe(vectors[mid:])


# ── Local fallback (until the model is deployed) ─────────────────────────────
def _local(row: dict) -> float:
    """Same RFM heuristic as demo_data.sql so scores are sensible without the model."""
    rec = _f(row.get("recency_days"))
    freq = _f(row.get("frequency_total"))
    mon = _f(row.get("monetary_total_lkr"))
    r = 30.0 if rec < 90 else 18.0 if rec < 270 else 6.0
    f = min(30.0, freq * 8.0)
    m = min(40.0, (mon / 1_000_000.0) * 8.0)
    return max(0.0, min(100.0, r + f + m))


def score_rows(rows: list[dict]) -> list[float]:
    """Score a batch of customer_features rows. Uses HF if configured, else local."""
    if config.HF_SCORING_ENDPOINT and config.HF_API_TOKEN:
        return _hf_safe([build_vector(r) for r in rows])
    return [_local(r) for r in rows]


def using_model() -> bool:
    return bool(config.HF_SCORING_ENDPOINT and config.HF_API_TOKEN)
