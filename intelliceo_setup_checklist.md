# IntelliCEO Migration — Day One Setup Checklist

## Accounts to create (you, not Claude — these need your own login/payment info)

- [ ] **Supabase** — supabase.com → New Project → name it "IntelliCEO" or similar.
      Save the Project URL and the `anon` + `service_role` API keys (Settings → API).
      Recommend upgrading to Pro ($25/mo) to avoid free-tier auto-pause after 7 days inactivity.

- [ ] **Vercel** — vercel.com → sign up, connect your GitHub account.

- [ ] **OneSignal** — onesignal.com → New App → Web Push. Save the App ID + REST API Key.

- [ ] **New GitHub repo** — e.g. `intelliceo-platform`. Keep `dolce-mondo-atlas` untouched and running.

- [ ] **Anthropic API** — already have this; same key works, just needs to be added as an
      environment variable in the new Vercel project (not hardcoded, not in Streamlit Secrets this time).

## Once accounts exist

1. Open **Claude Code**, point it at the new `intelliceo-platform` repo (empty to start).
2. Hand it `intelliceo_schema.sql` (the file I built) as the starting database schema —
   run it in Supabase's SQL editor, or have Claude Code run it via the Supabase CLI.
3. From there, the actual scaffolding begins: Next.js project setup, Supabase auth wiring,
   the onboarding flow (replaces manually converting each business's docs into knowledge base
   files), then porting Morning Brief / Vital Signs / Decisions Log / Content Studio onto the
   new multi-tenant backend.

## What NOT to do

- Don't touch or redeploy `dolce-mondo-atlas` (the current Streamlit app) during this —
  it's your live daily tool, keep it running as-is until IntelliCEO is ready to take over.
- Don't skip the RLS policies in the schema file to save time — that's the actual
  data-isolation guarantee between businesses, not an optional hardening step.
