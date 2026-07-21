# IntelliCEO — Progress Status

_Last updated: 2026-07-21. Written to let a fresh session pick up with full context after a context-limit reset._

## What this is

Multi-tenant, paid AI operating system for small businesses, starting with food & beverage. Replaces an existing Streamlit app called `dolce-mondo-atlas`, which stays live and untouched as the daily-driver tool until this app is ready to take over — don't touch or redeploy `dolce-mondo-atlas`.

The legacy Streamlit source (`atlas_dashboard.py` + 13 knowledge-base markdown files) was added locally by the user in a `Reference/` folder — **gitignored, not in this repo**. Read it directly before touching CEO Brief / Vital Signs / Content Studio again; it's the ground truth for prompts, JSON shapes, and UX, not the schema alone.

## Stack

- Next.js 16.2.10 (App Router, TypeScript, Tailwind v4), mobile-first PWA (manifest, service worker — production-only registration, install icons)
- Supabase (Postgres + Auth + RLS + Storage). Project ref `wiizwguxbnpxhzjekzvm`
- Stripe (subscriptions, Checkout, Billing Portal, webhooks) — **currently test mode only**
- `@anthropic-ai/sdk` for Claude-backed features (model: `claude-sonnet-5`)
- `@sentry/nextjs` for error tracking — confirmed receiving real events
- **Deploy target: Vercel — not yet deployed anywhere.** Everything described below has only ever run via local `npm run dev`.

## Schema

`intelliceo_schema.sql` at repo root is the source of truth for a **fresh** install, but there is no Supabase CLI/migration link set up — the live database is migrated by hand via the SQL Editor. **Schema.sql and the live DB can drift.** When adding schema changes, always also hand the user an explicit `ALTER`/`CREATE` SQL snippet to run live; don't assume updating schema.sql alone does anything to the real database. This pattern has been used for every schema change so far and the user has always run it themselves.

**Tables:** `businesses` (+ `is_platform_admin`-adjacent billing fields: `stripe_customer_id`, `stripe_subscription_id`, `subscription_status`, `trial_ends_at`, plus `logo_url`), `profiles` (+ `is_platform_admin`, `last_login_at`), `finance_data` (+ `monthly_cogs`, `monthly_labor_cost`, `cogs_updated_at`), `decisions`, `brief_history`, `marketing_drafts`, `knowledge_base_entries`, `square_credentials` (+ `last_synced_at`), `stripe_webhook_events` (webhook idempotency), `chat_messages`, `chat_summary` (persistent Chat memory).

**Storage:** `business-logos` bucket — private, 2MB limit, `image/png|jpeg|webp` only, RLS-scoped via `storage.objects` policies using `(storage.foldername(name))[1]` as the tenant-isolation predicate (same pattern as every table's `business_id` check, adapted for object paths). Object path convention: `{business_id}/logo` (no extension).

**Functions (all SECURITY DEFINER):** `create_business_and_profile` (onboarding bootstrap), `record_login`, `is_platform_admin` (breaks RLS recursion — see below), `set_stripe_customer_id`, `set_business_logo_url`, `set_business_name`. The last three exist because **`businesses` has no general tenant UPDATE policy** — every self-service write to that table goes through one of these narrow RPCs instead. `updateBusinessName` used to skip this and silently no-op; fixed in the Dashboard redesign pass.

## Completed & verified features

### Auth & onboarding
Signup, login, forgot-password, reset-password (`src/app/(auth)/`). `record_login()` bumps `last_login_at` on login and onboarding completion. Onboarding is a 5-step mobile wizard using `create_business_and_profile()` (see the RLS anomaly writeup below); on completion it now redirects to `/onboarding/plan` (plan picker), not straight to `/dashboard`.

### Core app route group — `src/app/(app)/`
`(app)/layout.tsx` gates on `getSessionState()`: no user → `/login`, no `business_id` → `/onboarding`, no active subscription → `/onboarding/plan` (never started) or `/reactivate` (lapsed/canceled). It also fetches the business's name/logo (`getBusinessBrand`) and renders the sidebar nav + the persistent Ask bar around every page.

- **Dashboard** — redesigned (see below): Finance Snapshot is the centerpiece, static info collapses, no more permanent "onboarding complete" banner.
- **CEO Brief** (renamed from "Morning Brief" — route path, function/type names, and `brief_history` columns are unchanged, display-only rename) — Claude-generated domain scores/momentum/opportunity/risk/priorities, recorded to `brief_history` for a trend sparkline.
- **Vital Signs** — the 10 fixed questions, Claude-scored, deliberately ephemeral (no table, session-only).
- **Decisions Log** — full CRUD on `decisions`.
- **Content Studio** — Claude-generated marketing copy, saved to `marketing_drafts`. **Growth-tier only** — gated at the page and the server-action level.
- **Square Integration** — per-tenant Square credentials, MTD revenue pull. **Growth-tier only**, same dual gating.
- **Settings** — business name + logo upload, KB entries, finance snapshot + COGS inputs, Diagnostics ("Trigger Test Error"), and now **Log Out** at the bottom.
- **`/admin`** — platform-admin-only cross-tenant dashboard.
- **Chat** — global, persistent per-business memory, presented as a top-of-page "Ask" bar (see below).

### Shared plumbing
- `src/lib/anthropic.ts` — Claude client, `askClaude`/`askClaudeJson` (single-shot), `askClaudeConversation` (multi-turn, for Chat).
- `src/lib/business-context.ts` — `getKbContext`, `getFinanceSnapshot`, `getTrendHistoryString`, `calculateCogsMetrics`.
- `src/lib/business-brand.ts` — `getBusinessBrand()`, fetches name + turns `logo_url` into a signed URL (bucket is private). Shared by the layout, Dashboard, and Settings.
- `src/lib/subscription.ts` / `src/lib/stripe.ts` / `src/lib/stripe-customer.ts` / `src/lib/subscription-sync.ts` — billing helpers, see below.

## Stripe billing/tiering (built 2026-07-20, test mode only)

Two tiers — Starter $59/mo, Growth $89/mo — with a 7-day free trial (card required upfront via Stripe Checkout, not charged until day 8).

- **Checkout**: `onboarding/plan/` and `reactivate/` both create Checkout Sessions (`ensureStripeCustomer` creates/reuses a Stripe customer, persisted via `set_stripe_customer_id`). Reactivation checkouts skip the trial (no repeat free trial after a lapse). `allow_promotion_codes: true` lets pilot discount codes be entered directly.
- **Webhook** (`src/app/api/stripe/webhook/route.ts`) — verifies Stripe's signature on every request before touching anything, dedupes via `stripe_webhook_events`, handles `checkout.session.completed` / `customer.subscription.updated` / `customer.subscription.deleted` using the service-role admin client (the one legitimate use of `SUPABASE_SERVICE_ROLE_KEY` in this app, since webhooks have no user session).
- **Real bug found & fixed**: webhook delivery isn't guaranteed to beat Stripe's redirect back to the app — confirmed live when a dropped `stripe listen` connection left a completed trial signup stuck with `subscription_status` still `null`. Fixed with `/checkout/success`, a synchronous fallback that re-verifies and applies the subscription state itself right after redirect, independent of webhook timing. The webhook remains the source of truth for everything after that (renewals, cancellations, portal changes).
- **Gating**: `classifySubscription()` in `src/lib/subscription.ts` maps Stripe's raw status to `never_started | inactive | ok` (a business that predates billing and has `subscription_status = null` is treated as `never_started`, same as a brand-new signup — **every business must go through Checkout, no exemptions**, confirmed explicitly with the user for the team's own pilot business too). `isGrowthTier()` gates Content Studio/Square Integration, redirecting to `/upgrade` (hands off to the Stripe Billing Portal for prorated plan changes).
- **`/reactivate`** — shown when a subscription is `canceled`/`unpaid`; confirmed the business's own data (`decisions`, `finance_data`, `knowledge_base_entries`, etc.) is untouched, only access is gated.
- **One-time welcome banner**: `onboarding/plan/actions.ts` tags its Checkout `success_url` with `&source=onboarding`; `/checkout/success` only forwards to `/dashboard?welcome=1` when that's present (reactivation checkouts don't get the "welcome" messaging). Dashboard shows the banner only when that query param is present — no localStorage needed, it just doesn't appear on normal visits.
- **Verified live end-to-end**, including the pilot coupon: `PILOT25` (25% off, Stripe coupon `duration: "once"`) confirmed via a Stripe test-clock walkthrough to apply only to the first invoice and charge full price from month 2 — this required creating both a Coupon *and* a linked customer-facing Promotion Code (two separate Stripe objects; the coupon alone isn't enough).
- **Stripe CLI** (`stripe listen --forward-to localhost:3000/api/stripe/webhook`) is used for local webhook delivery — this is dev-only and won't exist once deployed; a real deployment needs a registered HTTPS webhook endpoint in Stripe's Dashboard with its own signing secret.

## Persistent Chat memory (built 2026-07-20/21)

Replaced an earlier session-only version. Every message (both roles) is stored permanently in `chat_messages`; `chat_summary` holds a rolling summary of everything older than the recent verbatim window plus a `summarized_through` cursor.

- Once the unsummarized window exceeds 20 messages, the oldest overflow is folded into `chat_summary` via a separate Claude call that **updates** the existing summary (not just appends), bringing the window back down to 16. The split boundary is nudged so the kept window always starts on a `"user"` message, since Anthropic's API requires that.
- `getChatHistory()` loads real history when the panel opens instead of starting blank.
- **Verified live**: a real multi-message conversation survived a full page reload (fresh mount, not retained client state); a follow-up question correctly recalled a detail from several messages back; after seeding past the summarization threshold, a detail that had rolled entirely out of the verbatim window was *still* recalled correctly, proving the summary is actually read as context, not just computed and ignored.

## Ask bar redesign (built 2026-07-21)

Moved Chat from a floating corner bubble to a persistent, always-visible input bar pinned to the top of every `(app)` page (`src/components/ask-bar.tsx`), replacing `chat-panel.tsx` (deleted). Submitting expands it into the full conversation panel below the bar. Found and fixed a real pre-existing bug while verifying this: `(app)/layout.tsx`'s wrapper `<div>` was `flex` with no direction set, so on mobile the nav's top bar and `<main>` sat side-by-side instead of stacked (nav crushed to a ~98px sliver, main to ~2px wide) — fixed to `flex-col md:flex-row`. Verified functionally at both desktop and mobile widths.

## Dashboard redesign + business logo upload (built 2026-07-21)

The Dashboard had never actually been rebuilt since onboarding — it was still structurally the "onboarding complete" confirmation screen. New order, top to bottom: one-time welcome banner (see above) → header (logo + business name + industry) → COGS staleness reminder → **Finance Snapshot** (now the centerpiece — bigger stat typography, wider page container) → Priorities (stays visible) → Business Info (Overview + Products, collapsed by default, click to expand). Log Out moved to the bottom of Settings.

Logo upload is the first use of Supabase Storage in this app — see the Schema section above for the bucket/RLS/RPC design. Settings has a file input + preview next to the business name field; the nav header shows the business's logo + name as the primary line with a small "Powered by IntelliCEO" line underneath, falling back to plain "IntelliCEO" if no logo/name is set.

## The big RLS anomaly — CLOSED, root cause confirmed

`completeOnboarding`'s original `businesses` INSERT failed with `42501` despite exhaustively proving `auth.uid()` resolves correctly. **Confirmed root cause (Supabase support):** the Supabase client's default `.insert()` requests `return=representation`, which requires the new row to satisfy a SELECT policy at that exact instant — the original code inserted `businesses` before `profiles`, so briefly no SELECT policy could prove ownership. **Fix, permanent:** `create_business_and_profile()` creates both rows atomically before anything requests a representation back.

## Platform Admin recursion bug — CLOSED

The original admin RLS policies checked admin status via a subquery directly inside a policy **on** `profiles` — a policy whose own check queries the table it's defined on causes infinite recursion (`42P17`), breaking *every* query against `profiles` for *every* account. **Fixed** via `public.is_platform_admin()`, a SECURITY DEFINER function that bypasses RLS for this specific check. **Lesson:** never write an RLS policy whose USING clause queries the same table it's attached to.

## Key lessons / gotchas

1. **Next.js "use server" files:** every export must be an async function; shared constants need their own plain module.
2. **Service worker in dev:** only registers in production (`ServiceWorkerRegistration`) — registering unconditionally causes stale cached JS across dev-server restarts.
3. **Never write a self-referencing RLS policy** — route that kind of check through a SECURITY DEFINER function.
4. **PostgREST schema cache can go stale** after SQL-Editor DDL — `notify pgrst, 'reload schema';` or the dashboard's "Reload schema cache" button.
5. **Supabase SQL Editor runs a pasted block as one batch** — write idempotent migrations (`drop policy if exists`, `create or replace function`, `add column if not exists`) so re-running after a partial failure is always safe.
6. **This session's shells don't have Node on PATH by default** — prefix Bash commands with `export PATH="$PATH:/c/Program Files/nodejs"`.
7. **Always `rm -rf .next` before restarting `dev` right after running `build`** — otherwise the route manifest corrupts and breaks every route.
8. **Anthropic's `messages` array must start with role `"user"`** — relevant anywhere conversation history gets sliced (Chat's summarization window boundary nudges forward by one if it would otherwise start on `"assistant"`).
9. **`businesses` has no general tenant UPDATE policy, on purpose** — every self-service field on it needs its own narrow SECURITY DEFINER RPC (`set_stripe_customer_id`, `set_business_logo_url`, `set_business_name`). If a future field needs tenant self-service writes, follow this pattern rather than adding a broad UPDATE policy.
10. **This specific browser-based testing tool has recurring artifacts** that are tooling issues, not app bugs — seen multiple times this session: (a) a stale/incomplete cached CSS chunk served despite the real file being complete (verified via direct `curl`); (b) React's streamed Suspense content sometimes sits correctly resolved in a hidden reveal template (`id="S:.."`) while the swap-in script never fires, leaving the loading skeleton visibly stuck (verified by reading the hidden node's content directly). Always verify via direct content extraction or a raw `curl` before concluding something is actually broken.
11. **File inputs can't be scripted** for security reasons — to test an upload flow, get a real access token via the password grant and call the same Storage/RPC endpoints directly, rather than trying to drive the file picker.
12. **On this Windows box, `python3` resolves to a Windows Store alias** that doesn't understand Git Bash's `/c/...` paths — use `/usr/bin/base64` and other MSYS-native tools for file I/O in Bash instead.

## Environment / credentials status

- `.env.local`: Supabase URL + publishable key + `SUPABASE_SERVICE_ROLE_KEY` (now set — needed for the Stripe webhook), `ANTHROPIC_API_KEY`, Sentry DSN vars, Stripe test-mode `STRIPE_SECRET_KEY`/`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`/`STRIPE_WEBHOOK_SECRET` (from local `stripe listen`)/`STRIPE_PRICE_STARTER`/`STRIPE_PRICE_GROWTH` — all set, all test mode.
- Stripe CLI installed locally (`winget install Stripe.StripeCli`), authenticated to the user's Stripe account (`pathoflifeacademy.org`, `acct_1Kv6TIKopQhwQMnN`) — confirm this is the intended account before going live.
- User's real account: `farellduclair@gmail.com`, business "Dolce Mondo Sweets & Coffee" — has gone through a real (test-mode) Checkout like any other business, no special-casing.

## Git status

Everything through the Dashboard redesign is committed and pushed to `origin/main` (latest: `34b2ffb`, "Rename Morning Brief to CEO Brief, rebuild the Dashboard, add logo upload"). Run `git log`/`git status` to confirm current state before assuming anything is pending.

## What's left before onboarding a real pilot business

Roughly in priority order:

1. **Nothing is deployed.** No Vercel (or other) production deployment exists yet.
2. **Stripe is test mode only** — live mode needs its own Products/Prices (test IDs don't carry over), live API keys, and the `PILOT25` coupon + promotion code recreated in live mode.
3. **No production webhook endpoint** — only the local `stripe listen` CLI tunnel exists; a real deployment needs a registered HTTPS endpoint in Stripe's Dashboard with its own signing secret.
4. **Production environment variables** need to be configured on whatever host is used — every secret currently in `.env.local`.
5. **No legal pages** — no Terms of Service or Privacy Policy anywhere in the app.
6. **Email deliverability unconfirmed** — Supabase Auth's default sender may be rate-limited/shared; worth confirming before real users sign up.

Lower priority, not blocking a first pilot: no automated test suite (everything verified via manual live-browser testing), no rate limiting on Chat's Claude calls, no in-app support/contact channel, a handful of test businesses/accounts sitting in the database (harmless — fully RLS-isolated from anything real).
