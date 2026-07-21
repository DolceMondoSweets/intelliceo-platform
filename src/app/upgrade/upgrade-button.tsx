"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui";
import { upgradeToGrowth, openBillingPortal } from "./actions";

export function UpgradeButton({ returnTo }: { returnTo?: string }) {
  const [error, setError] = useState<string | null>(null);
  const [isUpgrading, startUpgradeTransition] = useTransition();
  const [isOpeningPortal, startPortalTransition] = useTransition();

  function handleUpgrade() {
    setError(null);
    startUpgradeTransition(async () => {
      const result = await upgradeToGrowth(returnTo);
      if (result?.error) setError(result.error);
    });
  }

  function handleBillingPortal() {
    setError(null);
    startPortalTransition(async () => {
      const result = await openBillingPortal();
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <Button
        type="button"
        onClick={handleUpgrade}
        disabled={isUpgrading || isOpeningPortal}
        className="self-start"
      >
        {isUpgrading ? "Upgrading…" : "Upgrade to Growth — $89/mo"}
      </Button>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        You&apos;ll be charged a prorated amount today for the rest of this billing period, then
        $89/mo going forward. Your card on file is used automatically — no need to re-enter
        payment details.
      </p>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      <button
        type="button"
        onClick={handleBillingPortal}
        disabled={isUpgrading || isOpeningPortal}
        className="self-start text-sm font-medium text-zinc-500 underline disabled:opacity-60 dark:text-zinc-400"
      >
        {isOpeningPortal ? "Opening…" : "Or manage billing / update payment method"}
      </button>
    </div>
  );
}
