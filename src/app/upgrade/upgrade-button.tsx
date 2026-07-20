"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui";
import { openBillingPortal } from "./actions";

export function UpgradeButton() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await openBillingPortal();
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <Button type="button" onClick={handleClick} disabled={isPending} className="self-start">
        {isPending ? "Opening…" : "Manage billing"}
      </Button>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
