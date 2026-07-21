"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui";
import { markGoalAchieved } from "./actions";
import type { Database } from "@/lib/supabase/database.types";

type Goal = Database["public"]["Tables"]["goals"]["Row"];

function isOverdue(goal: Goal): boolean {
  if (goal.status !== "Active" || !goal.target_date) return false;
  const today = new Date().toISOString().slice(0, 10);
  return goal.target_date < today;
}

// target_date is a plain "YYYY-MM-DD" date with no time component.
// new Date(dateOnlyString) parses it as UTC midnight, so .toLocaleDateString()
// in any timezone behind UTC renders the day before the one actually stored —
// parsing the components into the local-timezone Date constructor avoids that.
function formatDateOnly(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString();
}

export function GoalCard({ goal }: { goal: Goal }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isAchieved = goal.status === "Achieved";
  const overdue = isOverdue(goal);

  function handleAchieve() {
    setError(null);
    startTransition(async () => {
      const result = await markGoalAchieved(goal.id);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="flex items-start justify-between gap-3">
        <p className="font-medium text-zinc-900 dark:text-zinc-50">{goal.title}</p>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${
            isAchieved ? "bg-emerald-600" : overdue ? "bg-red-500" : "bg-amber-500"
          }`}
        >
          {isAchieved ? "ACHIEVED" : overdue ? "OVERDUE" : "ACTIVE"}
        </span>
      </div>

      {(goal.target_metric || goal.target_value !== null || goal.target_date) && (
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {goal.target_metric ?? "Target"}
          {goal.target_value !== null && `: ${goal.target_value.toLocaleString()}`}
          {goal.target_date && ` by ${formatDateOnly(goal.target_date)}`}
        </p>
      )}

      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}

      {!isAchieved && (
        <Button
          type="button"
          variant="secondary"
          onClick={handleAchieve}
          disabled={isPending}
          className="mt-3 self-start"
        >
          {isPending ? "Saving…" : "Mark Achieved"}
        </Button>
      )}
    </div>
  );
}
