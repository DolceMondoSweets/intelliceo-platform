"use client";

import { useState, useTransition } from "react";
import { Button, inputClass } from "@/components/ui";
import { saveSquareCredentials, fetchSquareMtdRevenue, useFetchedRevenue } from "./actions";

export function SquareIntegrationClient({
  hasToken,
  locationId: initialLocationId,
  currentRevenueMtd,
}: {
  hasToken: boolean;
  locationId: string;
  currentRevenueMtd: number;
}) {
  const [accessToken, setAccessToken] = useState("");
  const [locationId, setLocationId] = useState(initialLocationId);
  const [connected, setConnected] = useState(hasToken);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isSaving, startSaveTransition] = useTransition();

  const [fetchedTotal, setFetchedTotal] = useState<number | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isFetching, startFetchTransition] = useTransition();

  const [useError, setUseError] = useState<string | null>(null);
  const [used, setUsed] = useState(false);
  const [isUsing, startUseTransition] = useTransition();

  function handleSave() {
    setSaveError(null);
    setSaveMessage(null);
    startSaveTransition(async () => {
      const result = await saveSquareCredentials({ accessToken, locationId });
      if (result.error) {
        setSaveError(result.error);
      } else {
        setSaveMessage("Saved.");
        setConnected(true);
        setAccessToken("");
      }
    });
  }

  function handleFetch() {
    setFetchError(null);
    setUsed(false);
    startFetchTransition(async () => {
      const result = await fetchSquareMtdRevenue();
      if (result.error) setFetchError(result.error);
      else setFetchedTotal(result.total ?? null);
    });
  }

  function handleUse() {
    if (fetchedTotal === null) return;
    setUseError(null);
    startUseTransition(async () => {
      const result = await useFetchedRevenue(fetchedTotal);
      if (result.error) setUseError(result.error);
      else setUsed(true);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
        <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {connected ? "Square credentials (connected)" : "Connect your Square account"}
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Get these from developer.squareup.com/apps — use the PRODUCTION access token (not
          sandbox) for real sales data.
        </p>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Square Access Token
          </label>
          <input
            type="password"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            placeholder={connected ? "Leave blank to keep the saved token" : "sq0atp-..."}
            autoComplete="off"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Square Location ID
          </label>
          <input
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            className={inputClass}
          />
        </div>

        {saveError && <p className="text-sm text-red-600 dark:text-red-400">{saveError}</p>}
        {saveMessage && (
          <p className="text-sm text-emerald-600 dark:text-emerald-400">{saveMessage}</p>
        )}

        <Button type="button" onClick={handleSave} disabled={isSaving} className="self-start">
          {isSaving ? "Saving…" : "Save Credentials"}
        </Button>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
        <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Month-to-date revenue
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Currently saved: ${currentRevenueMtd.toLocaleString()}
        </p>

        <Button
          type="button"
          variant="secondary"
          onClick={handleFetch}
          disabled={isFetching || !connected}
          className="self-start"
        >
          {isFetching ? "Pulling this month's completed orders…" : "Fetch MTD Revenue from Square"}
        </Button>
        {!connected && (
          <p className="text-xs text-zinc-400 dark:text-zinc-600">
            Save your Square credentials above first.
          </p>
        )}

        {fetchError && <p className="text-sm text-red-600 dark:text-red-400">{fetchError}</p>}

        {fetchedTotal !== null && (
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              ${fetchedTotal.toLocaleString()}
            </p>
            <Button type="button" onClick={handleUse} disabled={isUsing}>
              {isUsing
                ? "Saving…"
                : used
                  ? "Saved ✓"
                  : `Use $${fetchedTotal.toLocaleString()} as MTD Revenue`}
            </Button>
          </div>
        )}
        {useError && <p className="text-sm text-red-600 dark:text-red-400">{useError}</p>}
      </div>
    </div>
  );
}
