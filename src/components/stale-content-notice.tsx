"use client";

// Soft, non-blocking nudge shown above stale-but-still-fully-visible saved
// content (CEO Brief, Vital Signs) -- never hides or replaces anything,
// just suggests refreshing.
export function StaleContentNotice({
  onRefresh,
  isPending,
}: {
  onRefresh: () => void;
  isPending: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
      <span>This is over 12 hours old — the details below may be out of date.</span>
      <button
        type="button"
        onClick={onRefresh}
        disabled={isPending}
        className="font-medium underline underline-offset-2 disabled:opacity-60"
      >
        Refresh now
      </button>
    </div>
  );
}
