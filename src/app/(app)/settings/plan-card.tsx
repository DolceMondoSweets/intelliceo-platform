"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui";
import { changePlan, cancelPlan, undoCancelPlan, openBillingPortal } from "./plan-actions";

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function PlanCard({
  tierName,
  tierPrice,
  otherTierName,
  status,
  trialEndsAt,
  currentPeriodEnd,
  cancelAtPeriodEnd,
}: {
  tierName: string;
  tierPrice: string;
  otherTierName: string;
  status: string | null;
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}) {
  const [error, setError] = useState<string | null>(null);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<
    "change" | "cancel" | "undo" | "portal" | null
  >(null);

  const isGrowth = tierName === "Growth";
  const isTrialing = status === "trialing";

  function run(action: typeof pendingAction, fn: () => Promise<{ error?: string }>) {
    setError(null);
    setPendingAction(action);
    startTransition(async () => {
      const result = await fn();
      if (result?.error) setError(result.error);
      if (action === "cancel") setConfirmingCancel(false);
    });
  }

  const renewalLabel = cancelAtPeriodEnd
    ? `Cancels ${formatDate(currentPeriodEnd) ?? "at period end"}`
    : isTrialing
      ? `Trial ends ${formatDate(trialEndsAt) ?? "soon"}`
      : status === "past_due"
        ? "Payment past due — update your card below"
        : currentPeriodEnd
          ? `Renews ${formatDate(currentPeriodEnd)}`
          : null;

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
      <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Plan & billing</h2>

      <div className="flex items-baseline justify-between">
        <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          {tierName} <span className="text-base font-normal text-zinc-500 dark:text-zinc-400">— {tierPrice}</span>
        </p>
        {status === "past_due" && (
          <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-950/50 dark:text-red-400">
            PAST DUE
          </span>
        )}
      </div>

      {renewalLabel && (
        <p
          className={`text-sm ${cancelAtPeriodEnd ? "text-red-600 dark:text-red-400" : "text-zinc-500 dark:text-zinc-400"}`}
        >
          {renewalLabel}
        </p>
      )}

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <div className="mt-1 flex flex-wrap gap-2">
        {cancelAtPeriodEnd ? (
          <Button
            type="button"
            onClick={() => run("undo", undoCancelPlan)}
            disabled={isPending}
            className="self-start"
          >
            {isPending && pendingAction === "undo" ? "Restoring…" : "Keep my plan"}
          </Button>
        ) : (
          <>
            <Button
              type="button"
              onClick={() => run("change", () => changePlan(isGrowth ? "starter" : "growth"))}
              disabled={isPending}
              className="self-start"
            >
              {isPending && pendingAction === "change"
                ? "Updating…"
                : isGrowth
                  ? `Downgrade to ${otherTierName}`
                  : `Upgrade to ${otherTierName}`}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={() => run("portal", () => openBillingPortal())}
              disabled={isPending}
              className="self-start"
            >
              {isPending && pendingAction === "portal" ? "Opening…" : "Manage billing"}
            </Button>
          </>
        )}
      </div>

      {!cancelAtPeriodEnd &&
        (confirmingCancel ? (
          <div className="mt-1 flex flex-col gap-2 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900/50 dark:bg-red-950/20">
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              Your plan will stay active until{" "}
              {formatDate(currentPeriodEnd) ?? "the end of this billing period"}, then cancel
              automatically. Nothing is deleted — you can reactivate any time before then.
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => run("cancel", cancelPlan)}
                disabled={isPending}
                className="self-start"
              >
                {isPending && pendingAction === "cancel" ? "Canceling…" : "Yes, cancel my plan"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setConfirmingCancel(false)}
                disabled={isPending}
                className="self-start"
              >
                Never mind
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmingCancel(true)}
            disabled={isPending}
            className="self-start text-sm font-medium text-zinc-500 underline disabled:opacity-60 dark:text-zinc-400"
          >
            Cancel plan
          </button>
        ))}
    </section>
  );
}
