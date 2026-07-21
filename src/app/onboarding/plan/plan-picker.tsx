"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui";
import { createCheckoutSession } from "./actions";
import type { SubscriptionTier } from "@/lib/stripe";

const PLANS: {
  tier: SubscriptionTier;
  name: string;
  price: string;
  features: string[];
}[] = [
  {
    tier: "starter",
    name: "Starter",
    price: "$59/mo",
    features: [
      "Dashboard",
      "CEO Brief",
      "Vital Signs",
      "Decisions Log",
      "Chat",
      "Food Cost % / Prime Cost tracking",
    ],
  },
  {
    tier: "growth",
    name: "Growth",
    price: "$89/mo",
    features: ["Everything in Starter", "Content Studio", "POS Integration (Square or Clover)"],
  },
];

export function PlanPicker({ growthAvailable }: { growthAvailable: boolean }) {
  const [error, setError] = useState<string | null>(null);
  const [pendingTier, setPendingTier] = useState<SubscriptionTier | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSelect(tier: SubscriptionTier) {
    setError(null);
    setPendingTier(tier);
    startTransition(async () => {
      const result = await createCheckoutSession(tier);
      if (result.error) setError(result.error);
    });
  }

  const visiblePlans = growthAvailable ? PLANS : PLANS.filter((plan) => plan.tier === "starter");

  return (
    <div className="flex flex-col gap-4">
      {!growthAvailable && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Growth&apos;s POS integration currently supports Square and Clover, with more platforms
          coming soon — so only Starter is available for now.
        </p>
      )}
      {visiblePlans.map((plan) => (
        <div
          key={plan.tier}
          className="flex flex-col gap-3 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800"
        >
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
              {plan.name} — {plan.price}
            </h2>
            <ul className="mt-2 flex flex-col gap-1 text-sm text-zinc-600 dark:text-zinc-400">
              {plan.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
          </div>
          <Button
            type="button"
            onClick={() => handleSelect(plan.tier)}
            disabled={isPending}
            className="self-start"
          >
            {isPending && pendingTier === plan.tier ? "Starting…" : "Start free trial"}
          </Button>
        </div>
      ))}
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
