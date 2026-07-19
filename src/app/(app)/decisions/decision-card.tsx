"use client";

import { useState, useTransition } from "react";
import { Button, inputClass } from "@/components/ui";
import { closeDecision } from "./actions";
import type { Database } from "@/lib/supabase/database.types";

type Decision = Database["public"]["Tables"]["decisions"]["Row"];

export function DecisionCard({ decision }: { decision: Decision }) {
  const [expanded, setExpanded] = useState(false);
  const [actual, setActual] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isClosed = decision.status === "Closed";

  function handleClose() {
    setError(null);
    startTransition(async () => {
      const result = await closeDecision(decision.id, actual);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2 text-sm text-zinc-900 dark:text-zinc-50">
          <span>{isClosed ? "🟢" : "🟡"}</span>
          <span>
            {decision.created_at ? new Date(decision.created_at).toLocaleDateString() : ""} —{" "}
            {decision.decision.slice(0, 70)}
          </span>
        </span>
        <span className="text-zinc-400">{expanded ? "▴" : "▾"}</span>
      </button>

      {expanded && (
        <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <p className="font-medium text-zinc-900 dark:text-zinc-50">{decision.decision}</p>
          {decision.why && (
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              <span className="text-zinc-400 dark:text-zinc-600">Why: </span>
              {decision.why}
            </p>
          )}
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            <span className="text-zinc-400 dark:text-zinc-600">Who: </span>
            {decision.who ?? "Founder"}
          </p>
          {decision.expected_outcome && (
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              <span className="text-zinc-400 dark:text-zinc-600">Expected outcome: </span>
              {decision.expected_outcome}
            </p>
          )}
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            <span className="text-zinc-400 dark:text-zinc-600">Actual outcome: </span>
            {decision.actual_outcome ?? "TBD"}
          </p>
          <span
            className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${
              isClosed ? "bg-emerald-600" : "bg-amber-500"
            }`}
          >
            {(decision.status ?? "Open").toUpperCase()}
          </span>

          {!isClosed && (
            <div className="mt-4 flex flex-col gap-2">
              <textarea
                value={actual}
                onChange={(e) => setActual(e.target.value)}
                placeholder="What was the real outcome?"
                rows={2}
                className={inputClass}
              />
              {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
              <Button type="button" onClick={handleClose} disabled={isPending} className="self-start">
                {isPending ? "Saving…" : "Save Outcome & Close"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
