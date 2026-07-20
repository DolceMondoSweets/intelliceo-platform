import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

const CATEGORY_LABELS: Record<string, string> = {
  business_overview: "Business Overview",
  products: "Products",
  priorities: "Priorities & Goals",
};

export async function getKbContext(
  supabase: SupabaseClient<Database>,
  businessId: string
): Promise<string> {
  const { data } = await supabase
    .from("knowledge_base_entries")
    .select("category, content")
    .eq("business_id", businessId);

  const entries = (data ?? []).filter((entry) => entry.content?.trim());
  if (entries.length === 0) {
    return "No business knowledge base entries recorded yet.";
  }

  return entries
    .map((entry) => `### ${CATEGORY_LABELS[entry.category ?? ""] ?? entry.category}\n${entry.content}`)
    .join("\n\n");
}

// "not_tracked": the underlying cost hasn't been entered yet.
// "no_revenue": the cost IS entered, but revenue_mtd is 0/null so the ratio
// is undefined — distinct from not_tracked because the data exists, revenue
// just doesn't yet (e.g. a seasonal business that's currently closed).
// "ok": both inputs present and revenue is positive — pct is a real number.
export type CogsMetricStatus = "not_tracked" | "no_revenue" | "ok";

export interface CogsMetric {
  status: CogsMetricStatus;
  pct: number | null;
}

export interface CogsMetrics {
  foodCost: CogsMetric;
  primeCost: CogsMetric;
}

// PHASE A of COGS/prime cost tracking. `monthlyCogs` is currently always a
// manually-entered number (finance_data.monthly_cogs, set via Settings).
// A future Phase B may instead calculate it as a sum from a per-item costs
// table — this function only ever takes plain numbers in and returns
// percentages out, deliberately decoupled from WHERE monthlyCogs comes
// from, so swapping the source later doesn't require changing any caller.
export function calculateCogsMetrics(
  monthlyCogs: number | null,
  monthlyLaborCost: number | null,
  revenueMtd: number | null
): CogsMetrics {
  const hasRevenue = revenueMtd !== null && revenueMtd > 0;

  const foodCost: CogsMetric =
    monthlyCogs === null
      ? { status: "not_tracked", pct: null }
      : !hasRevenue
        ? { status: "no_revenue", pct: null }
        : { status: "ok", pct: (monthlyCogs / revenueMtd) * 100 };

  const primeCost: CogsMetric =
    monthlyCogs === null || monthlyLaborCost === null
      ? { status: "not_tracked", pct: null }
      : !hasRevenue
        ? { status: "no_revenue", pct: null }
        : { status: "ok", pct: ((monthlyCogs + monthlyLaborCost) / revenueMtd) * 100 };

  return { foodCost, primeCost };
}

function formatCogsMetric(metric: CogsMetric): string {
  if (metric.status === "ok" && metric.pct !== null) return `${metric.pct.toFixed(1)}%`;
  if (metric.status === "no_revenue") return "Can't calculate — no revenue recorded this month";
  return "Not yet tracked";
}

export async function getFinanceSnapshot(
  supabase: SupabaseClient<Database>,
  businessId: string
): Promise<string> {
  const { data } = await supabase
    .from("finance_data")
    .select("*")
    .eq("business_id", businessId)
    .maybeSingle();

  const cash = data?.cash ?? 0;
  const burn = data?.burn ?? 0;
  const runway = data?.runway ?? 0;
  const revenueMtd = data?.revenue_mtd ?? 0;
  const monthlyCogs = data?.monthly_cogs ?? null;
  const monthlyLaborCost = data?.monthly_labor_cost ?? null;
  const { foodCost, primeCost } = calculateCogsMetrics(monthlyCogs, monthlyLaborCost, revenueMtd);

  return (
    `Current Cash Balance: $${cash.toLocaleString()}\n` +
    `Monthly Burn Rate: $${burn.toLocaleString()}\n` +
    `Runway: ${runway} days\n` +
    `Month-to-Date Revenue: $${revenueMtd.toLocaleString()}\n` +
    `Monthly COGS (ingredients/supplies): ${monthlyCogs !== null ? `$${monthlyCogs.toLocaleString()}` : "Not yet tracked"}\n` +
    `Monthly Labor Cost: ${monthlyLaborCost !== null ? `$${monthlyLaborCost.toLocaleString()}` : "Not yet tracked"}\n` +
    `Food Cost % (COGS / Revenue): ${formatCogsMetric(foodCost)}\n` +
    `Prime Cost % ((COGS + Labor) / Revenue): ${formatCogsMetric(primeCost)} — healthy range for food & beverage is typically 60-65%\n` +
    `Today's Date: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
  );
}

export async function getTrendHistoryString(
  supabase: SupabaseClient<Database>,
  businessId: string,
  limit = 14
): Promise<string> {
  const { data } = await supabase
    .from("brief_history")
    .select("brief_date, overall_score, momentum, cash_runway_days, revenue_mtd")
    .eq("business_id", businessId)
    .order("brief_date", { ascending: true })
    .limit(limit);

  if (!data || data.length === 0) {
    return "No prior briefs recorded yet — this is the first.";
  }

  return data
    .map(
      (h) =>
        `${h.brief_date}: Overall ${h.overall_score ?? "N/A"}/100, Momentum ${h.momentum ?? "N/A"}, ` +
        `Runway ${h.cash_runway_days ?? "N/A"} days, MTD Revenue $${(h.revenue_mtd ?? 0).toLocaleString()}`
    )
    .join("\n");
}
