"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button, inputClass } from "@/components/ui";
import { logDecision, type DecisionFormState } from "./actions";

export function DecisionForm() {
  const [state, formAction, isPending] = useActionState<DecisionFormState, FormData>(
    logDecision,
    {}
  );
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
      <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Log a new decision</h2>
      <textarea
        name="decision"
        placeholder="What was decided?"
        required
        rows={2}
        className={inputClass}
      />
      <textarea name="why" placeholder="Why — rationale, why now?" rows={2} className={inputClass} />
      <input name="who" placeholder="Who" defaultValue="Founder" className={inputClass} />
      <textarea
        name="expectedOutcome"
        placeholder="Expected outcome"
        rows={2}
        className={inputClass}
      />
      {state.error && <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>}
      <Button type="submit" disabled={isPending} className="self-start">
        {isPending ? "Saving…" : "Save Decision"}
      </Button>
    </form>
  );
}
