# IntelliCEO — Progress Status

_Last updated: 2026-07-27 (later same day). Written to let a fresh session pick up with full context after a context-limit reset. This update was written by directly re-verifying the current state of the repo, live database, and git history — some of the work described below (the sections marked accordingly) happened outside this session's own visible conversation history, so it's documented from ground truth (file contents, git log, live queries) rather than from memory of building it._

## What this is

Multi-tenant, paid AI operating system for small businesses, starting with food & beverage. Replaces an existing Streamlit app called `dolce-mondo-atlas`, which stays live and untouched as the daily-driver tool until this app is ready to take over — don't touch or redeploy `dolce-mondo-atlas`.

The legacy Streamlit source (`atlas_dashboard.py` + 13 knowledge-base markdown files) was added locally by the user in a `Reference/` folder — **gitignored, not in this repo**. Read it directly before touching CEO Brief / Vital Signs / Content Studio again; it's the ground truth for prompts, JSON shapes, and UX, not the schema alone.

## Stack

- Next.js 16.2.10 (App Router, TypeScript, Tailwind v4), mobile-first PWA (manifest, service worker — production-only registration, no longer caches `/` since it's a pure auth-redirect route, not static content)
- Supabase (Postgres + Auth + RLS + Storage + **Vault**, used for encrypting POS access tokens at rest). Project ref `wiizwguxbnpxhzjekzvm`
- Stripe (subscriptions, Checkout, Billing Portal, webhooks) — **test mode locally, live mode fully wired in production as of 2026-07-27 evening** (correct account verified, prices/coupon verified, webhook registered and reachable) — see the Stripe live-mode section below
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
12. **Turbopack has shown at least one JSX whitespace-collapsing quirk** — `<span>Label.</span> Rest of text` on byte-identical source patterns rendered correctly in some spots and silently dropped the space in others in the compiled/served HTML. Use explicit `{" "}` after inline elements followed by text rather than relying on implicit JSX whitespace, especially in prose-heavy content. Verify via raw HTML/RSC payload (`curl` + grep), not the browser text-extraction tool, which has its own separate whitespace artifacts (see lesson 11).
13. **Running `npm run build` while `next dev` is still running on the same directory corrupts the dev server** (`Internal Server Error` on the next request) — this is lesson 6 biting mid-session, not just at session start. Stop the dev server, `rm -rf .next`, and restart it after any one-off production build.
14. **`curl -L` (follow redirects) can hide the exact failure mode you're trying to rule out.** Verifying the Stripe webhook route was "reachable" with `curl -L` returned the expected 405 from the real handler — but it followed a 308 apex→www redirect that Stripe itself does not follow, so the check passed while the real integration was completely broken. When verifying that an external service can reach an endpoint, match how that service actually behaves (no `-L`), not the version of the check that's easiest to pass.
15. **A synchronous fallback path can mask a fully broken async one.** `/checkout/success`'s webhook-race fallback made the app behave correctly even while the webhook itself never once succeeded — "the feature works from the user's side" is not proof the thing behind it (webhook, queue, cron, etc.) is actually functioning. Check the mechanism directly (logs, idempotency tables, the external service's own delivery status), not just the visible outcome.

## Environment / credentials status

- `.env.local`: Supabase URL + publishable key + `SUPABASE_SERVICE_ROLE_KEY` (needed for the Stripe webhook), `ANTHROPIC_API_KEY`, Sentry DSN vars, Stripe test-mode keys/price IDs/webhook secret (from local `stripe listen`), `RESEND_API_KEY` — all set. Local dev intentionally stays on Stripe **test-mode** keys even after production went live-mode, so local testing never risks a real charge.
- The local Stripe CLI's `stripe listen` session is still authenticated to `pathoflifeacademy.org` (`acct_1Kv6TIKopQhwQMnN`) for test-mode webhook forwarding during local dev — **this is a different, unrelated account from the live IntelliCEO Stripe account below**, confirmed intentionally separate, not a mix-up.
- `contact@intelliceo.com` is used as the outbound sender for the marketing site's contact form (`src/lib/email.ts`). `RESEND_API_KEY` (sending-only restricted key) is set in both `.env.local` and Vercel production as of 2026-07-27 — a real send through the live form succeeded and the user confirmed it arrived in `help@intelliceo.com` the same day. Fully working, closed.

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

**Delivery confirmed by the user 2026-07-27** — the test message landed in `help@intelliceo.com`. Contact form is fully working end-to-end in production, not just accepted at the API level.

## Stripe live-mode switch — done same day, 2026-07-27

User created live Products/Prices/coupon/webhook directly in the Stripe dashboard (Workbench UI — note it now calls webhook endpoints "event destinations," reached via **Webhooks → Add destination → Webhook endpoint**, not "Add endpoint" as older Stripe docs describe) and handed over the resulting credentials. Before wiring anything in, independently verified via the Stripe API (not just trusting the values):

- **Account identity** — `GET /v1/account` with the live secret key returned `acct_1TvAOb7nEX2itCJG`, business name **"IntelliCEO"**, `farellduclair@gmail.com`, `charges_enabled: true`. Confirmed **not** the `pathoflifeacademy.org` account the local Stripe CLI happens to be authenticated to (see Environment section above) — that was a real risk worth checking given how easy it'd be to grab the wrong account's keys.
- **Prices** — `price_1TxuzO7nEX2itCJGq7WyPHUk` = **$59.00/mo USD recurring** (Starter), `price_1TxuzL7nEX2itCJGduT5wQiU` = **$89.00/mo USD recurring** (Growth). Both `livemode: true`, `active: true`. Exact match.
- **PILOT25 coupon** — fetched the underlying coupon object (`GET /v1/coupons/PILOT25`): `percent_off: 25`, `duration: "once"` (first month only), `livemode: true`. Matches the intended pilot offer exactly.
- **Webhook destination** — created at `https://intelliceo.com/api/stripe/webhook`, API version `2026-06-24.dahlia` (matches `src/lib/stripe.ts:9` exactly), listening to the 3 events the handler actually switches on (`checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, per `src/app/api/stripe/webhook/route.ts:36-54`). This Workbench version has no "send test event" feature (destination's "⋯" menu only has Disable/Roll Secrets/Delete) — so a real signed-event round-trip couldn't be tested short of an actual live transaction. What *was* confirmed: the route is live and reachable in production (`curl` returns `405 Method Not Allowed` on a bare GET — correct, since it's a POST-only handler).

**All 5 Stripe env vars added to Vercel production** (`vercel env add <NAME> production`, values piped from a variable so secrets never appeared in a command string) and deployed together in one `vercel --prod`, per explicit instruction not to deploy until the webhook was registered:
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_live_...`
- `STRIPE_SECRET_KEY` = `sk_live_...`
- `STRIPE_PRICE_STARTER` = `price_1TxuzO7nEX2itCJGq7WyPHUk`
- `STRIPE_PRICE_GROWTH` = `price_1TxuzL7nEX2itCJGduT5wQiU`
- `STRIPE_WEBHOOK_SECRET` = `whsec_...`

**Only unverified piece:** whether the webhook actually processes a real signed event end-to-end (200 response, `stripe_webhook_events` idempotency row written, subscription status updated correctly) — this will resolve itself on the first real pilot signup. Worth checking Stripe's **Event deliveries** tab (on the destination's detail page) or Sentry right after that first signup.

### The first real signup exposed a real bug: webhook silently never arrived (found and fixed same day)

User ran a real live-mode test signup through Checkout. The subscription activated correctly (`subscription_status: "trialing"`, right customer/subscription IDs) — but that success was misleading. Investigating properly (checking Stripe's event record, the `stripe_webhook_events` table, and Vercel's runtime logs, not just trusting the UI) found:

- The Stripe event for that checkout showed `pending_webhooks: 1` — Stripe's own signal that it had **not** recorded a successful delivery, even 8+ minutes after the event fired (Stripe's first delivery attempt is near-instant).
- `stripe_webhook_events` had **no row** for that event — the webhook handler never ran.
- Vercel's production logs for that exact window showed the entire real flow (`/signup` → `/onboarding` → `/onboarding/plan` → `/checkout/success` → `/dashboard`) but **zero requests to `/api/stripe/webhook`** — the request never reached the app at all.

**Root cause:** the webhook was registered at `https://intelliceo.com/api/stripe/webhook` (apex domain). That URL returns a **308 redirect** to `https://www.intelliceo.com/...` (confirmed via `curl -D -`). **Stripe does not follow HTTP redirects when delivering webhooks** — a 3xx response is treated as a failed delivery, full stop.

**Why this wasn't caught during setup:** the original "webhook route reachable" check earlier the same day used `curl -L` (follow redirects), which silently followed the 308 and returned the expected `405 Method Not Allowed` from the real handler — masking the fact that a *non-redirect-following* client (i.e., Stripe itself) would only ever see the redirect and never reach the app. `curl -L` proved the destination existed; it didn't prove Stripe could actually reach it. Lesson: when checking whether an external service can reach an endpoint, verify with a request that behaves like that service actually would (no `-L`), not the version of the check that's convenient to pass.

**Why the app still "worked" anyway:** `/checkout/success` (`src/app/checkout/success/page.tsx:7-14`) has a synchronous fallback specifically for "the webhook might not have arrived yet by the time the user is redirected back" — it independently re-fetches the Checkout Session and applies the same subscription update itself. That fallback is exactly why the business record was correct despite the webhook having silently and completely failed. It's a good defensive feature, but it also means "the app behaves correctly" is not proof the webhook itself works — this is worth remembering any time webhook health is in question going forward.

**Fix:** updated the webhook endpoint's URL via the Stripe API directly (`POST /v1/webhook_endpoints/we_1Txw0s7nEX2itCJG48wgSsAm` with `url=https://www.intelliceo.com/api/stripe/webhook`) — Stripe allowed editing the URL in place, so **no new destination or signing secret was needed**; the existing `STRIPE_WEBHOOK_SECRET` in Vercel is still correct and wasn't touched.

**Fix confirmed working via a second real test signup:**
- Vercel logs show a real `POST /api/stripe/webhook` at 18:29:58, arriving *before* `/checkout/success` even loaded — the webhook won the race this time instead of needing the fallback.
- The new Stripe event (`evt_1Txxy67nEX2itCJGOHoebjNj`) shows `pending_webhooks: 0` — Stripe considers it successfully delivered.
- A matching row now exists in `stripe_webhook_events` with a real `created_at` timestamp — the handler actually ran, not just returned a generic ack.
- The business row updated correctly (`subscription_status: "trialing"`, correct customer/subscription IDs, correct trial end date).

**Known loose end, explained and low-priority:** the *original* failed event (`evt_1TxxbM7nEX2itCJGJ8CkcTGP`) still showed `pending_webhooks: 1` on re-check — Stripe's automatic retry-with-backoff hadn't kicked in yet by the time this was checked. Since a second, fully independent real event has since proven the pipeline works end-to-end at the corrected URL, this first one is treated as a known, fully-explained artifact of the URL bug rather than something that needs to keep being chased.

## Clover audit — confirmed nothing was missed alongside the Stripe switch (2026-07-27)

User asked to confirm Clover was switched from sandbox to production alongside Stripe, per an earlier decision to do both together. Checked directly against the live database (via `SUPABASE_SERVICE_ROLE_KEY` against the PostgREST REST API) rather than assuming:

- `CLOVER_API_BASE_URL` — confirmed still unset in Vercel production, which means it already defaults to the real production host (`https://api.clover.com`) per `src/app/(app)/pos-integration/actions.ts:161`. Nothing needed here — this was already correct going back to whenever it was first left unset.
- **Only one business in the entire database has Clover configured at all** (`merchant_id: W3SMVM0KSDEE1`), and it belongs to **"Stripe Test Bakery (Renamed)"** — a test account created 2026-07-20 during the earlier Stripe billing test-clock walkthrough, not a real pilot business.

**Conclusion: there is no real pilot business using Clover yet for a sandbox→production credential swap to even apply to.** Nothing was missed — this becomes real work only once an actual pilot business connects Clover, at which point they enter their own real production access token via `/pos-integration` and it hits the production API by default already.

## Privacy Policy and Terms of Service pages — built and deployed 2026-07-27

`/privacy` and `/terms` were **linked from the footer on every marketing page but didn't exist** — confirmed via `curl` returning a real `404` in production, not just placeholder content. This was flagged as a blocker before any real paying pilot business, given Stripe Checkout would be collecting payment with no accessible legal terms.

Built from user-supplied `Privacy_Policy.md` / `Terms_of_Service.md` (11 and 16 sections respectively), with `[DATE]` replaced by the actual publish date (July 27, 2026):
- `src/app/(marketing)/privacy/page.tsx` + `src/components/marketing/sections/legal/PrivacyPolicyContent.tsx`
- `src/app/(marketing)/terms/page.tsx` + `src/components/marketing/sections/legal/TermsOfServiceContent.tsx`
- Shared `src/components/marketing/sections/legal/LegalLayout.tsx` (`LegalLayout` + `LegalSection`) — deliberately a single continuous long-form article (one `Reveal` on the header only) rather than the stacked-marketing-section pattern used on Security/About, per "readable long-form typography over decoration." Uses the same design tokens as the rest of the site (Manrope font, `mkt-text-primary`/`secondary`/`muted` colors, `pageHeadline` typography scale, `ProseWidth`/`Container`).

**Found and fixed a real Turbopack JSX whitespace bug while building this:** several `<span>Label.</span> Rest of sentence` constructs silently lost the space between the closing tag and the following text in the compiled/served HTML, confirmed via raw HTML/RSC-payload inspection (not the browser text-extraction tool, which has its own known artifacts per lesson #11 below) — byte-identical source patterns rendered correctly in some spots and incorrectly in others, so it wasn't a typo. Fixed throughout both files by using explicit `{" "}` instead of relying on implicit JSX whitespace adjacency.

Verified: `tsc --noEmit` clean, production build clean (`○ /privacy` and `○ /terms` both statically prerendered), visually checked in a local dev server (correct headings/links/lists, computed styles match the site's Manrope/color-token system, no console errors), then deployed to production — `curl` now returns `200` for both, footer links resolve instead of 404ing.

**New lesson learned:** running a separate one-off `npm run build` while a `next dev` server is still running on the same directory corrupts the dev server's `.next` state (`Internal Server Error` on next request) — confirms lesson #6 below applies even mid-session, not just at session start; the dev server needs a full stop + `rm -rf .next` + restart afterward, not just a page refresh.

## Git status — check this carefully before assuming anything is pushed

As of this writing, `origin/main` and local `main` are identical through commit `0452060` ("Add marketing site, Vault-encrypted POS credentials migration") — working tree is clean, nothing outstanding. That commit landed everything the previous update flagged as uncommitted: the entire marketing site, `migration_pos_credentials_vault.sql`, the two brief docs, and the accumulated modifications to `.env.local.example`/`.gitignore`/`intelliceo_schema.sql`/`package.json`/`package-lock.json`.

Still run `git status`/`git diff` at the start of a fresh session to confirm — this note is a snapshot, not a guarantee.

## What's left before onboarding a real pilot business

1. ~~Nothing is deployed via a verifiable-from-this-repo path~~ — **confirmed live 2026-07-27**, both marketing site and product app serving correctly, auth gating works. See Deployment verification section above.
2. ~~Production missing most env vars~~ — **`SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_DSN` added and redeployed 2026-07-27.** Chat/CEO Brief/Content Studio should now work in production — not yet confirmed end-to-end by an actual logged-in test (needs the user, since creating/signing into an account isn't done on their behalf). Sentry should now be receiving prod events — not yet confirmed by checking the Sentry dashboard after a real triggered error.
3. ~~Stripe live-mode switch~~ — **done and fully verified 2026-07-27**: correct account, live Prices ($59/$89), and `PILOT25` verified via the Stripe API; all 5 env vars deployed. The first real test signup then exposed a real bug — the webhook was registered at the apex domain, which 308-redirects to `www`, and Stripe doesn't follow redirects for webhook delivery, so it silently never arrived (masked by `/checkout/success`'s fallback, which made the app look fine anyway). **Fixed** by updating the webhook URL to the `www` host via the Stripe API (no new signing secret needed) and **confirmed working end-to-end via a second real test signup** — real `POST /api/stripe/webhook` in Vercel logs, Stripe shows `pending_webhooks: 0`, and a matching `stripe_webhook_events` row exists. See the full story in the Stripe live-mode section above.
4. ~~Clover production switch~~ — **audited 2026-07-27, confirmed nothing was missed.** `CLOVER_API_BASE_URL` already defaults to production when unset (already correct). The only Clover-configured business in the database is a test account, not a real pilot business — so there's no live sandbox credential sitting in production to swap. Becomes real work only when an actual pilot business connects Clover.
5. ~~Contact form broken~~ — **`RESEND_API_KEY` obtained, added to prod, redeployed, and live-tested successfully 2026-07-27, with inbox delivery to `help@intelliceo.com` confirmed by the user the same day.** Fully working, closed.
6. **Email deliverability for Supabase Auth** (signup confirmation, password reset) — still unconfirmed.
7. ~~`/privacy` and `/terms` didn't exist (404 from the footer links)~~ — **built and deployed 2026-07-27** from user-supplied source docs, same design system as the rest of the site. See Privacy/Terms section above.

Lower priority: no automated test suite, no rate limiting on Chat's Claude calls, a handful of test businesses/accounts sitting in the database (harmless, RLS-isolated).
