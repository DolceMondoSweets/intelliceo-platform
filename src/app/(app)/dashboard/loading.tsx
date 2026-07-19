export default function DashboardLoading() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 animate-pulse flex-col gap-6 bg-zinc-50 px-6 py-10 dark:bg-black">
      <div className="flex flex-col gap-2">
        <div className="h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-7 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
          <div className="h-4 w-28 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-2 h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
      ))}

      <div className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
        <div className="h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-3 grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 rounded bg-zinc-200 dark:bg-zinc-800" />
          ))}
        </div>
      </div>

      <div className="h-11 w-full rounded-full bg-zinc-200 dark:bg-zinc-800" />
    </div>
  );
}
