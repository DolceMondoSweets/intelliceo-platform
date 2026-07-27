-- ═══════════════════════════════════════════════════════════════════════
-- MIGRATION: encrypt pos_credentials.access_token at rest via Supabase Vault
-- ═══════════════════════════════════════════════════════════════════════
--
-- Run this in the Supabase SQL Editor against your actual project. This is
-- NOT applied automatically — there's no migrations/CLI setup in this repo
-- (intelliceo_schema.sql is a hand-maintained reference, not something that
-- runs itself), and this environment has no direct database connection to
-- run it for you.
--
-- WHAT THIS DOES: today, pos_credentials.access_token stores each
-- business's live Square/Clover API token in plain text. Anyone with
-- database/table access (a Supabase dashboard user, a leaked service-role
-- key, a misconfigured admin query) can read it directly. After this
-- migration, the real token only ever exists encrypted in Vault
-- (vault.secrets), and the only way back to plaintext is the new
-- get_pos_access_token() function, which is scoped to the calling
-- business's own row via auth.uid() — the same pattern already used by
-- set_business_name()/set_business_logo_url() in intelliceo_schema.sql.
--
-- STRUCTURE: three phases, meant to be run in order. Phase 1 is purely
-- additive (nothing existing is removed) and safe to run even if you want
-- to stop and verify before Phase 3. Phase 2 is a read-only check you
-- should eyeball. Phase 3 is the only destructive step (drops the old
-- plaintext column) — run it only after confirming Phase 2 looks right.
--
-- This has NOT been executed against your live database from this
-- session — no direct DB connection was available. Review it yourself (or
-- have someone else review it) before running against production,
-- especially if you have real, already-connected Square/Clover businesses
-- today whose tokens Phase 1's backfill needs to carry over correctly.


-- ─── PHASE 1: additive — enable Vault, add the new column, backfill ───────

create extension if not exists supabase_vault;

alter table pos_credentials
  add column if not exists access_token_secret_id uuid references vault.secrets(id);

-- One-time backfill: for every existing row that still has a plaintext
-- access_token and hasn't been migrated yet, create a Vault secret holding
-- that value and point the new column at it. Safe to re-run — rows that
-- already have access_token_secret_id set are skipped.
do $$
declare
  r record;
  new_id uuid;
begin
  for r in
    select business_id, access_token
    from pos_credentials
    where access_token is not null
      and access_token_secret_id is null
  loop
    new_id := vault.create_secret(
      r.access_token,
      'pos_access_token_' || r.business_id::text,
      'POS access token for business ' || r.business_id::text
    );
    update pos_credentials
      set access_token_secret_id = new_id
      where business_id = r.business_id;
  end loop;
end $$;

-- Create (or update, if you re-run this migration) the three RPC functions
-- the app now calls instead of touching access_token directly. These are
-- also recorded in intelliceo_schema.sql as the permanent reference.

create or replace function public.has_pos_access_token()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select access_token_secret_id is not null
  from pos_credentials
  where business_id = (select business_id from profiles where id = auth.uid());
$$;

grant execute on function public.has_pos_access_token() to authenticated;

create or replace function public.set_pos_access_token(
  p_pos_type text,
  p_access_token text,
  p_location_id text default null,
  p_merchant_id text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_business_id uuid;
  existing_secret_id uuid;
  new_secret_id uuid;
begin
  select business_id into caller_business_id from profiles where id = auth.uid();
  if caller_business_id is null then
    raise exception 'No business associated with this account';
  end if;

  select access_token_secret_id into existing_secret_id
  from pos_credentials where business_id = caller_business_id;

  if p_access_token is not null then
    if existing_secret_id is not null then
      perform vault.update_secret(existing_secret_id, p_access_token);
      new_secret_id := existing_secret_id;
    else
      new_secret_id := vault.create_secret(
        p_access_token,
        'pos_access_token_' || caller_business_id::text,
        'POS access token for business ' || caller_business_id::text
      );
    end if;
  else
    new_secret_id := existing_secret_id;
  end if;

  insert into pos_credentials (business_id, pos_type, access_token_secret_id, location_id, merchant_id, updated_at)
  values (caller_business_id, p_pos_type, new_secret_id, p_location_id, p_merchant_id, now())
  on conflict (business_id) do update set
    pos_type = excluded.pos_type,
    access_token_secret_id = excluded.access_token_secret_id,
    location_id = excluded.location_id,
    merchant_id = excluded.merchant_id,
    updated_at = excluded.updated_at;
end;
$$;

grant execute on function public.set_pos_access_token(text, text, text, text) to authenticated;

create or replace function public.get_pos_access_token()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_business_id uuid;
  secret_id uuid;
  token text;
begin
  select business_id into caller_business_id from profiles where id = auth.uid();
  if caller_business_id is null then
    return null;
  end if;

  select access_token_secret_id into secret_id
  from pos_credentials where business_id = caller_business_id;

  if secret_id is null then
    return null;
  end if;

  select decrypted_secret into token from vault.decrypted_secrets where id = secret_id;
  return token;
end;
$$;

grant execute on function public.get_pos_access_token() to authenticated;


-- ─── PHASE 2: verify before dropping anything ──────────────────────────────
-- Run this SELECT and confirm every row that has a plaintext access_token
-- also has a matching access_token_secret_id populated. If any row shows
-- backfilled = false, do NOT proceed to Phase 3 until you've investigated —
-- it means that business's token did not make it into Vault.

select
  business_id,
  pos_type,
  (access_token is not null) as had_plaintext_token,
  (access_token_secret_id is not null) as backfilled
from pos_credentials
where access_token is not null;
-- Expect: every row returned here has backfilled = true.
-- If this returns zero rows, there were no existing tokens to migrate —
-- also fine, proceed to Phase 3.


-- ─── PHASE 3: destructive — only after Phase 2 looks correct ───────────────
-- Removes the plaintext column entirely. After this, the only way to read
-- a token is get_pos_access_token(), and only for the calling business.

alter table pos_credentials drop column if exists access_token;
