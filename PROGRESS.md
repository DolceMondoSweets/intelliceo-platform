# IntelliCEO — Progress Status

_Last updated: 2026-07-27. Written to let a fresh session pick up with full context after a context-limit reset. This update was written by directly re-verifying the current state of the repo, live database, and git history — some of the work described below (the sections marked accordingly) happened outside this session's own visible conversation history, so it's documented from ground truth (file contents, git log, live queries) rather than from memory of building it._

## What this is

Multi-tenant, paid AI operating system for small businesses, starting with food & beverage. Replaces an existing Streamlit app called `dolce-mondo-atlas`, which stays live and untouched as the daily-driver tool until this app is ready to take over — don't touch or redeploy `dolce-mondo-atlas`.

The legacy Streamlit source (`atlas_dashboard.py` + 13 knowledge-base markdown files) was added locally by the user in a `Reference/` folder — **gitignored, not in this repo**. Read it directly before touching CEO Brief / Vital Signs / Content Studio again; it's the ground truth for prompts, JSON shapes, and UX, not the schema alone.

## Stack

- Next.js 16.2.10 (App Router, TypeScript, Tailwind v4), mobile-first PWA (manifest, service worker — production-only registration, no longer caches `/` since it's a pure auth-redirect route, not static content)
- Supabase (Postgres + Auth + RLS + Storage + **Vault**, used for encrypting POS access tokens at rest). Project ref `wiizwguxbnpxhzjekzvm`
- Stripe (subscriptions, Checkout, Billing Portal, webhooks) — **test mode locally, entirely absent from production** (no Stripe env vars set on Vercel at all as of 2026-07-27), live-mode setup in progress — see the "what's left before a pilot" list at the bottom
- `@anthropic-ai/sdk` for Claude-backed features (model: `claude-sonnet-5`) — the assistant persona is "IntelliCEO" throughout; a prior "Atlas" naming (leftover from the reference app this replaces) has been fully removed, confirmed zero remaining references anywhere in the repo
- `@sentry/nextjs` for error tracking — confirmed receiving real events locally; DSN vars only added to production 2026-07-27, not yet independently confirmed receiving real prod events
- A marketing/public site now exists (`src/app/(marketing)/`) alongside the product app — home page, Security page, help center, contact form with email sending (`src/lib/email.ts`, `contact@intelliceo.com`, live-tested working 2026-07-27). Committed in `0452060`.
- Deploy target: Vercel, domain `intelliceo.com` — **independently confirmed live 2026-07-27** by browsing directly (not just taking the user's word): marketing site and product app both serve correctly, project is `intelli-ceo/intelliceo-platform`, aliased to `www.intelliceo.com`.

## Schema

`intelliceo_schema.sql` at repo root is the source of truth for a **fresh** install, but there is no Supabase CLI/migration link set up — the live database is migrated by hand via the SQL Editor. **Schema.sql and the live DB can drift.** When adding schema changes, always also hand the user an explicit `ALTER`/`CREATE` SQL snippet to run live; don't assume updating schema.sql alone does anything to the real database. This pattern has been used for every schema change so far.

**Tables:** `businesses` (+ billing fields `stripe_customer_id`/`stripe_subscription_id`/`subscription_status`/`trial_ends_at`, plus `logo_url`), `profiles` (+ `is_platform_admin`, `last_login_at`), `finance_data` (+ `monthly_cogs`, `monthly_labor_cost`, `cogs_updated_at`, `budgeted_revenue`/`budgeted_cogs`/`budgeted_labor` — **no `runway` column**, runway is always derived from `cash/burn`, never stored), `decisions`, `goals` (new — mirrors Decisions Log), `brief_history`, `marketing_drafts`, `knowledge_base_entries`, `pos_credentials` (**renamed from `square_credentials`** — now has a `pos_type` discriminator for Square vs. Clover, and stores the access token **encrypted in Supabase Vault**, not in plaintext — see below), `stripe_webhook_events` (webhook idempotency), `chat_messages`, `chat_summary` (persistent Chat memory).

**Storage:** `business-logos` bucket — private, 2MB limit, `image/png|jpeg|webp` only, RLS-scoped via `storage.objects` policies.

**Functions (all SECURITY DEFINER):** `create_business_and_profile`, `record_login`, `is_platform_admin`, `set_stripe_customer_id`, `set_business_logo_url`, `set_business_name`, and — for POS credentials — `set_pos_access_token`, `get_pos_access_token`, `has_pos_access_token` (see the Vault section below). All of these exist because `businesses`/`pos_credentials` have no general tenant UPDATE/SELECT-of-secret policy for these specific fields; each gets a narrow, single-purpose RPC instead of a broad policy.

## POS credentials: Vault encryption (confirmed live via direct query, 2026-07-21)

`pos_credentials.access_token` used to store each business's live Square/Clover API token in **plain text** — readable by anyone with database/table access (a dashboard user, a leaked service-role key, a misconfigured admin query). `migration_pos_credentials_vault.sql` (repo root, committed in `0452060`) is a three-phase migration: (1) additive — enables the `supabase_vault` extension, adds `access_token_secret_id`, backfills existing tokens into `vault.secrets`; (2) a read-only verification `SELECT` to eyeball before proceeding; (3) destructive — drops the plaintext `access_token` column.

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

## Marketing site (built, committed in `0452060`)

A public marketing site now exists alongside the product app under `src/app/(marketing)/` (root `src/app/page.tsx` was deleted in favor of this). Includes a home page, a **Security page** (`src/app/(marketing)/security/page.tsx`) built from nine section components (`src/components/marketing/sections/security/` — Hero, Data Encryption, Auth, Financial Data, Data Ownership, AI Data Usage, Third-Party Services, Data Retention, Responsible Disclosure, Contact), a help center (`public/help-center/`), brand assets (`public/brand/`), and a working contact form (`src/components/marketing/sections/contact/ContactForm.tsx` → `src/lib/email.ts`, sending via Resend as `contact@intelliceo.com`). Two brief-writing docs (`IntelliCEO_Website_Brief_Corrected_1.md`, `IntelliCEO_Website_Master_Brief_Original.md`) are sitting at the repo root, also now committed.

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
- `contact@intelliceo.com` is used as the outbound sender for the marketing site's contact form (`src/lib/email.ts`). `RESEND_API_KEY` (sending-only restricted key) is now set in both `.env.local` and Vercel production as of 2026-07-27, and a real send through the live form succeeded at the API level — inbox delivery to `help@intelliceo.com` still needs the user's own confirmation.

## Deployment verification (done 2026-07-27) — live, but production env vars are far from complete

Checked `intelliceo.com` directly in a browser (not taking the user's word this time):

- **Marketing site is live and correct** — home page renders fully (all copy/sections present), no console errors.
- **Product app is live and correct** — `/login` and `/signup` render properly (served from `www.intelliceo.com`, all JS/CSS chunks return 200), and hitting `/dashboard` while unauthenticated correctly redirects to `/login` instead of erroring — auth gating works in production.
- **But: production has only 2 of ~15 expected env vars set.** Ran `vercel env ls` (Vercel CLI, already authenticated as `farellduclair-9227`, project `intelli-ceo/intelliceo-platform`) against every environment (Production/Preview/Development) — **only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set, anywhere.** Everything else in `.env.local.example` is completely absent from Vercel, not just pointing at test values:
  - `SUPABASE_SERVICE_ROLE_KEY` — missing. Onboarding (`create_business_and_profile`) and the Stripe webhook handler both need this.
  - `ANTHROPIC_API_KEY` — missing. **Every Claude-backed feature (Chat/Ask bar, CEO Brief, Content Studio) is non-functional in production right now.**
  - `NEXT_PUBLIC_SENTRY_DSN` / `SENTRY_DSN` (+ optional `SENTRY_ORG`/`SENTRY_PROJECT`/`SENTRY_AUTH_TOKEN`) — missing. The "confirmed receiving real events" note elsewhere in this doc was from local dev, not production — **Sentry is not tracking anything in prod**.
  - `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_STARTER`, `STRIPE_PRICE_GROWTH` — all missing. Billing isn't just "test mode" in production, it's **entirely non-functional** (no test mode fallback exists — the code assumes real keys).
  - `RESEND_API_KEY` — missing. **Confirmed by live test**, see below.
- **Contact form test (done 2026-07-27):** filled out and submitted the live `/contact` form (General Inquiries category, using `farellduclair@gmail.com` as the reply-to, message clearly marked as a deployment test). Result: `"Message sending isn't configured yet — please email us directly instead."` — the code's own guard in `submitContactForm` (`src/app/(marketing)/contact/actions.ts:32`) caught the missing `RESEND_API_KEY` and returned a graceful error *before* calling Resend. **No email was sent** — nothing will land in `help@intelliceo.com` or `info@intelliceo.com` from this test, so there's nothing for Farell to go check. The form fails safely (no crash, no silent black hole), but it's non-functional until `RESEND_API_KEY` is added to production and the `intelliceo.com` sending domain is verified in Resend.
- **Clover sandbox vs. production is not an env var switch** — checked `src/app/(app)/pos-integration/actions.ts:161`: the only global Clover setting is `CLOVER_API_BASE_URL`, which **defaults to production (`https://api.clover.com`) when unset** — and it is unset in Vercel, so Clover API calls in prod are already hitting the real production host by default. There's no app-level Clover Client ID/Secret anywhere (no OAuth flow) — each business pastes their own Clover **access token + merchant ID** directly into `/pos-integration` (`pos-integration-client.tsx`), stored per-business via the Vault RPCs. So "switching Clover to production" isn't a platform config change — it's each pilot business re-entering a real production Clover access token/merchant ID in place of whatever sandbox one they used for testing.

### Fixed same day: 4 of the 6 missing var groups added to production, redeployed

Copied the working local values (via `vercel env add <NAME> production`, piped from `.env.local` so secrets never appeared in a command string) for `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, `NEXT_PUBLIC_SENTRY_DSN`, and `SENTRY_DSN`. Then ran `vercel --prod` to redeploy — build succeeded (32 routes, Next.js 16.2.10/Turbopack, ~45s), aliased back to `www.intelliceo.com`, re-checked the live site afterward (no console errors, marketing home still renders correctly).

**Still outstanding, deliberately not touched:**
- All Stripe vars — intentionally deferred, being handled as its own live-mode workstream (see below), separate from this env var cleanup.
- **Not independently re-verified in this session:** whether Chat/CEO Brief/Content Studio actually work end-to-end now that `ANTHROPIC_API_KEY` is live in production — that requires signing into a real business account, which needs the user to do since creating/logging into accounts isn't something to do on their behalf. Same for confirming Sentry is now actually receiving prod events (would need to trigger a real error and check the Sentry dashboard).

### RESEND_API_KEY: obtained, added, redeployed, live-tested (same day, 2026-07-27)

User provided a real Resend API key. It's a **sending-only restricted key** (confirmed by a `GET /domains` API check returning `401 restricted_api_key: "This API key is restricted to only send emails"`) — correct least-privilege scope for what the contact form needs; it does mean domain-verification status can't be checked via this key's own API access.

Added to `.env.local` (local dev now matches prod for the first time on this var) and to Vercel production via `vercel env add RESEND_API_KEY production`, then redeployed (`vercel --prod`) — build succeeded, aliased to `www.intelliceo.com`.

**Live-tested against the real production form afterward:** submitted `/contact` with category "Beta Support" (routes to `help@intelliceo.com` per `src/content/contact.ts:15`), name "Farell Duclair (Resend fix verification)", reply-to `farellduclair@gmail.com`, a message explicitly asking the reader to confirm delivery. Confirmed via direct DOM inspection (not just visual) that the form's success state rendered — `"Message sent."` — which only happens when `submitContactForm` gets no error back from `resend.emails.send()`. A fresh POST to `/contact` was visible in the network log at the time of this submission, confirming it wasn't a stale/cached result.

**Important caveat:** "sent successfully" from the app means Resend's API accepted the send without an error — it does **not** guarantee actual inbox delivery (could still bounce or land in spam depending on domain/DNS/SPF/DKIM setup). **The user needs to independently check `help@intelliceo.com` to confirm the message actually arrived** before considering this fully closed.

## Git status — check this carefully before assuming anything is pushed

As of this writing, `origin/main` and local `main` are identical through commit `0452060` ("Add marketing site, Vault-encrypted POS credentials migration") — working tree is clean, nothing outstanding. That commit landed everything the previous update flagged as uncommitted: the entire marketing site, `migration_pos_credentials_vault.sql`, the two brief docs, and the accumulated modifications to `.env.local.example`/`.gitignore`/`intelliceo_schema.sql`/`package.json`/`package-lock.json`.

Still run `git status`/`git diff` at the start of a fresh session to confirm — this note is a snapshot, not a guarantee.

## What's left before onboarding a real pilot business

1. ~~Nothing is deployed via a verifiable-from-this-repo path~~ — **confirmed live 2026-07-27**, both marketing site and product app serving correctly, auth gating works. See Deployment verification section above.
2. ~~Production missing most env vars~~ — **`SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_DSN` added and redeployed 2026-07-27.** Chat/CEO Brief/Content Studio should now work in production — not yet confirmed end-to-end by an actual logged-in test (needs the user, since creating/signing into an account isn't done on their behalf). Sentry should now be receiving prod events — not yet confirmed by checking the Sentry dashboard after a real triggered error.
3. **Stripe needs to go from nonexistent to live in production** — not a test→live swap, since prod currently has no Stripe env vars at all. Needs, together: live Products/Prices matching Starter $59/Growth $89 exactly, live API keys, a real registered webhook endpoint (replacing the local `stripe listen` tunnel), and `PILOT25` recreated in live mode. **In progress** — user is creating the live Products/Prices/coupon/webhook in the Stripe dashboard directly, will hand back the resulting keys/IDs to wire in.
4. **Clover production switch is a per-business data task, not a config change** — `CLOVER_API_BASE_URL` is already unset in prod, which defaults to the real production Clover host. Each pilot business just needs to paste a real production Clover access token + merchant ID into `/pos-integration` in place of any sandbox one used for testing.
5. ~~Contact form broken~~ — **`RESEND_API_KEY` obtained, added to prod, redeployed, and live-tested successfully 2026-07-27** (see Deployment verification section above). App-level confirmation only — **the user still needs to check `help@intelliceo.com` directly to confirm the test message actually arrived**, since a successful API response doesn't guarantee inbox delivery.
6. **Email deliverability for Supabase Auth** (signup confirmation, password reset) — still unconfirmed.

Lower priority: no automated test suite, no rate limiting on Chat's Claude calls, a handful of test businesses/accounts sitting in the database (harmless, RLS-isolated).
