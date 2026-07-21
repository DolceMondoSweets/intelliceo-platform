"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button, inputClass } from "@/components/ui";
import { logGoal, type GoalFormState } from "./actions";

export function GoalForm() {
  const [state, formAction, isPending] = useActionState<GoalFormState, FormData>(logGoal, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-3 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800"
    >
      <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Set a new goal</h2>
      <textarea
        name="title"
        placeholder="What are you trying to achieve?"
        required
        rows={2}
        className={inputClass}
      />
      <input
        name="targetMetric"
        placeholder="Metric (e.g. Monthly Revenue, New Customers)"
        className={inputClass}
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          name="targetValue"
          type="number"
          inputMode="decimal"
          placeholder="Target value"
          className={inputClass}
        />
        <input name="targetDate" type="date" className={inputClass} />
      </div>
      {state.error && <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>}
      <Button type="submit" disabled={isPending} className="self-start">
        {isPending ? "Saving…" : "Save Goal"}
      </Button>
    </form>
  );
}
