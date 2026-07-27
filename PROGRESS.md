# IntelliCEO — Progress Status

_Last updated: 2026-07-21. Written to let a fresh session pick up with full context after a context-limit reset. This update was written by directly re-verifying the current state of the repo, live database, and git history — some of the work described below (the sections marked accordingly) happened outside this session's own visible conversation history, so it's documented from ground truth (file contents, git log, live queries) rather than from memory of building it._

## What this is

Multi-tenant, paid AI operating system for small businesses, starting with food & beverage. Replaces an existing Streamlit app called `dolce-mondo-atlas`, which stays live and untouched as the daily-driver tool until this app is ready to take over — don't touch or redeploy `dolce-mondo-atlas`.

The legacy Streamlit source (`atlas_dashboard.py` + 13 knowledge-base markdown files) was added locally by the user in a `Reference/` folder — **gitignored, not in this repo**. Read it directly before touching CEO Brief / Vital Signs / Content Studio again; it's the ground truth for prompts, JSON shapes, and UX, not the schema alone.

## Stack

- Next.js 16.2.10 (App Router, TypeScript, Tailwind v4), mobile-first PWA (manifest, service worker — production-only registration, no longer caches `/` since it's a pure auth-redirect route, not static content)
- Supabase (Postgres + Auth + RLS + Storage + **Vault**, used for encrypting POS access tokens at rest). Project ref `wiizwguxbnpxhzjekzvm`
- Stripe (subscriptions, Checkout, Billing Portal, webhooks) — **still test mode only**, see the "what's left before a pilot" list at the bottom
- `@anthropic-ai/sdk` for Claude-backed features (model: `claude-sonnet-5`) — the assistant persona is "IntelliCEO" throughout; a prior "Atlas" naming (leftover from the reference app this replaces) has been fully removed, confirmed zero remaining references anywhere in the repo
- `@sentry/nextjs` for error tracking — confirmed receiving real events
- A marketing/public site now exists (`src/app/(marketing)/`) alongside the product app — home page, Security page, help center, contact form with email sending (`src/lib/email.ts`, `contact@intelliceo.com`). **Not yet committed to git as of this writing** — see Git status below.
- Deploy target: Vercel, domain `intelliceo.com` — the user has reported this connection is live; nothing in this repo's config (no `vercel.json`, `next.config.ts` has no domain-specific settings) independently confirms DNS/hosting state one way or the other, since that's configured outside version control. Taken at the user's word.

## Schema

`intelliceo_schema.sql` at repo root is the source of truth for a **fresh** install, but there is no Supabase CLI/migration link set up — the live database is migrated by hand via the SQL Editor. **Schema.sql and the live DB can drift.** When adding schema changes, always also hand the user an explicit `ALTER`/`CREATE` SQL snippet to run live; don't assume updating schema.sql alone does anything to the real database. This pattern has been used for every schema change so far.

**Tables:** `businesses` (+ billing fields `stripe_customer_id`/`stripe_subscription_id`/`subscription_status`/`trial_ends_at`, plus `logo_url`), `profiles` (+ `is_platform_admin`, `last_login_at`), `finance_data` (+ `monthly_cogs`, `monthly_labor_cost`, `cogs_updated_at`, `budgeted_revenue`/`budgeted_cogs`/`budgeted_labor` — **no `runway` column**, runway is always derived from `cash/burn`, never stored), `decisions`, `goals` (new — mirrors Decisions Log), `brief_history`, `marketing_drafts`, `knowledge_base_entries`, `pos_credentials` (**renamed from `square_credentials`** — now has a `pos_type` discriminator for Square vs. Clover, and stores the access token **encrypted in Supabase Vault**, not in plaintext — see below), `stripe_webhook_events` (webhook idempotency), `chat_messages`, `chat_summary` (persistent Chat memory).

**Storage:** `business-logos` bucket — private, 2MB limit, `image/png|jpeg|webp` only, RLS-scoped via `storage.objects` policies.

**Functions (all SECURITY DEFINER):** `create_business_and_profile`, `record_login`, `is_platform_admin`, `set_stripe_customer_id`, `set_business_logo_url`, `set_business_name`, and — for POS credentials — `set_pos_access_token`, `get_pos_access_token`, `has_pos_access_token` (see the Vault section below). All of these exist because `businesses`/`pos_credentials` have no general tenant UPDATE/SELECT-of-secret policy for these specific fields; each gets a narrow, single-purpose RPC instead of a broad policy.

## POS credentials: Vault encryption (confirmed live via direct query, 2026-07-21)

`pos_credentials.access_token` used to store each business's live Square/Clover API token in **plain text** — readable by anyone with database/table access (a dashboard user, a leaked service-role key, a misconfigured admin query). `migration_pos_credentials_vault.sql` (repo root, currently untracked — see Git status) is a three-phase migration: (1) additive — enables the `supabase_vault` extension, adds `access_token_secret_id`, backfills existing tokens into `vault.secrets`; (2) a read-only verification `SELECT` to eyeball before proceeding; (3) destructive — drops the plaintext `access_token` column.

**Verified live**, independent of this migration file's own header (which says it was never run "from this session" — it was run by the user separately): a direct query against `pos_credentials.access_token` now returns `42703 column does not exist`, while `access_token_secret_id` returns cleanly. **All three phases are confirmed applied.** The only way to read a token now is `get_pos_access_token()`, scoped to the calling business's own row via `auth.uid()` — same pattern as `set_business_name`/`set_business_logo_url`. Anywhere the app used to read `square_credentials.access_token`/`pos_credentials.access_token` directly needs to call this RPC instead — worth grepping for if anything POS-related breaks.

## Budgeting, Goals, What-If tools, and in-app billing management (commit `a22f49b`)

Four new Starter-tier financial tools on the Dashboard, backed by pure functions in `src/lib/financial-formulas.ts` (extracted so client components — the What-If calculator needs live, client-side recalculation — don't need to pull in the server-only `business-context.ts`):

- **Budget vs. Actual** (`budget-comparison.tsx`) — compares `finance_data.budgeted_revenue/cogs/labor` against actuals.
- **Break-Even calculator** (`break-even-card.tsx`).
- **Goals tracker** (`/goals` — mirrors the Decisions Log's CRUD pattern).
- **What-If calculator** (`what-if-calculator.tsx`) — live client-side recalculation as inputs change.

Billing UX also got real: a Starter user hitting a Growth-only feature now gets an actual "Upgrade to Growth" button that updates their existing Stripe subscription in place (proration) instead of dead-ending. Settings has a "Plan & Billing" card with live Stripe status and direct Upgrade/Downgrade/Cancel actions; the Billing Portal link is now scoped to card updates only.

## Clover POS support (commit `a22f49b`)

Square is no longer the only POS option. `square_credentials` → `pos_credentials` (with the Vault migration above layered on top), route moved from `/square-integration` to `/pos-integration` with a platform picker, and onboarding now asks which POS a business uses to decide whether Growth is offered. Clover's MTD revenue pull sums the **Payments** endpoint, not Orders — verified live against a real Clover sandbox merchant that Orders carry no total field and `paymentState` never reflected a completed payment, so an Orders-based pull would have silently always returned 0.

## Settings/nav cleanup (commit `6f45ac5`, then further moved in `a22f49b`)

- Log Out has moved twice now: originally on the Dashboard → moved to the bottom of Settings → **now lives at the bottom of the side nav itself** (`src/lib/auth-actions.ts` holds the shared `signOut()`, called from `app-nav.tsx`). If you're looking for it, check the nav, not Settings.
- The Sentry "Trigger Test Error" Diagnostics button is now gated behind `is_platform_admin` — it used to be visible to every business, which made no sense for a diagnostic tool.
- **Runway is now always derived** (`cash / burn`, via `calculateRunwayMonths`/`formatRunwayMonths` in `business-context.ts`/`financial-formulas.ts`), shown as "N/A" when burn is 0 rather than a divide-by-zero artifact. The manual Runway input is gone from both Settings and onboarding, and there's no `finance_data.runway` column anymore.
- Fixed a real PWA bug: the service worker was caching `/` (a pure auth-redirect route with no static content of its own) as a permanent shell asset, which could freeze a stale login/dashboard routing decision regardless of actual live session state. Cache version bumped to evict it; `/` is no longer cached.

## Marketing site (built, not yet committed — see Git status)

A public marketing site now exists alongside the product app under `src/app/(marketing)/` (root `src/app/page.tsx` was deleted in favor of this). Includes a home page, a **Security page** (`src/app/(marketing)/security/page.tsx`) built from nine section components (`src/components/marketing/sections/security/` — Hero, Data Encryption, Auth, Financial Data, Data Ownership, AI Data Usage, Third-Party Services, Data Retention, Responsible Disclosure, Contact), a help center (`public/help-center/`), brand assets (`public/brand/`), and a working contact form (`src/components/marketing/sections/contact/ContactForm.tsx` → `src/lib/email.ts`, sending as `contact@intelliceo.com`). Two brief-writing docs (`IntelliCEO_Website_Brief_Corrected_1.md`, `IntelliCEO_Website_Master_Brief_Original.md`) are sitting at the repo root, also untracked.

## Chat, Ask bar, Dashboard redesign, Stripe billing (built 2026-07-20/21, all pushed)

These are unchanged from before and still accurate:

- **Stripe billing/tiering** — Starter $59/Growth $89, 7-day trial, Checkout, webhook (with a real webhook-vs-redirect race condition found and fixed via `/checkout/success`), tier gating, reactivation, and the pilot coupon (`PILOT25`, 25% off first month) verified via a Stripe test-clock walkthrough. Still test mode only.
- **Persistent Chat memory** — every message stored in `chat_messages`, a rolling `chat_summary` folds in anything older than the last ~16–20 messages via a separate Claude call that updates (not appends to) the summary. Verified live that a detail folded entirely out of the verbatim window was still correctly recalled from the summary.
- **Ask bar** — Chat moved from a floating corner bubble to a persistent, always-visible top-of-page bar (`src/components/ask-bar.tsx`), replacing the old `chat-panel.tsx`.
- **Dashboard redesign** — removed the permanent "onboarding complete" banner (now a one-time `?welcome=1` banner only right after a brand-new signup's Checkout), Finance Snapshot became the centerpiece, static Overview/Products collapse into a disclosure, Priorities stays visible. (Log Out has since moved again — see above.)
- **Business logo upload** — first use of Supabase Storage in this app, private bucket, RLS-scoped by business_id via `storage.objects` path policies, signed URLs generated server-side (`src/lib/business-brand.ts`).

## The big RLS anomaly — CLOSED, root cause confirmed

`completeOnboarding`'s original `businesses` INSERT failed with `42501` despite exhaustively proving `auth.uid()` resolves correctly. **Confirmed root cause (Supabase support):** the Supabase client's default `.insert()` requests `return=representation`, which requires the new row to satisfy a SELECT policy at that exact instant — the original code inserted `businesses` before `profiles`, so briefly no SELECT policy could prove ownership. **Fix, permanent:** `create_business_and_profile()` creates both rows atomically before anything requests a representation back.

## Platform Admin recursion bug — CLOSED

The original admin RLS policies checked admin status via a subquery directly inside a policy **on** `profiles` — causes infinite recursion (`42P17`), breaking *every* query against `profiles` for *every* account. **Fixed** via `public.is_platform_admin()`, a SECURITY DEFINER function that bypasses RLS for this specific check. **Lesson:** never write an RLS policy whose USING clause queries the same table it's attached to.

## Key lessons / gotchas

1. **Next.js "use server" files:** every export must be an async function; shared constants need their own plain module.
2. **Never write a self-referencing RLS policy** — route that kind of check through a SECURITY DEFINER function.
3. **PostgREST schema cache can go stale** after SQL-Editor DDL — `notify pgrst, 'reload schema';` or the dashboard's "Reload schema cache" button.
4. **Supabase SQL Editor runs a pasted block as one batch** — write idempotent migrations so re-running after a partial failure is always safe.
5. **This session's shells don't have Node on PATH by default** — prefix Bash commands with `export PATH="$PATH:/c/Program Files/nodejs"`.
6. **Always `rm -rf .next` before restarting `dev` right after running `build`.**
7. **Anthropic's `messages` array must start with role `"user"`** — relevant anywhere conversation history gets sliced.
8. **Tables generally have no general tenant UPDATE policy for sensitive/self-service fields, on purpose** — follow the narrow SECURITY DEFINER RPC pattern (`set_business_name`, `set_pos_access_token`, etc.) rather than adding a broad policy.
9. **A service worker that caches a pure redirect route can freeze stale auth-routing decisions** — only cache genuinely static content.
10. **Migration files that touch encryption/secrets should say plainly whether they were actually run** — `migration_pos_credentials_vault.sql`'s own header claims it wasn't run "from this session," but a live query confirms it has been, just not by this particular assistant run. Don't trust a migration file's self-description over an actual live check when the two might refer to different sessions.
11. This specific automated browser-testing tool has shown recurring artifacts in past sessions (stale cached CSS chunks, stuck Suspense reveals) that turned out to be tooling issues, not app bugs — always verify via direct content extraction or a raw `curl` before concluding something is actually broken.

## Environment / credentials status

- `.env.local`: Supabase URL + publishable key + `SUPABASE_SERVICE_ROLE_KEY` (needed for the Stripe webhook), `ANTHROPIC_API_KEY`, Sentry DSN vars, Stripe test-mode keys/price IDs/webhook secret (from local `stripe listen`) — all set, all test mode.
- Stripe CLI installed locally, authenticated to the user's Stripe account (`pathoflifeacademy.org`, `acct_1Kv6TIKopQhwQMnN`) — confirm this is the intended account before going live.
- `contact@intelliceo.com` is used as the outbound sender for the marketing site's contact form (`src/lib/email.ts`) — confirm whatever email-sending provider is behind `email.ts` is actually configured with real credentials before relying on it.

## Git status — check this carefully before assuming anything is pushed

As of this writing, `origin/main` and local `main` are identical through commit `a22f49b` ("Add budgeting/goals/what-if tools, in-app billing changes, and Clover POS support"). **Everything below that is uncommitted in the working tree**, including:
- The entire marketing site: `src/app/(marketing)/`, `src/components/marketing/`, `src/content/`, `public/brand/`, `public/help-center/`, `src/lib/email.ts`
- `migration_pos_credentials_vault.sql` (already run live, per above, but the file itself isn't committed)
- Two brief docs at the repo root
- Modifications to `.env.local.example`, `.gitignore`, `intelliceo_schema.sql`, `package.json`/`package-lock.json`, `content-studio/actions.ts`, `morning-brief/actions.ts` (Atlas naming cleanup lives in these two), `pos-integration/actions.ts`/`page.tsx`, `vital-signs/actions.ts`/`vital-signs-client.tsx`, `login/actions.ts`, `globals.css`, `database.types.ts`
- Deletion of `src/app/page.tsx`

Run `git status`/`git diff` at the start of a fresh session to see the exact current state — don't assume the marketing site or the Vault migration file are in git just because they're confirmed live/working.

## What's left before onboarding a real pilot business

1. **Nothing is deployed via a verifiable-from-this-repo path** — the user reports `intelliceo.com` is connected, but confirm the actual Vercel project is live and serving both the marketing site and the product app correctly.
2. **Stripe is test mode only** — live mode needs its own Products/Prices, live API keys, and `PILOT25` recreated in live mode.
3. **No production webhook endpoint registered in Stripe** — only the local `stripe listen` CLI tunnel exists so far.
4. **Production environment variables** need to be set on whatever host is used.
5. **Confirm the contact form's email sending actually works** — `email.ts` exists but hasn't been verified sending a real message in this session.
6. **Email deliverability for Supabase Auth** (signup confirmation, password reset) — still unconfirmed.
7. **Commit and push the marketing site + Vault migration file** — see Git status above.

Lower priority: no automated test suite, no rate limiting on Chat's Claude calls, a handful of test businesses/accounts sitting in the database (harmless, RLS-isolated).
