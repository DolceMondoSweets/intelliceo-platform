-- Run this against the live Supabase database (SQL Editor) to bring it in
-- sync with intelliceo_schema.sql's brief_history/vital_signs_history
-- changes. Idempotent -- safe to re-run if it fails partway through.

-- 1. brief_history gets a full_content column, storing the complete
--    generated CEO Brief object (domain_scores, overall_note,
--    biggest_opportunity, potential_impact, biggest_risk, recommended_focus,
--    flagged_issues, top_priorities) alongside the existing summary columns.
alter table brief_history
    add column if not exists full_content jsonb;

-- 2. New table for Vital Signs -- previously had zero persistence at all.
create table if not exists vital_signs_history (
    id uuid primary key default gen_random_uuid(),
    business_id uuid references businesses(id) on delete cascade,
    full_content jsonb not null,
    created_at timestamptz default now()
);

alter table vital_signs_history enable row level security;

drop policy if exists "Tenant isolation: vital_signs_history" on vital_signs_history;
create policy "Tenant isolation: vital_signs_history"
    on vital_signs_history for all
    using (business_id = (select business_id from profiles where id = auth.uid()));

drop policy if exists "Platform admins see all vital_signs_history" on vital_signs_history;
create policy "Platform admins see all vital_signs_history"
    on vital_signs_history for select
    using (public.is_platform_admin());

-- 3. Verify (read-only) -- eyeball before considering this done.
select column_name, data_type
from information_schema.columns
where table_name = 'brief_history' and column_name = 'full_content';

select tablename, policyname
from pg_policies
where tablename = 'vital_signs_history';

notify pgrst, 'reload schema';
