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

export interface CogsMetrics {
  foodCostPct: number | null;
  primeCostPct: number | null;
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
  if (!revenueMtd || revenueMtd <= 0) {
    return { foodCostPct: null, primeCostPct: null };
  }

  const foodCostPct = monthlyCogs !== null ? (monthlyCogs / revenueMtd) * 100 : null;
  const primeCostPct =
    monthlyCogs !== null && monthlyLaborCost !== null
      ? ((monthlyCogs + monthlyLaborCost) / revenueMtd) * 100
      : null;

  return { foodCostPct, primeCostPct };
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
  const { foodCostPct, primeCostPct } = calculateCogsMetrics(monthlyCogs, monthlyLaborCost, revenueMtd);

  return (
    `Current Cash Balance: $${cash.toLocaleString()}\n` +
    `Monthly Burn Rate: $${burn.toLocaleString()}\n` +
    `Runway: ${runway} days\n` +
    `Month-to-Date Revenue: $${revenueMtd.toLocaleString()}\n` +
    `Monthly COGS (ingredients/supplies): ${monthlyCogs !== null ? `$${monthlyCogs.toLocaleString()}` : "Not yet tracked"}\n` +
    `Monthly Labor Cost: ${monthlyLaborCost !== null ? `$${monthlyLaborCost.toLocaleString()}` : "Not yet tracked"}\n` +
    `Food Cost % (COGS / Revenue): ${foodCostPct !== null ? `${foodCostPct.toFixed(1)}%` : "Not yet tracked"}\n` +
    `Prime Cost % ((COGS + Labor) / Revenue): ${primeCostPct !== null ? `${primeCostPct.toFixed(1)}%` : "Not yet tracked"} — healthy range for food & beverage is typically 60-65%\n` +
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
