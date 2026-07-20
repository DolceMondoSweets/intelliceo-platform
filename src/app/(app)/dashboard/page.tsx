import { createClient } from "@/lib/supabase/server";
import { getSessionState } from "@/lib/supabase/session";
import { Button } from "@/components/ui";
import { calculateCogsMetrics } from "@/lib/business-context";
import { signOut } from "./actions";

const COGS_STALE_AFTER_DAYS = 30;

function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

function isCogsStale(cogsUpdatedAt: string | null, revenueMtd: number): boolean {
  if (cogsUpdatedAt === null) return revenueMtd > 0;
  return daysSince(cogsUpdatedAt) > COGS_STALE_AFTER_DAYS;
}

function primeCostColor(pct: number | null): string {
  if (pct === null) return "#9e9e9e";
  if (pct <= 65) return "#27ae60";
  if (pct <= 75) return "#f39c12";
  return "#e74c3c";
}

export default async function DashboardPage() {
  const { businessId: id } = await getSessionState();
  const businessId = id as string; // guaranteed by (app)/layout.tsx
  const supabase = await createClient();

  const [{ data: business }, { data: kbEntries }, { data: finance }] = await Promise.all([
    supabase.from("businesses").select("name, industry").eq("id", businessId).single(),
    supabase.from("knowledge_base_entries").select("category, content").eq("business_id", businessId),
    supabase.from("finance_data").select("*").eq("business_id", businessId).maybeSingle(),
  ]);

  const kbByCategory = Object.fromEntries(
    (kbEntries ?? []).map((entry) => [entry.category, entry.content])
  );

  const revenueMtd = finance?.revenue_mtd ?? 0;
  const { foodCostPct, primeCostPct } = calculateCogsMetrics(
    finance?.monthly_cogs ?? null,
    finance?.monthly_labor_cost ?? null,
    revenueMtd
  );
  const cogsStale = isCogsStale(finance?.cogs_updated_at ?? null, revenueMtd);

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 bg-zinc-50 px-6 py-10 dark:bg-black">
      <div>
        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
          Onboarding complete
        </p>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          {business?.name ?? "Your business"}
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{business?.industry}</p>
      </div>

      {cogsStale && (
        <div className="rounded-lg border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-sm text-zinc-800 dark:bg-amber-950/30 dark:text-zinc-200">
          ⚠️{" "}
          {finance?.cogs_updated_at
            ? `Your monthly ingredient/labor costs haven't been updated in ${daysSince(finance.cogs_updated_at)} days — head to Settings to confirm they're still accurate.`
            : "You haven't entered your monthly ingredient/labor costs yet — head to Settings to start tracking your prime cost."}
        </div>
      )}

      <Section title="Business overview" content={kbByCategory.business_overview} />
      <Section title="Products" content={kbByCategory.products} />
      <Section title="Priorities" content={kbByCategory.priorities} />

      <div className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
        <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Finance snapshot</h2>
        <dl className="mt-2 grid grid-cols-2 gap-3">
          <Stat label="Cash" value={finance?.cash} prefix="$" />
          <Stat label="Monthly burn" value={finance?.burn} prefix="$" />
          <Stat label="Runway" value={finance?.runway} suffix=" mo" />
          <Stat label="Revenue MTD" value={finance?.revenue_mtd} prefix="$" />
          <CostStat label="Food cost %" pct={foodCostPct} />
          <CostStat label="Prime cost %" pct={primeCostPct} />
        </dl>
        <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
          Healthy food &amp; beverage prime cost is typically 60–65% of revenue.
        </p>
      </div>

      <form action={signOut}>
        <Button type="submit" variant="secondary" className="w-full">
          Log out
        </Button>
      </form>
    </div>
  );
}

function Section({ title, content }: { title: string; content?: string | null }) {
  return (
    <div className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
      <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{title}</h2>
      <p className="mt-1 text-base text-zinc-900 dark:text-zinc-50">
        {content ?? <span className="text-zinc-400 dark:text-zinc-600">Not provided</span>}
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  prefix,
  suffix,
}: {
  label: string;
  value?: number | null;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div>
      <dt className="text-xs text-zinc-500 dark:text-zinc-400">{label}</dt>
      <dd className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        {prefix}
        {value ?? 0}
        {suffix}
      </dd>
    </div>
  );
}

function CostStat({ label, pct }: { label: string; pct: number | null }) {
  return (
    <div>
      <dt className="text-xs text-zinc-500 dark:text-zinc-400">{label}</dt>
      <dd className="text-lg font-semibold" style={{ color: primeCostColor(pct) }}>
        {pct !== null ? (
          `${pct.toFixed(1)}%`
        ) : (
          <span className="text-sm font-normal text-zinc-400 dark:text-zinc-600">
            Not yet tracked
          </span>
        )}
      </dd>
    </div>
  );
}
