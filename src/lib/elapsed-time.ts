"use client";

import { useEffect, useState } from "react";

// 12 hours -- shared staleness threshold for CEO Brief and Vital Signs'
// "this is getting old, consider refreshing" prompt. Adjust here only
// temporarily for testing; must be reverted to 12h before shipping.
export const STALE_THRESHOLD_MS = 12 * 60 * 60 * 1000;

export function formatElapsed(elapsedMs: number): string {
  const totalMinutes = Math.max(0, Math.floor(elapsedMs / 60_000));
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) return `${days}d ${hours}h ago`;
  if (hours > 0) return `${hours}h ${minutes}m ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}

// Live-updating "Generated Xh Ym ago" + staleness flag for content loaded
// from storage. Ticks every 30s -- plenty for a minute-granularity label,
// no need for per-second updates.
export function useElapsedTime(createdAt: string | null): {
  label: string | null;
  isStale: boolean;
} {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!createdAt) return;
    const interval = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(interval);
  }, [createdAt]);

  if (!createdAt) return { label: null, isStale: false };

  const elapsedMs = now - new Date(createdAt).getTime();
  return {
    label: `Generated ${formatElapsed(elapsedMs)}`,
    isStale: elapsedMs > STALE_THRESHOLD_MS,
  };
}
