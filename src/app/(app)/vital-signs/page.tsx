import { VitalSignsClient } from "./vital-signs-client";

export default function VitalSignsPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 bg-zinc-50 px-6 py-10 dark:bg-black">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Vital Signs</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          A quick daily read on the health of the business — the 10 questions every founder should
          be able to answer.
        </p>
      </div>
      <VitalSignsClient />
    </div>
  );
}
