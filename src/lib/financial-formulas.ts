// Pure financial calculations shared by server components (Dashboard, CEO
// Brief context) and client components (the What-If calculator). No I/O,
// no "server-only" — every function here just takes numbers and returns
// numbers, deliberately decoupled from where those numbers come from.

// "not_tracked": the underlying cost hasn't been entered yet.
// "no_revenue": the cost IS entered, but revenue is 0/null so the ratio
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

// Runway is always derived from cash/burn, never stored — a burn of 0 (or
// negative) means it can't be calculated (or is effectively infinite), not
// a divide-by-zero error.
export function calculateRunwayMonths(cash: number, burn: number): number | null {
  if (burn <= 0) return null;
  return cash / burn;
}

export function formatRunwayMonths(months: number | null): string {
  return months === null ? "N/A" : `${months.toFixed(1)} mo`;
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

export function formatCogsMetric(metric: CogsMetric): string {
  if (metric.status === "ok" && metric.pct !== null) return `${metric.pct.toFixed(1)}%`;
  if (metric.status === "no_revenue") return "Can't calculate — no revenue recorded this month";
  return "Not yet tracked";
}

// Break-even revenue = fixed costs / (1 - variable cost ratio). Burn stands
// in for fixed monthly overhead (it's already treated as an independent,
// roughly-fixed "cost of keeping the lights on" everywhere else in this
// app — see runway above); the food cost % (COGS / revenue) stands in for
// the variable cost ratio, since ingredient cost is what actually scales
// with each sale. Labor is deliberately left out of the variable side —
// for a small food & beverage business, staffing is scheduled in advance
// and doesn't flex sale-by-sale the way COGS does.
export type BreakEvenResult =
  | { status: "ok"; breakEvenRevenue: number }
  | { status: "not_tracked" }
  | { status: "unreachable" }; // food cost % >= 100% of revenue — can't ever break even

export function calculateBreakEven(burn: number, foodCostPct: number | null): BreakEvenResult {
  if (foodCostPct === null) return { status: "not_tracked" };
  const variableCostRatio = foodCostPct / 100;
  if (variableCostRatio >= 1) return { status: "unreachable" };
  return { status: "ok", breakEvenRevenue: burn / (1 - variableCostRatio) };
}

// Budget vs. actual for a single line (revenue, COGS, or labor). Variance
// is always actual - budgeted; callers decide whether a positive variance
// is "good" (revenue: over budget) or "bad" (a cost line: over budget).
export type BudgetLine =
  | { status: "not_tracked" }
  | { status: "ok"; actual: number; budgeted: number; variance: number; variancePct: number | null };

// Requires both sides to compute a real comparison — if actual isn't
// tracked yet (e.g. COGS was never entered in Settings), showing "$0
// actual" against a budget would misrepresent untracked data as zero spend.
export function calculateBudgetLine(actual: number | null, budgeted: number | null): BudgetLine {
  if (budgeted === null || actual === null) return { status: "not_tracked" };
  const variance = actual - budgeted;
  const variancePct = budgeted !== 0 ? (variance / budgeted) * 100 : null;
  return { status: "ok", actual, budgeted, variance, variancePct };
}
