import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSessionState } from "@/lib/supabase/session";
import { getBusinessBrand } from "@/lib/business-brand";
import {
  calculateBreakEven,
  calculateBudgetLine,
  calculateCogsMetrics,
  calculateRunwayMonths,
  formatRunwayMonths,
  type CogsMetric,
} from "@/lib/financial-formulas";
import { BusinessInfoDisclosure } from "./business-info-disclosure";
import { BudgetComparison } from "./budget-comparison";
import { BreakEvenCard } from "./break-even-card";
import { WhatIfCalculator } from "./what-if-calculator";

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

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const { businessId: id } = await getSessionState();
  const businessId = id as string; // guaranteed by (app)/layout.tsx
  const supabase = await createClient();
  const { welcome } = await searchParams;

  const [brand, { data: business }, { data: kbEntries }, { data: finance }, { count: activeGoals }] =
    await Promise.all([
      getBusinessBrand(supabase, businessId),
      supabase.from("businesses").select("industry").eq("id", businessId).single(),
      supabase.from("knowledge_base_entries").select("category, content").eq("business_id", businessId),
      supabase.from("finance_data").select("*").eq("business_id", businessId).maybeSingle(),
      supabase
        .from("goals")
        .select("id", { count: "exact", head: true })
        .eq("business_id", businessId)
        .eq("status", "Active"),
    ]);

  const kbByCategory = Object.fromEntries(
    (kbEntries ?? []).map((entry) => [entry.category, entry.content])
  );

  const cash = finance?.cash ?? 0;
  const burn = finance?.burn ?? 0;
  const revenueMtd = finance?.revenue_mtd ?? 0;
  const monthlyCogs = finance?.monthly_cogs ?? null;
  const monthlyLaborCost = finance?.monthly_labor_cost ?? null;

  const runwayMonths = calculateRunwayMonths(cash, burn);
  const { foodCost, primeCost } = calculateCogsMetrics(monthlyCogs, monthlyLaborCost, revenueMtd);
  const cogsStale = isCogsStale(finance?.cogs_updated_at ?? null, revenueMtd);
  const breakEven = calculateBreakEven(burn, foodCost.pct);
  const budgetRevenue = calculateBudgetLine(revenueMtd, finance?.budgeted_revenue ?? null);
  const budgetCogs = calculateBudgetLine(monthlyCogs, finance?.budgeted_cogs ?? null);
  const budgetLabor = calculateBudgetLine(monthlyLaborCost, finance?.budgeted_labor ?? null);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 bg-zinc-50 px-6 py-10 dark:bg-black">
      {welcome && (
        <div className="rounded-lg border-l-4 border-emerald-500 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
          🎉 You&apos;re all set — welcome to IntelliCEO!
        </div>
      )}

      <div className="flex items-center gap-3">
        {brand.logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={brand.logoUrl} alt="" className="h-12 w-12 rounded-xl object-cover" />
        )}
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            {brand.name || "Your business"}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{business?.industry}</p>
        </div>
      </div>

      {cogsStale && (
        <div className="rounded-lg border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-sm text-zinc-800 dark:bg-amber-950/30 dark:text-zinc-200">
          ⚠️{" "}
          {finance?.cogs_updated_at
            ? `Your monthly ingredient/labor costs haven't been updated in ${daysSince(finance.cogs_updated_at)} days — head to Settings to confirm they're still accurate.`
            : "You haven't entered your monthly ingredient/labor costs yet — head to Settings to start tracking your prime cost."}
        </div>
      )}

      <div className="rounded-2xl border border-zinc-200 p-6 shadow-sm dark:border-zinc-800">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Finance Snapshot
        </h2>
        <dl className="mt-4 grid grid-cols-2 gap-5 sm:grid-cols-3">
          <Stat label="Cash" value={finance?.cash} prefix="$" />
          <Stat label="Monthly burn" value={finance?.burn} prefix="$" />
          <Stat label="Runway" display={formatRunwayMonths(runwayMonths)} />
          <Stat label="Revenue MTD" value={finance?.revenue_mtd} prefix="$" />
          <CostStat label="Food cost %" metric={foodCost} />
          <CostStat label="Prime cost %" metric={primeCost} />
        </dl>
        <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
          Healthy food &amp; beverage prime cost is typically 60–65% of revenue.
        </p>
      </div>

      <BudgetComparison revenue={budgetRevenue} cogs={budgetCogs} labor={budgetLabor} />

      <BreakEvenCard result={breakEven} revenueMtd={revenueMtd} />

      <WhatIfCalculator
        cash={cash}
        burn={burn}
        revenueMtd={revenueMtd}
        monthlyCogs={monthlyCogs}
        monthlyLaborCost={monthlyLaborCost}
      />

      <div className="flex flex-col gap-3">
        <Section title="Priorities" content={kbByCategory.priorities} />
        <Link
          href="/goals"
          className="flex items-center justify-between rounded-2xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          <span>
            🎯{" "}
            {activeGoals && activeGoals > 0
              ? `${activeGoals} active goal${activeGoals === 1 ? "" : "s"} — track progress`
              : "Turn a priority into a trackable goal"}
          </span>
          <span>→</span>
        </Link>
      </div>

      <BusinessInfoDisclosure
        overview={kbByCategory.business_overview ?? null}
        products={kbByCategory.products ?? null}
      />
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
  display,
}: {
  label: string;
  value?: number | null;
  prefix?: string;
  suffix?: string;
  display?: string;
}) {
  return (
    <div>
      <dt className="text-sm text-zinc-500 dark:text-zinc-400">{label}</dt>
      <dd className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        {display ?? (
          <>
            {prefix}
            {value ?? 0}
            {suffix}
          </>
        )}
      </dd>
    </div>
  );
}

function CostStat({ label, metric }: { label: string; metric: CogsMetric }) {
  const isOk = metric.status === "ok" && metric.pct !== null;
  return (
    <div>
      <dt className="text-sm text-zinc-500 dark:text-zinc-400">{label}</dt>
      <dd
        className="text-2xl font-semibold"
        style={{ color: isOk ? primeCostColor(metric.pct) : undefined }}
      >
        {isOk ? (
          `${metric.pct!.toFixed(1)}%`
        ) : (
          <span className="text-sm font-normal text-zinc-400 dark:text-zinc-600">
            {metric.status === "no_revenue"
              ? "Can't calculate — no revenue this month"
              : "Not yet tracked"}
          </span>
        )}
      </dd>
    </div>
  );
}
