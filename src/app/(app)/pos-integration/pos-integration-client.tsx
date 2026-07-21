"use client";

import { useState, useTransition } from "react";
import { Button, inputClass } from "@/components/ui";
import { savePosCredentials, fetchPosMtdRevenue, useFetchedRevenue, type PosType } from "./actions";

const PLATFORMS: { value: PosType; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "clover", label: "Clover" },
];

export function PosIntegrationClient({
  currentPosType,
  hasToken,
  locationId: initialLocationId,
  merchantId: initialMerchantId,
  currentRevenueMtd,
}: {
  currentPosType: PosType | null;
  hasToken: boolean;
  locationId: string;
  merchantId: string;
  currentRevenueMtd: number;
}) {
  const [posType, setPosType] = useState<PosType>(currentPosType ?? "square");
  const [accessToken, setAccessToken] = useState("");
  const [locationId, setLocationId] = useState(initialLocationId);
  const [merchantId, setMerchantId] = useState(initialMerchantId);
  const [connectedPosType, setConnectedPosType] = useState<PosType | null>(
    hasToken ? currentPosType : null
  );
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isSaving, startSaveTransition] = useTransition();

  const [fetchedTotal, setFetchedTotal] = useState<number | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isFetching, startFetchTransition] = useTransition();

  const [useError, setUseError] = useState<string | null>(null);
  const [used, setUsed] = useState(false);
  const [isUsing, startUseTransition] = useTransition();

  const isConnected = connectedPosType === posType;
  const switchingPlatform = connectedPosType !== null && connectedPosType !== posType;
  const platformLabel = posType === "square" ? "Square" : "Clover";

  function handleSave() {
    setSaveError(null);
    setSaveMessage(null);
    startSaveTransition(async () => {
      const result = await savePosCredentials(
        posType === "square"
          ? { posType: "square", accessToken, locationId }
          : { posType: "clover", accessToken, merchantId }
      );
      if (result.error) {
        setSaveError(result.error);
      } else {
        setSaveMessage("Saved.");
        setConnectedPosType(posType);
        setAccessToken("");
      }
    });
  }

  function handleFetch() {
    setFetchError(null);
    setUsed(false);
    startFetchTransition(async () => {
      const result = await fetchPosMtdRevenue();
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
          {isConnected ? `${platformLabel} credentials (connected)` : `Connect your ${platformLabel} account`}
        </h2>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Which POS system do you use?
          </label>
          <div className="flex gap-2">
            {PLATFORMS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => {
                  setPosType(p.value);
                  setSaveMessage(null);
                  setSaveError(null);
                }}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  posType === p.value
                    ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                    : "border border-zinc-300 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {switchingPlatform && (
          <p className="text-xs text-amber-600 dark:text-amber-400">
            You&apos;re currently connected to {connectedPosType === "square" ? "Square" : "Clover"}.
            Saving {platformLabel} credentials below will switch your active integration.
          </p>
        )}

        {posType === "square" ? (
          <>
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
                placeholder={isConnected ? "Leave blank to keep the saved token" : "sq0atp-..."}
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
          </>
        ) : (
          <>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Get these from your Clover Developer Dashboard — the Merchant ID from your merchant
              account, and a REST API Token generated for it.
            </p>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Clover API Token
              </label>
              <input
                type="password"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder={isConnected ? "Leave blank to keep the saved token" : "API token"}
                autoComplete="off"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Clover Merchant ID
              </label>
              <input
                value={merchantId}
                onChange={(e) => setMerchantId(e.target.value)}
                className={inputClass}
              />
            </div>
          </>
        )}

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
          disabled={isFetching || !connectedPosType}
          className="self-start"
        >
          {isFetching
            ? "Pulling this month's completed orders…"
            : `Fetch MTD Revenue from ${connectedPosType === "clover" ? "Clover" : "Square"}`}
        </Button>
        {!connectedPosType && (
          <p className="text-xs text-zinc-400 dark:text-zinc-600">
            Save your POS credentials above first.
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
