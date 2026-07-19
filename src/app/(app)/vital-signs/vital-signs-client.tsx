"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui";
import { getVitalSigns, type VitalSignAnswer } from "./actions";

const STATUS_STYLE: Record<string, { color: string; bg: string; icon: string }> = {
  good: { color: "#27ae60", bg: "#eafaf1", icon: "✅" },
  caution: { color: "#f39c12", bg: "#fef5e7", icon: "⚠️" },
  concern: { color: "#e74c3c", bg: "#fdecea", icon: "🔴" },
  unknown: { color: "#9e9e9e", bg: "#f2f2f2", icon: "❓" },
};

export function VitalSignsClient() {
  const [answers, setAnswers] = useState<VitalSignAnswer[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [isPending, startTransition] = useTransition();

  function handleGenerate() {
    setError(null);
    startTransition(async () => {
      const result = await getVitalSigns();
      if (result.error) {
        setError(result.error);
      } else {
        setAnswers(result.answers ?? []);
        setExpanded({});
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <Button type="button" onClick={handleGenerate} disabled={isPending} className="self-start">
        {isPending ? "Thinking through today…" : "Get Atlas's Answers"}
      </Button>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      {answers && (
        <div className="flex flex-col gap-2">
          {answers.map((a, i) => {
            const style = STATUS_STYLE[a.status] ?? STATUS_STYLE.unknown;
            const isExpanded = !!expanded[i];
            return (
              <div
                key={i}
                className="rounded-xl p-4"
                style={{ backgroundColor: style.bg, borderLeft: `4px solid ${style.color}` }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-zinc-900">
                    {style.icon} {a.question}
                  </span>
                  <span className="font-semibold" style={{ color: style.color }}>
                    {a.verdict}
                  </span>
                </div>
                {isExpanded && (
                  <p className="mt-2 border-t border-black/10 pt-2 text-sm text-zinc-700">
                    {a.detail}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setExpanded((prev) => ({ ...prev, [i]: !isExpanded }))}
                  className="mt-2 text-xs font-medium text-zinc-600 underline"
                >
                  {isExpanded ? "Show Less ▴" : "Read More ▾"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
