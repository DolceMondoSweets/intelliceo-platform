import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import { calculateCogsMetrics, calculateRunwayMonths, formatRunwayMonths, formatCogsMetric } from "@/lib/financial-formulas";

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
  const runway = formatRunwayMonths(calculateRunwayMonths(cash, burn));
  const revenueMtd = data?.revenue_mtd ?? 0;
  const monthlyCogs = data?.monthly_cogs ?? null;
  const monthlyLaborCost = data?.monthly_labor_cost ?? null;
  const { foodCost, primeCost } = calculateCogsMetrics(monthlyCogs, monthlyLaborCost, revenueMtd);

  return (
    `Current Cash Balance: $${cash.toLocaleString()}\n` +
    `Monthly Burn Rate: $${burn.toLocaleString()}\n` +
    `Runway: ${runway}\n` +
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
