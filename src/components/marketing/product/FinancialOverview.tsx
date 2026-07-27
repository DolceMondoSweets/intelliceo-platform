import { MetricCard } from "./MetricCard";
import { MockupFrame } from "./MockupFrame";

// The Financial Visibility showcase mockup — only real, built metrics:
// revenue, cash + runway, food cost %, prime cost % against its real
// benchmark, budget vs. actual, break-even, and a real Goals-tracker entry.
// No gross profit, no net operating income, nothing the platform doesn't
// actually calculate. Only prime cost has a stated healthy range in the
// product (Dashboard) — food cost intentionally has no benchmark note.
export function FinancialOverview({
  businessName = "Bluebird Coffee Co.",
}: {
  businessName?: string;
}) {
  return (
    <div className="w-full max-w-[560px]">
      <MockupFrame label={`Vital Signs · ${businessName}`}>
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-mkt-text-muted">Finance Snapshot</span>
            <span className="rounded-full bg-brand-teal-light px-2.5 py-1 text-[11px] font-semibold text-brand-teal">
              Synced from Square
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <MetricCard label="Revenue MTD" value="$41,280" />
            <MetricCard label="Cash on hand" value="$34,900" />
            <MetricCard label="Runway" value="4.8" suffix="mo" />
            <MetricCard label="Food cost" value="29.4" suffix="%" />
            <MetricCard label="Prime cost" value="67" suffix="%" tone="warning" note="Healthy: 60–65%" />
            <MetricCard label="Break-even" value="$29,600" note="This month" />
          </div>

          <div className="mt-5 rounded-mkt-md border border-mkt-border-light p-4">
            <span className="text-xs font-semibold uppercase tracking-[0.06em] text-mkt-text-muted">
              Budget vs. Actual
            </span>
            <div className="mt-3 flex flex-col gap-2.5">
              {[
                { label: "Revenue", budget: "$45,000", actual: "$41,280", delta: "-8%", good: false },
                { label: "COGS", budget: "$13,500", actual: "$12,140", delta: "-10%", good: true },
                { label: "Labor", budget: "$14,500", actual: "$15,730", delta: "+8%", good: false },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between text-sm">
                  <span className="text-mkt-text-secondary">{row.label}</span>
                  <span className="text-mkt-text-muted">
                    {row.actual} <span className="text-mkt-text-muted/70">/ {row.budget}</span>
                  </span>
                  <span
                    className={`font-semibold ${row.good ? "text-mkt-success" : "text-mkt-warning"}`}
                  >
                    {row.delta}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between rounded-mkt-md border border-mkt-border-light p-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.06em] text-mkt-text-muted">
                Goal
              </span>
              <p className="mt-1 text-sm font-medium text-mkt-text-primary">
                Reduce prime cost to 62% by Sep 30
              </p>
            </div>
            <span className="rounded-full bg-brand-teal-light px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.06em] text-brand-teal">
              Active
            </span>
          </div>
        </div>
      </MockupFrame>
    </div>
  );
}
