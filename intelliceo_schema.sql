-- IntelliCEO: Initial multi-tenant schema for Supabase (Postgres)
-- Every table is isolated by business_id and protected with Row-Level Security (RLS),
-- so a business can only ever read/write its own rows — enforced by the database
-- itself, not just application code.

-- ── Businesses & Users ──────────────────────────────────────────────────

create table businesses (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    industry text default 'food_and_beverage',
    subscription_tier text default 'starter',  -- 'starter' | 'growth' | future tiers
    price_point numeric default 39.00,
    -- Stripe billing (see the webhook handler in src/app/api/stripe/webhook/route.ts).
    -- subscription_status mirrors Stripe's own subscription.status verbatim
    -- ('trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete' |
    -- 'incomplete_expired' | null if checkout was never started) — deliberately
    -- not reinvented as a separate app-level enum. Only ever written by the
    -- webhook (service-role client) or the set_stripe_customer_id() RPC below;
    -- there is no tenant UPDATE policy on this table.
    stripe_customer_id text,
    stripe_subscription_id text,
    subscription_status text,
    trial_ends_at timestamptz,
    -- Storage object path in the business-logos bucket (NOT a public URL —
    -- the bucket is private; a signed URL is generated server-side wherever
    -- the logo is displayed, see src/lib/business-brand.ts).
    logo_url text,
    created_at timestamptz default now()
);

-- Extends Supabase's built-in auth.users with business linkage
create table profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    business_id uuid references businesses(id) on delete cascade,
    full_name text,
    role text default 'owner',  -- 'owner' | 'staff' (future multi-user support)
    is_platform_admin boolean not null default false,  -- set manually via SQL only
    last_login_at timestamptz,  -- set via record_login(), not directly writable by clients
    created_at timestamptz default now()
);

-- ── Finance snapshot (current state, one row per business) ─────────────

create table finance_data (
    business_id uuid primary key references businesses(id) on delete cascade,
    cash numeric default 0,
    burn numeric default 0,
    runway integer default 0,
    revenue_mtd numeric default 0,
    -- Phase A of COGS/prime cost tracking. monthly_cogs is nullable and
    -- manually entered for now — see the Phase B note next to
    -- calculateCogsMetrics() in business-context.ts before changing this.
    monthly_cogs numeric,
    monthly_labor_cost numeric,
    cogs_updated_at timestamptz,  -- set only when monthly_cogs/monthly_labor_cost are saved
    updated_at timestamptz default now()
);

-- ── Decisions Log (Executive Memory) ────────────────────────────────────

create table decisions (
    id uuid primary key default gen_random_uuid(),
    business_id uuid references businesses(id) on delete cascade,
    decision text not null,
    why text,
    who text default 'Founder',
    expected_outcome text,
    actual_outcome text default 'TBD',
    status text default 'Open',  -- 'Open' | 'Closed'
    created_at timestamptz default now()
);

-- ── Morning Brief history (for trend tracking) ──────────────────────────

create table brief_history (
    id uuid primary key default gen_random_uuid(),
    business_id uuid references businesses(id) on delete cascade,
    brief_date date not null,
    overall_score integer,
    momentum text,
    cash_runway_days integer,
    revenue_mtd numeric,
    created_at timestamptz default now(),
    unique(business_id, brief_date)  -- one entry per business per day
);

-- ── Content Studio drafts ────────────────────────────────────────────────

create table marketing_drafts (
    id uuid primary key default gen_random_uuid(),
    business_id uuid references businesses(id) on delete cascade,
    content_type text,
    topic text,
    content text,
    created_at timestamptz default now()
);

-- ── Per-business knowledge base (replaces static markdown files) ────────
-- Each business fills these in through an onboarding flow — this is what
-- replaces manually converting docx files into markdown for every tenant.

create table knowledge_base_entries (
    id uuid primary key default gen_random_uuid(),
    business_id uuid references businesses(id) on delete cascade,
    category text,  -- 'business_overview' | 'products' | 'priorities' | etc.
    content text,
    updated_at timestamptz default now()
);

-- ── Per-business Square credentials ──────────────────────────────────────
-- NOTE: for production, use Supabase Vault or similar to encrypt access_token
-- at rest rather than storing it as plain text, even with RLS in place.

create table square_credentials (
    business_id uuid primary key references businesses(id) on delete cascade,
    access_token text,
    location_id text,
    last_synced_at timestamptz,  -- set only when a revenue pull actually completes
    updated_at timestamptz default now()
);

-- ── Chat: persistent per-business conversation history ──────────────────
-- Every message (both roles) is stored permanently and never deleted —
-- chat_summary tracks a rolling summary of everything older than the
-- recent verbatim window, so old messages stay in chat_messages for the
-- record even after they've been folded into the summary.

create table chat_messages (
    id uuid primary key default gen_random_uuid(),
    business_id uuid references businesses(id) on delete cascade,
    role text not null,  -- 'user' | 'assistant'
    content text not null,
    created_at timestamptz default now()
);

create table chat_summary (
    business_id uuid primary key references businesses(id) on delete cascade,
    summary text,
    -- messages with created_at <= summarized_through have already been
    -- folded into `summary`; the recent verbatim window is everything after.
    summarized_through timestamptz,
    updated_at timestamptz default now()
);

-- ── Stripe webhook idempotency ───────────────────────────────────────────
-- Stripe can and does redeliver the same event; every webhook event id is
-- recorded here first (insert ... on conflict do nothing) so a redelivery
-- is a no-op instead of re-running handler logic twice.

create table stripe_webhook_events (
    id text primary key,  -- Stripe event.id
    type text not null,
    created_at timestamptz default now()
);

-- ═══════════════════════════════════════════════════════════════════════
-- ROW-LEVEL SECURITY — this is the actual data-isolation guarantee.
-- Every table's policy checks that the row's business_id matches the
-- logged-in user's own business_id, looked up from their profile.
-- ═══════════════════════════════════════════════════════════════════════

alter table businesses enable row level security;
alter table profiles enable row level security;
alter table finance_data enable row level security;
alter table decisions enable row level security;
alter table brief_history enable row level security;
alter table marketing_drafts enable row level security;
alter table knowledge_base_entries enable row level security;
alter table square_credentials enable row level security;
alter table chat_messages enable row level security;
alter table chat_summary enable row level security;
-- No policies are ever added for this one — RLS enabled with zero policies
-- denies all access via the anon/authenticated roles, so only the
-- service-role client (the webhook handler) can ever touch this table.
alter table stripe_webhook_events enable row level security;

-- Helper: a user can only see their own business
create policy "Users see own business"
    on businesses for select
    using (id = (select business_id from profiles where id = auth.uid()));

create policy "Users see own profile"
    on profiles for select
    using (id = auth.uid());

-- Onboarding: a newly-signed-up user has no business yet, so they must be
-- able to create one and link themselves to it before tenant isolation
-- (which depends on that link existing) can apply to anything else.
create policy "Authenticated users can create a business"
    on businesses for insert
    with check (auth.uid() is not null);

create policy "Users can create their own profile"
    on profiles for insert
    with check (id = auth.uid());

-- Repeat the same business_id-matching pattern for every tenant-scoped table
create policy "Tenant isolation: finance_data"
    on finance_data for all
    using (business_id = (select business_id from profiles where id = auth.uid()));

create policy "Tenant isolation: decisions"
    on decisions for all
    using (business_id = (select business_id from profiles where id = auth.uid()));

create policy "Tenant isolation: brief_history"
    on brief_history for all
    using (business_id = (select business_id from profiles where id = auth.uid()));

create policy "Tenant isolation: marketing_drafts"
    on marketing_drafts for all
    using (business_id = (select business_id from profiles where id = auth.uid()));

create policy "Tenant isolation: knowledge_base_entries"
    on knowledge_base_entries for all
    using (business_id = (select business_id from profiles where id = auth.uid()));

create policy "Tenant isolation: square_credentials"
    on square_credentials for all
    using (business_id = (select business_id from profiles where id = auth.uid()));

create policy "Tenant isolation: chat_messages"
    on chat_messages for all
    using (business_id = (select business_id from profiles where id = auth.uid()));

create policy "Tenant isolation: chat_summary"
    on chat_summary for all
    using (business_id = (select business_id from profiles where id = auth.uid()));

-- ═══════════════════════════════════════════════════════════════════════
-- BUSINESS LOGOS — Supabase Storage, not a Postgres table. Same
-- tenant-isolation guarantee as every table above, just expressed via
-- storage.objects' path instead of a business_id column: every object is
-- stored at `{business_id}/logo`, and (storage.foldername(name))[1] pulls
-- that business_id back out to compare against the caller's own.
-- ═══════════════════════════════════════════════════════════════════════

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('business-logos', 'business-logos', false, 2097152, array['image/png','image/jpeg','image/webp'])
on conflict (id) do nothing;

create policy "Business logos: tenant select"
    on storage.objects for select
    using (bucket_id = 'business-logos' and (storage.foldername(name))[1] = (select business_id::text from profiles where id = auth.uid()));

create policy "Business logos: tenant insert"
    on storage.objects for insert
    with check (bucket_id = 'business-logos' and (storage.foldername(name))[1] = (select business_id::text from profiles where id = auth.uid()));

create policy "Business logos: tenant update"
    on storage.objects for update
    using (bucket_id = 'business-logos' and (storage.foldername(name))[1] = (select business_id::text from profiles where id = auth.uid()));

create policy "Business logos: tenant delete"
    on storage.objects for delete
    using (bucket_id = 'business-logos' and (storage.foldername(name))[1] = (select business_id::text from profiles where id = auth.uid()));

-- ═══════════════════════════════════════════════════════════════════════
-- ROOT CAUSE CONFIRMED by Supabase support (closed, not a workaround).
-- The Supabase client's default `.insert()` requests `return=representation`
-- (asking Postgres to hand back the newly-created row), which requires the
-- new row to also satisfy a SELECT policy at that exact instant. The
-- original code inserted `businesses` before `profiles`, so for a moment no
-- SELECT policy could yet prove the caller owned that business row, and
-- Postgres rejected the whole insert. This function creates both rows
-- atomically, before anything ever asks for a representation back, which is
-- why it works. This is now the permanent, correct pattern for this bootstrap
-- step — not a stopgap — so there's nothing to revert later.
-- ═══════════════════════════════════════════════════════════════════════

-- search_path is pinned explicitly — required hardening for SECURITY
-- DEFINER functions to prevent search_path-based function/table shadowing.
create or replace function public.create_business_and_profile(
    business_name text,
    business_industry text default 'food_and_beverage'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_business_id uuid;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  if exists (select 1 from profiles where id = v_user_id and business_id is not null) then
    raise exception 'This account is already linked to a business.';
  end if;

  insert into businesses (name, industry)
  values (business_name, business_industry)
  returning id into v_business_id;

  insert into profiles (id, business_id, role)
  values (v_user_id, v_business_id, 'owner')
  on conflict (id) do update set business_id = excluded.business_id;

  return v_business_id;
end;
$$;

grant execute on function public.create_business_and_profile(text, text) to authenticated;

-- ═══════════════════════════════════════════════════════════════════════
-- STRIPE BILLING — same SECURITY DEFINER pattern as record_login() below:
-- lets a user attach a Stripe customer id to their own business only,
-- without needing a general tenant UPDATE policy on businesses.
-- ═══════════════════════════════════════════════════════════════════════

create or replace function public.set_stripe_customer_id(p_customer_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update businesses set stripe_customer_id = p_customer_id
  where id = (select business_id from profiles where id = auth.uid());
end;
$$;

grant execute on function public.set_stripe_customer_id(text) to authenticated;

-- Same pattern for the two other tenant-self-service fields on businesses:
-- logo_url (new) and name (existing "Save Business Name" button in Settings
-- was silently no-op-ing under this same missing-UPDATE-policy gap until
-- now — fixed here rather than left broken next to the new logo upload).

create or replace function public.set_business_logo_url(p_logo_url text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update businesses set logo_url = p_logo_url
  where id = (select business_id from profiles where id = auth.uid());
end;
$$;

grant execute on function public.set_business_logo_url(text) to authenticated;

create or replace function public.set_business_name(p_name text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update businesses set name = p_name
  where id = (select business_id from profiles where id = auth.uid());
end;
$$;

grant execute on function public.set_business_name(text) to authenticated;

-- ═══════════════════════════════════════════════════════════════════════
-- PLATFORM ADMIN — internal-only cross-tenant visibility, gated by
-- profiles.is_platform_admin (set manually via SQL, never via the app).
-- ═══════════════════════════════════════════════════════════════════════

-- Records a login timestamp for the caller's own row only — auth.uid() is
-- read server-side inside the function body, never passed in as a
-- parameter, so this can't be used to touch anyone else's row (or, since
-- there's still no general UPDATE policy on profiles, any column a normal
-- user couldn't otherwise reach — including is_platform_admin itself).
create or replace function public.record_login()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update profiles set last_login_at = now() where id = auth.uid();
end;
$$;

grant execute on function public.record_login() to authenticated;

-- Reads profiles.is_platform_admin via SECURITY DEFINER, bypassing RLS —
-- required because a policy ON profiles that queries profiles from inside
-- its own USING clause causes infinite recursion (Postgres error 42P17):
-- evaluating that policy re-triggers every policy on profiles, including
-- itself. Routing the check through this function means the inner lookup
-- never goes through RLS again, so nothing recurses.
create or replace function public.is_platform_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce((select is_platform_admin from profiles where id = auth.uid()), false);
$$;

grant execute on function public.is_platform_admin() to authenticated;

-- Additive policies: permissive policies OR together, so these grant
-- platform admins full read access across every business without touching
-- (or weakening) any existing tenant-isolation policy above. Admins get
-- SELECT only — no cross-tenant writes.
create policy "Platform admins see all businesses"
    on businesses for select
    using (public.is_platform_admin());

create policy "Platform admins see all profiles"
    on profiles for select
    using (public.is_platform_admin());

create policy "Platform admins see all decisions"
    on decisions for select
    using (public.is_platform_admin());

create policy "Platform admins see all brief_history"
    on brief_history for select
    using (public.is_platform_admin());

create policy "Platform admins see all square_credentials"
    on square_credentials for select
    using (public.is_platform_admin());
