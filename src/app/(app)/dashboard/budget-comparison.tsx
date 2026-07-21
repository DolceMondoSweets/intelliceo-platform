import type { BudgetLine } from "@/lib/financial-formulas";

function BudgetLineRow({
  label,
  line,
  isCost,
}: {
  label: string;
  line: BudgetLine;
  isCost: boolean;
}) {
  if (line.status === "not_tracked") {
    return (
      <tr className="border-b border-zinc-100 last:border-0 dark:border-zinc-900">
        <td className="py-2 text-sm text-zinc-600 dark:text-zinc-400">{label}</td>
        <td colSpan={3} className="py-2 text-right text-sm text-zinc-400 dark:text-zinc-600">
          No budget set
        </td>
      </tr>
    );
  }

  const { variance, budgeted, actual, variancePct } = line;
  const isOverBudget = variance > 0;
  const isGood = isCost ? !isOverBudget : isOverBudget;
  const color = variance === 0 ? "#9e9e9e" : isGood ? "#27ae60" : "#e74c3c";

  return (
    <tr className="border-b border-zinc-100 last:border-0 dark:border-zinc-900">
      <td className="py-2 text-sm text-zinc-600 dark:text-zinc-400">{label}</td>
      <td className="py-2 text-right text-sm text-zinc-900 dark:text-zinc-50">
        ${budgeted.toLocaleString()}
      </td>
      <td className="py-2 text-right text-sm text-zinc-900 dark:text-zinc-50">
        ${actual.toLocaleString()}
      </td>
      <td className="py-2 text-right text-sm font-medium" style={{ color }}>
        {variance >= 0 ? "+" : "-"}${Math.abs(variance).toLocaleString()}
        {variancePct !== null && ` (${variancePct >= 0 ? "+" : ""}${variancePct.toFixed(0)}%)`}
      </td>
    </tr>
  );
}

export function BudgetComparison({
  revenue,
  cogs,
  labor,
}: {
  revenue: BudgetLine;
  cogs: BudgetLine;
  labor: BudgetLine;
}) {
  const anyTracked = [revenue, cogs, labor].some((l) => l.status === "ok");

  return (
    <div className="rounded-2xl border border-zinc-200 p-6 shadow-sm dark:border-zinc-800">
      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Budget vs. Actual</h2>
      {!anyTracked ? (
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Set a monthly budget in Settings to compare it against your actuals here.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[420px] text-left">
            <thead>
              <tr className="border-b border-zinc-200 text-xs uppercase text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                <th className="pb-2 font-medium">Line</th>
                <th className="pb-2 text-right font-medium">Budgeted</th>
                <th className="pb-2 text-right font-medium">Actual</th>
                <th className="pb-2 text-right font-medium">Variance</th>
              </tr>
            </thead>
            <tbody>
              <BudgetLineRow label="Revenue" line={revenue} isCost={false} />
              <BudgetLineRow label="COGS" line={cogs} isCost={true} />
              <BudgetLineRow label="Labor" line={labor} isCost={true} />
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
