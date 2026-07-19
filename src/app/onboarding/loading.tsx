export default function OnboardingLoading() {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-10 dark:bg-black">
      <div className="w-full max-w-md animate-pulse flex-col gap-6">
        <div className="flex gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-1.5 flex-1 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          ))}
        </div>
        <div className="mt-6 h-6 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-4 h-12 w-full rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-6 flex gap-3">
          <div className="h-12 flex-1 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}
