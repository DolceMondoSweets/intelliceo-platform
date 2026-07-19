"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui";
import { generateMorningBrief, type MorningBrief } from "./actions";
import { DOMAIN_ORDER } from "./constants";

function scoreColor(score: number | null): string {
  if (score === null) return "#9e9e9e";
  if (score < 40) return "#e74c3c";
  if (score < 70) return "#f39c12";
  return "#27ae60";
}

function runwayColor(days: number | null): string {
  if (days === null) return "#9e9e9e";
  if (days < 30) return "#e74c3c";
  if (days < 60) return "#f39c12";
  return "#27ae60";
}

function momentumColor(momentum: string): string {
  return { Positive: "#27ae60", Neutral: "#f39c12", Declining: "#e74c3c" }[momentum] ?? "#9e9e9e";
}

const PRIORITY_COLORS = ["#c0392b", "#e67e22", "#f1c40f", "#2980b9", "#8e44ad"];

export function MorningBriefClient({
  initialBrief,
  trendHistory,
}: {
  initialBrief: MorningBrief | null;
  trendHistory: Array<{ brief_date: string; overall_score: number | null }>;
}) {
  const [brief, setBrief] = useState<MorningBrief | null>(initialBrief);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleGenerate() {
    setError(null);
    startTransition(async () => {
      const result = await generateMorningBrief();
      if (result.error) setError(result.error);
      else setBrief(result.brief ?? null);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <Button type="button" onClick={handleGenerate} disabled={isPending} className="self-start">
        {isPending ? "Asking Claude…" : "Generate Fresh Morning Brief"}
      </Button>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      {!brief && !error && (
        <p className="text-sm text-zinc-400 dark:text-zinc-600">
          Click the button to generate a fresh brief.
        </p>
      )}

      {brief && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">OVERALL SCORE</div>
              <div
                className="text-3xl font-bold"
                style={{ color: scoreColor(brief.overall_score) }}
              >
                {brief.overall_score !== null ? `${brief.overall_score}/100` : "N/A"}
              </div>
            </div>
            <div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">MOMENTUM</div>
              <div
                className="mt-1 text-xl font-bold"
                style={{ color: momentumColor(brief.momentum) }}
              >
                {brief.momentum}
              </div>
            </div>
            <div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">CASH RUNWAY</div>
              <div
                className="mt-1 text-xl font-bold"
                style={{ color: runwayColor(brief.cash_runway_days) }}
              >
                {brief.cash_runway_days !== null ? `${brief.cash_runway_days} days` : "Unknown"}
              </div>
            </div>
          </div>
          {brief.overall_note && (
            <p className="-mt-3 text-center text-xs text-zinc-500 dark:text-zinc-400">
              {brief.overall_note}
            </p>
          )}

          <div>
            <h2 className="mb-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              CEO Intelligence Score by Domain
            </h2>
            <div className="flex flex-col gap-2">
              {DOMAIN_ORDER.map((domain) => {
                const entry = brief.domain_scores?.[domain];
                const score = entry?.score ?? null;
                if (score === null) return null;
                return (
                  <div key={domain} className="flex items-center gap-3">
                    <span className="w-32 shrink-0 text-sm text-zinc-600 dark:text-zinc-400">
                      {domain}
                    </span>
                    <div className="h-3 flex-1 rounded-full bg-zinc-200 dark:bg-zinc-800">
                      <div
                        className="h-3 rounded-full"
                        style={{ width: `${score}%`, backgroundColor: scoreColor(score) }}
                      />
                    </div>
                    <span className="w-8 text-right text-sm text-zinc-600 dark:text-zinc-400">
                      {score}
                    </span>
                  </div>
                );
              })}
            </div>
            {DOMAIN_ORDER.some((d) => brief.domain_scores?.[d]?.score === null) && (
              <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-600">
                Not yet scoreable (no data source):{" "}
                {DOMAIN_ORDER.filter((d) => brief.domain_scores?.[d]?.score === null).join(", ")}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border-l-4 border-emerald-500 bg-emerald-50 p-4 dark:bg-emerald-950/30">
              <div className="mb-1 font-semibold text-emerald-800 dark:text-emerald-400">
                🟢 Today's Biggest Opportunity
              </div>
              <p className="text-sm text-zinc-800 dark:text-zinc-200">
                {brief.biggest_opportunity || "—"}
              </p>
              {brief.potential_impact && (
                <p className="mt-2 text-sm italic text-zinc-500 dark:text-zinc-400">
                  {brief.potential_impact}
                </p>
              )}
            </div>
            <div className="rounded-xl border-l-4 border-red-500 bg-red-50 p-4 dark:bg-red-950/30">
              <div className="mb-1 font-semibold text-red-800 dark:text-red-400">
                🔴 Biggest Risk
              </div>
              <p className="text-sm text-zinc-800 dark:text-zinc-200">
                {brief.biggest_risk || "—"}
              </p>
            </div>
          </div>

          <div className="rounded-xl border-l-4 border-amber-500 bg-amber-50 p-4 dark:bg-amber-950/30">
            <div className="mb-1 font-semibold text-amber-800 dark:text-amber-400">
              🎯 Recommended Focus
            </div>
            <p className="text-sm text-zinc-800 dark:text-zinc-200">
              {brief.recommended_focus || "—"}
            </p>
          </div>

          {brief.flagged_issues && brief.flagged_issues.length > 0 ? (
            <div>
              <h2 className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                ⚠️ Flagged Issues
              </h2>
              <div className="flex flex-col gap-2">
                {brief.flagged_issues.map((issue, i) => (
                  <div
                    key={i}
                    className="rounded-lg border-l-4 border-amber-400 bg-amber-50 px-4 py-2 text-sm text-zinc-800 dark:bg-amber-950/30 dark:text-zinc-200"
                  >
                    ⚠ {issue}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              Everything else is on track.
            </p>
          )}

          <div>
            <h2 className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              🎯 Today's Top 5 Priorities
            </h2>
            <div className="flex flex-col gap-2">
              {(brief.top_priorities ?? []).map((p, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg bg-zinc-100 px-4 py-3 dark:bg-zinc-900"
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold text-white"
                    style={{ backgroundColor: PRIORITY_COLORS[i % PRIORITY_COLORS.length] }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm text-zinc-800 dark:text-zinc-200">{p}</span>
                </div>
              ))}
            </div>
          </div>

          <TrendChart history={trendHistory} />
        </div>
      )}
    </div>
  );
}

function TrendChart({
  history,
}: {
  history: Array<{ brief_date: string; overall_score: number | null }>;
}) {
  const scored = history.filter(
    (h): h is { brief_date: string; overall_score: number } => h.overall_score !== null
  );

  if (scored.length === 1) {
    return (
      <p className="text-xs text-zinc-400 dark:text-zinc-600">
        Trend chart will appear once you have at least two days of Morning Briefs.
      </p>
    );
  }
  if (scored.length < 2) return null;

  const points = scored
    .map((h, i) => {
      const x = (i / (scored.length - 1)) * 100;
      const y = 100 - h.overall_score;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div>
      <h2 className="mb-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
        📈 Overall Score Trend
      </h2>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-32 w-full">
        <polyline
          points={points}
          fill="none"
          stroke="#2980b9"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
        {scored.map((h, i) => {
          const x = (i / (scored.length - 1)) * 100;
          const y = 100 - h.overall_score;
          return <circle key={i} cx={x} cy={y} r={1.5} fill="#2980b9" />;
        })}
      </svg>
    </div>
  );
}
