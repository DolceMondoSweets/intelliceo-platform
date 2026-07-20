# IntelliCEO — Progress Status

_Last updated: 2026-07-20. Written to let a fresh session pick up with full context after a context-limit reset._

## What this is

Multi-tenant AI operating system for small businesses, starting with food & beverage. Replaces an existing Streamlit app called `dolce-mondo-atlas`, which stays live and untouched as the daily-driver tool until this app is ready to take over — don't touch or redeploy `dolce-mondo-atlas`.

The legacy Streamlit source (`atlas_dashboard.py` + 13 knowledge-base markdown files) was added locally by the user in a `Reference/` folder — **gitignored, not in this repo**. Read it directly before touching Morning Brief / Vital Signs / Content Studio again; it's the ground truth for prompts, JSON shapes, and UX, not the schema alone.

## Stack

- Next.js 16.2.10 (App Router, TypeScript, Tailwind v4), mobile-first PWA (manifest, service worker — production-only registration, install icons)
- Supabase (Postgres + Auth + RLS). Project ref `wiizwguxbnpxhzjekzvm`
- `@anthropic-ai/sdk` for Claude-backed features
- `@sentry/nextjs` for error tracking (DSN set, not yet confirmed receiving events — see below)
- Deploy target: Vercel (not yet deployed)

## Schema

`intelliceo_schema.sql` at repo root is the source of truth for a **fresh** install, but there is no Supabase CLI/migration link set up — the live database is migrated by hand via the SQL Editor. **Schema.sql and the live DB can drift.** When adding schema changes, always also hand the user an explicit `ALTER`/`CREATE` SQL snippet to run live; don't assume updating schema.sql alone does anything to the real database.

Tables: `businesses`, `profiles` (+ `is_platform_admin`, `last_login_at`), `finance_data` (+ `monthly_cogs`, `monthly_labor_cost`, `cogs_updated_at` — Phase A, see below), `decisions`, `brief_history`, `marketing_drafts`, `knowledge_base_entries`, `square_credentials` (+ `last_synced_at`).

## Completed & verified features

### Auth — `src/app/(auth)/`
Signup, login, forgot-password, reset-password. `/auth/callback` route handles the PKCE code exchange. `record_login()` (SECURITY DEFINER) bumps `profiles.last_login_at`, called from login and from `completeOnboarding`.

### Onboarding — `src/app/onboarding/`
5-step mobile wizard. Uses `create_business_and_profile()`, a SECURITY DEFINER RPC, instead of plain inserts — **this is a workaround for a confirmed Postgres/RLS anomaly, not a design choice** (see below). Confirmed working end-to-end live.

### Core app — `src/app/(app)/` route group
Shared layout (`(app)/layout.tsx`) gates on `getSessionState()`: no user → `/login`, no `business_id` → `/onboarding`. Individual pages don't repeat this guard. Sidebar nav (`src/components/app-nav.tsx`): persistent on `md:`+ screens, slide-out drawer with hamburger on mobile.

- **Dashboard** — business summary, finance snapshot, Phase A COGS metrics
- **Morning Brief** — Claude-generated domain scores/momentum/opportunity/risk/priorities, recorded to `brief_history` for a trend sparkline
- **Vital Signs** — the 10 fixed questions, Claude-scored, deliberately ephemeral (no table — matches the original Streamlit app's session-only behavior; don't add persistence unless asked)
- **Decisions Log** — full CRUD on `decisions`
- **Content Studio** — Claude-generated marketing copy, saved to `marketing_drafts`
- **Square Integration** — per-tenant Square credentials (token never sent to the client, only "connected" boolean state is), MTD revenue pull, sets `square_credentials.last_synced_at` on a successful pull
- **Settings** — business name, KB entries (business_overview/products/priorities), starting finance snapshot (cash/burn/runway) + Phase A COGS inputs, and a "Trigger Test Error" button (Diagnostics section) for Sentry verification
- **`/admin`** — platform-admin-only cross-tenant dashboard (see Platform Admin below)

### Shared AI plumbing
- `src/lib/anthropic.ts` — Claude client + JSON-parsing helper (model: `claude-sonnet-5`)
- `src/lib/business-context.ts` — `getKbContext`, `getFinanceSnapshot` (now includes Phase A COGS data), `getTrendHistoryString`, `calculateCogsMetrics` (Phase A)

## The big RLS anomaly — CLOSED, root cause confirmed

`completeOnboarding`'s original `businesses` INSERT failed with `42501` (RLS violation) despite exhaustively proving `auth.uid()` resolves correctly: an RPC call, a **raw SQL Editor reproduction that bypassed the app and PostgREST entirely** (`set_config`/`set local role authenticated` + direct insert), and JWT decoding all agreed the session was valid.

**Confirmed root cause (from Supabase support, 2026-07-20):** the Supabase client's default `.insert()` requests `return=representation` (asking Postgres to hand the new row back), which requires the new row to satisfy a SELECT policy at that exact instant. The original code inserted `businesses` before `profiles`, so for a brief window no SELECT policy could yet prove the caller owned that business row, and Postgres rejected the whole insert.

**Fix, now permanent (not a workaround):** `create_business_and_profile()`, a SECURITY DEFINER function (see `intelliceo_schema.sql`) that creates both rows atomically before anything requests a representation back. This is the correct, permanent pattern for this bootstrap step — there is nothing left to revert. The schema-file comment above the function has been updated to reflect this confirmed explanation instead of "pending Supabase response."

## Platform Admin (built 2026-07-19)

`profiles.is_platform_admin` (boolean, default false) gates `/admin` — read-only cross-tenant view: business list (signup date, tier, last login), per-business health (last Morning Brief, last Square sync, open Decisions count), activity feed (recent signups + 7+ day inactivity flag). Access granted via **additive** RLS policies (`"Platform admins see all X"`) layered on top of existing tenant-isolation policies — nothing existing was touched. `is_platform_admin` is only settable via direct SQL (no UPDATE policy on `profiles` exists at all).

**Bug hit and fixed:** the original admin policies checked admin status via `exists (select 1 from profiles where ...)` written directly inside a policy **on** `profiles` — a policy whose own check queries the table it's defined on causes **infinite recursion** (Postgres `42P17`). This broke *every* query against `profiles` for *every* account, not just admins — the visible symptom was users with an existing business getting bounced back into `/onboarding` forever, because `getSessionState()`'s profile lookup silently failed and `businessId` defaulted to null. **Fixed** via `public.is_platform_admin()`, a SECURITY DEFINER function that reads `is_platform_admin` bypassing RLS; all 5 admin policies now call that function instead of inlining the subquery. Confirmed fixed — user's account (with an existing business) now loads `/dashboard` correctly.

**Lesson:** never write an RLS policy whose USING clause queries the same table it's attached to. Route that kind of check through a SECURITY DEFINER function instead.

## Sentry (added 2026-07-19)

`@sentry/nextjs` installed and wired: `src/instrumentation.ts` (server/edge `register()` + `onRequestError`), `src/instrumentation-client.ts` (client init + `onRouterTransitionStart`), `next.config.ts` wrapped with `withSentryConfig`, `error.tsx`/`global-error.tsx` both call `Sentry.captureException` in a `useEffect`. DSN is set in `.env.local` (`NEXT_PUBLIC_SENTRY_DSN` and `SENTRY_DSN`, both the same value the user provided).

**Confirmed working end-to-end (2026-07-20).** Clicking "Trigger Test Error" in Settings → Diagnostics produced 4 events on Sentry's Issues page. Integration is fully verified live.

## Phase A: COGS/prime cost tracking (built 2026-07-20, migration confirmed live)

Migration confirmed applied to the live DB (verified 2026-07-20 via a direct PostgREST request for `monthly_cogs, monthly_labor_cost, cogs_updated_at` against `finance_data` — got `200 []` rather than a `42703 undefined column` error). Live end-to-end behavior (Settings save → Dashboard display → Morning Brief incorporation) against "Dolce Mondo Sweets & Coffee" is still unverified in the browser — do that next if asked.

- **Schema:** `finance_data.monthly_cogs`, `monthly_labor_cost`, `cogs_updated_at` (all nullable, no defaults touched). Migration:
  ```sql
  alter table finance_data add column if not exists monthly_cogs numeric;
  alter table finance_data add column if not exists monthly_labor_cost numeric;
  alter table finance_data add column if not exists cogs_updated_at timestamptz;
  ```
- **Settings:** two new inputs ("Ingredient/supply cost this month", "Labor cost this month") in the existing finance section. `cogs_updated_at` is only stamped when at least one COGS value is actually being saved (not on every finance-section save) — keeps the staleness signal meaningful.
- **`calculateCogsMetrics(monthlyCogs, monthlyLaborCost, revenueMtd)`** in `business-context.ts` → `{ foodCostPct, primeCostPct }`, null-safe (returns nulls if revenue is 0/null, or if the relevant cost inputs are missing). Carries a Phase B forward-compat comment: `monthly_cogs` may eventually be summed from a future per-item costs table instead of manually entered — don't build that table now, just don't break this function's signature when it happens.
- **Dashboard:** Food Cost % / Prime Cost % stats, color-banded (green ≤65%, amber 65–75%, red >75%), benchmark note ("healthy F&B prime cost is typically 60–65%"), plus an amber flagged-reminder card (same visual pattern as Morning Brief's flagged issues) if `cogs_updated_at` is null with real revenue, or >30 days old.
- **Morning Brief:** `getFinanceSnapshot()` now includes COGS/labor/food-cost-%/prime-cost-% and the benchmark in the same text block Claude already uses for Financial Health scoring and flagged issues — no prompt restructuring, just richer input data.
- **Verified so far:** typecheck clean, production build clean, route guards checked (unauthenticated redirects work). **Not yet tested against live data** — next session should confirm the migration ran, then check Settings save → Dashboard display → Morning Brief incorporation against the "Dolce Mondo Sweets & Coffee" test business.

## Key lessons / gotchas (also saved to the auto-memory file `project_intelliceo_overview.md`)

1. **Next.js "use server" files:** every export must be an async function. A shared constant a server-action file needs (e.g. `TEN_QUESTIONS`, `DOMAIN_ORDER`) must live in its own plain module — see `morning-brief/constants.ts`, `vital-signs/constants.ts`. Type-only exports are fine (erased at compile time); only runtime value exports break this.
2. **Service worker in dev:** `src/app/service-worker-registration.tsx` only registers in production. Registering unconditionally caused stale cached JS chunks across dev-server restarts, manifesting as the whole app hanging ("stuck at Rendering," dead nav links) despite the server responding fine.
3. **Never write a self-referencing RLS policy** (a policy on table X whose check queries table X) — causes infinite recursion (`42P17`), silently breaks *every* query on that table for *every* user. Always route that kind of check through a SECURITY DEFINER function.
4. **PostgREST schema cache can go stale** after DDL run through the SQL Editor (as opposed to Supabase's own migration UI). If a column that definitely exists produces "column does not exist" (`42703`), try `notify pgrst, 'reload schema';` or the dashboard's Database → Settings → "Reload schema cache" button before assuming something's actually broken.
5. **Supabase SQL Editor runs a pasted multi-statement block as one batch.** If a later statement fails, a retry of the whole block reports "already exists" for the parts that already succeeded. Write idempotent migrations (`drop policy if exists` before `create policy`, `create or replace function`, `add column if not exists`) so re-running is always safe.
6. **This session's shells don't have Node on PATH by default** — prefix Bash commands with `export PATH="$PATH:/c/Program Files/nodejs"`.
7. **Always `rm -rf .next` before restarting `dev` right after running `build`.** Running a production build immediately before starting the dev server corrupts the route manifest and breaks *every* route, not just the ones that changed.

## Environment / credentials status

- `.env.local`: Supabase URL + publishable key (set), `SUPABASE_SERVICE_ROLE_KEY` (blank — deliberately not needed, avoided introducing it), `ANTHROPIC_API_KEY` (set), Sentry DSN vars (set).
- User's real account: `farellduclair@gmail.com`, id `2bfd5103-f552-4cdd-bd44-a5445dbca222`, business "Dolce Mondo Sweets & Coffee", `is_platform_admin = true`.

## Git status

As of 2026-07-20, everything since `aff4a8a` (nav drawer, Settings, `/admin`, Sentry, the RLS-recursion fix, Phase A COGS, the root-cause comment update, and this file) has been committed and pushed at the user's explicit request. Run `git log`/`git status` to confirm current state before assuming anything is still pending.

## Immediate next steps for a fresh session

1. Live-verify Phase A end-to-end in the browser (Settings save → Dashboard display/color-banding/staleness flag → Morning Brief incorporation) against "Dolce Mondo Sweets & Coffee" — code and migration are both confirmed in place, just not walked through live yet.
2. Ask about Phase B (per-item costs) scope/timing when the user is ready to start it.
