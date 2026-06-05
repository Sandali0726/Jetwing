# Jetwing Symphony — Guest Intelligence Layer (Supabase)

Database layer for the Guest Intelligence Layer (Seasonal Offer Engine + Customer
Scoring + Personalised Email Engine), adapted from the FY2025 backend plan for a
**Next.js + Supabase** stack.

## What changed from the original PDF plan

| Original (PDF) | Now (this stack) | Why |
| --- | --- | --- |
| Self-hosted PostgreSQL 15 | **Supabase Postgres** | Managed, RLS, Auth, Edge Functions |
| Custom JWT auth service | **Supabase Auth + `user_roles`** | Built-in auth; RBAC via `has_role()` |
| `ADMIN / REVENUE_MANAGER / SYSTEM` JWT claims | `ADMIN` / `REVENUE_MANAGER` in `user_roles`; **`SYSTEM` = service_role key** (bypasses RLS) | Workers/Edge Functions use service key |
| pgcrypto column encryption (day 1) | **Deferred** — RLS + at-rest encryption first | Ship faster; add column crypto in hardening |
| LLM/email generation in FastAPI | **Supabase Edge Functions** | Serverless, auto-scaling |
| Celery + Redis | **Unchanged** — runs separately, uses service_role key | Heavy ML/ETL pipelines |

## Migration order

Run in numeric order (the Supabase CLI does this automatically):

| File | Contents |
| --- | --- |
| `001_master_data.sql` | `properties`, `seasonal_context`, extensions |
| `002_offer_engine_base.sql` | `prompt_registry`, `historical_revenue`, `offer_generation_runs` |
| `003_offers_and_customers.sql` | `seasonal_offers`, `customers`, `bookings` |
| `004_customer_intelligence.sql` | `customer_features`, `scoring_runs`, `customer_scores`, `latest_customer_scores` view |
| `005_campaigns_and_email.sql` | `campaigns`, `campaign_audience`, `email_events` (+ wires `scoring_runs.campaign_id` FK) |
| `006_auth_rbac_rls.sql` | `user_roles`, role helper functions, RLS on all tables |
| `007_functions_triggers.sql` | `updated_at`, `activate_prompt()`, `expire_stale_offers()`, SendGrid event sync |

`seed.sql` loads the 7 properties and 12 months of seasonal context (idempotent).

## Apply locally

```bash
# one-time
npm i -g supabase
supabase init            # if not already initialised
supabase link --project-ref <your-project-ref>

# apply migrations to the linked (remote) project
supabase db push

# or run against a local stack
supabase start
supabase db reset        # runs migrations + seed.sql
```

To seed a remote project:

```bash
psql "$DATABASE_URL" -f supabase/seed.sql
```

## RBAC quick reference

- `public.is_admin()` → current user has `ADMIN`
- `public.is_staff()` → current user has any role (`ADMIN` or `REVENUE_MANAGER`)
- `public.has_role('REVENUE_MANAGER')` → explicit check

Grant a role:

```sql
insert into public.user_roles (user_id, role)
values ('<auth-user-uuid>', 'ADMIN');
```

Background workers and Edge Functions authenticate with the **service_role** key and
bypass RLS, so all ETL / scoring / email-generation writes work without per-table
write policies for those paths.

## Scheduled jobs

`expire_stale_offers()` can be scheduled with `pg_cron` (enable the extension in the
Supabase dashboard → Database → Extensions):

```sql
select cron.schedule(
  'expire-stale-offers',
  '0 6 * * *',                       -- 06:00 daily (set DB timezone to Asia/Colombo)
  $$ select public.expire_stale_offers(); $$
);
```

The heavier monthly pipelines (`generate_monthly_offers`, `refresh_customer_features`,
`nightly_pms_etl`, `send_campaign_emails`) remain on **Celery Beat** per the plan.

## Next steps

1. ✅ Database schema, RLS, seed (this folder)
2. ⬜ Supabase client + generated TypeScript types in the Next.js app (`lib/supabase`)
3. ⬜ Next.js API routes (`app/api/v1/...`) for offers, scoring, campaigns
4. ⬜ Edge Functions for Claude offer/email generation
5. ⬜ Celery worker wiring (service_role key) for ETL + HuggingFace scoring
