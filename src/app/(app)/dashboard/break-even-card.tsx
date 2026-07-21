import type { BreakEvenResult } from "@/lib/financial-formulas";

export function BreakEvenCard({
  result,
  revenueMtd,
}: {
  result: BreakEvenResult;
  revenueMtd: number;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 p-6 shadow-sm dark:border-zinc-800">
      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Break-Even Point</h2>

      {result.status === "not_tracked" && (
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Track your monthly ingredient cost (COGS) and revenue in Settings to see the minimum
          revenue you need to break even.
        </p>
      )}

      {result.status === "unreachable" && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          Your ingredient cost is at or above 100% of revenue — you can&apos;t break even at this
          food cost %, regardless of sales volume.
        </p>
      )}

      {result.status === "ok" && (
        <>
          <p className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
            ${Math.round(result.breakEvenRevenue).toLocaleString()}
            <span className="text-base font-normal text-zinc-500 dark:text-zinc-400"> / mo</span>
          </p>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            {revenueMtd >= result.breakEvenRevenue
              ? `You're $${Math.round(revenueMtd - result.breakEvenRevenue).toLocaleString()} above break-even this month.`
              : `You need $${Math.round(result.breakEvenRevenue - revenueMtd).toLocaleString()} more revenue this month to break even.`}
          </p>
        </>
      )}
    </div>
  );
}
