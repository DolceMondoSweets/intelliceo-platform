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
    created_at timestamptz default now()
);

-- Extends Supabase's built-in auth.users with business linkage
create table profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    business_id uuid references businesses(id) on delete cascade,
    full_name text,
    role text default 'owner',  -- 'owner' | 'staff' (future multi-user support)
    created_at timestamptz default now()
);

-- ── Finance snapshot (current state, one row per business) ─────────────

create table finance_data (
    business_id uuid primary key references businesses(id) on delete cascade,
    cash numeric default 0,
    burn numeric default 0,
    runway integer default 0,
    revenue_mtd numeric default 0,
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
    updated_at timestamptz default now()
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

-- ═══════════════════════════════════════════════════════════════════════
-- TEMPORARY WORKAROUND — pending Supabase support's root-cause response.
-- auth.uid() has been directly proven (via RPC and a raw SQL reproduction
-- bypassing the app/PostgREST/JWT entirely) to resolve correctly; the plain
-- `.from('businesses').insert()` path still fails the trivial
-- `auth.uid() IS NOT NULL` INSERT policy for reasons outside our control.
-- This function bypasses RLS for exactly the two bootstrap inserts
-- onboarding needs, via SECURITY DEFINER, while every other table keeps
-- enforcing RLS normally. Remove/simplify once the underlying anomaly is
-- resolved — completeOnboarding should go back to plain inserts at that
-- point, matching every other tenant-scoped write in this app.
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
