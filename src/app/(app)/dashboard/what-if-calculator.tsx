"use client";

import { useMemo, useState } from "react";
import {
  calculateBreakEven,
  calculateCogsMetrics,
  calculateRunwayMonths,
  formatRunwayMonths,
  type BreakEvenResult,
} from "@/lib/financial-formulas";

function formatBreakEven(result: BreakEvenResult): string {
  if (result.status === "ok") return `$${Math.round(result.breakEvenRevenue).toLocaleString()}`;
  if (result.status === "unreachable") return "Unreachable";
  return "N/A";
}

function formatPrimeCost(pct: number | null): string {
  return pct === null ? "N/A" : `${pct.toFixed(1)}%`;
}

export function WhatIfCalculator({
  cash,
  burn,
  revenueMtd,
  monthlyCogs,
  monthlyLaborCost,
}: {
  cash: number;
  burn: number;
  revenueMtd: number;
  monthlyCogs: number | null;
  monthlyLaborCost: number | null;
}) {
  const [revenuePct, setRevenuePct] = useState(0);
  const [costPct, setCostPct] = useState(0);

  const baseline = useMemo(() => {
    const runway = calculateRunwayMonths(cash, burn);
    const { primeCost, foodCost } = calculateCogsMetrics(monthlyCogs, monthlyLaborCost, revenueMtd);
    const breakEven = calculateBreakEven(burn, foodCost.pct);
    return { runway, primeCost, breakEven };
  }, [cash, burn, revenueMtd, monthlyCogs, monthlyLaborCost]);

  const hypothetical = useMemo(() => {
    const newRevenue = revenueMtd * (1 + revenuePct / 100);
    const newBurn = burn * (1 + costPct / 100);
    const newCogs = monthlyCogs !== null ? monthlyCogs * (1 + costPct / 100) : null;
    const newLabor = monthlyLaborCost !== null ? monthlyLaborCost * (1 + costPct / 100) : null;

    const runway = calculateRunwayMonths(cash, newBurn);
    const { primeCost, foodCost } = calculateCogsMetrics(newCogs, newLabor, newRevenue);
    const breakEven = calculateBreakEven(newBurn, foodCost.pct);
    return { runway, primeCost, breakEven };
  }, [cash, burn, revenueMtd, monthlyCogs, monthlyLaborCost, revenuePct, costPct]);

  const isDefault = revenuePct === 0 && costPct === 0;

  return (
    <div className="rounded-2xl border border-zinc-200 p-6 shadow-sm dark:border-zinc-800">
      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">What-If Calculator</h2>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        Adjust revenue and cost hypothetically — nothing here is saved.
      </p>

      <div className="mt-4 flex flex-col gap-4">
        <SliderField label="Revenue change" value={revenuePct} onChange={setRevenuePct} />
        <SliderField
          label="Cost change (burn, COGS, labor)"
          value={costPct}
          onChange={setCostPct}
        />
      </div>

      {!isDefault && (
        <button
          type="button"
          onClick={() => {
            setRevenuePct(0);
            setCostPct(0);
          }}
          className="mt-2 text-xs font-medium text-zinc-500 underline dark:text-zinc-400"
        >
          Reset
        </button>
      )}

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[380px] text-left">
          <thead>
            <tr className="border-b border-zinc-200 text-xs uppercase text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              <th className="pb-2 font-medium">Metric</th>
              <th className="pb-2 text-right font-medium">Current</th>
              <th className="pb-2 text-right font-medium">Hypothetical</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-zinc-100 last:border-0 dark:border-zinc-900">
              <td className="py-2 text-sm text-zinc-600 dark:text-zinc-400">Runway</td>
              <td className="py-2 text-right text-sm text-zinc-900 dark:text-zinc-50">
                {formatRunwayMonths(baseline.runway)}
              </td>
              <td className="py-2 text-right text-sm font-medium text-zinc-900 dark:text-zinc-50">
                {formatRunwayMonths(hypothetical.runway)}
              </td>
            </tr>
            <tr className="border-b border-zinc-100 last:border-0 dark:border-zinc-900">
              <td className="py-2 text-sm text-zinc-600 dark:text-zinc-400">Prime cost %</td>
              <td className="py-2 text-right text-sm text-zinc-900 dark:text-zinc-50">
                {formatPrimeCost(baseline.primeCost.pct)}
              </td>
              <td className="py-2 text-right text-sm font-medium text-zinc-900 dark:text-zinc-50">
                {formatPrimeCost(hypothetical.primeCost.pct)}
              </td>
            </tr>
            <tr>
              <td className="py-2 text-sm text-zinc-600 dark:text-zinc-400">Break-even revenue</td>
              <td className="py-2 text-right text-sm text-zinc-900 dark:text-zinc-50">
                {formatBreakEven(baseline.breakEven)}
              </td>
              <td className="py-2 text-right text-sm font-medium text-zinc-900 dark:text-zinc-50">
                {formatBreakEven(hypothetical.breakEven)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SliderField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm">
        <label className="font-medium text-zinc-700 dark:text-zinc-300">{label}</label>
        <span className="font-semibold text-zinc-900 dark:text-zinc-50">
          {value > 0 ? "+" : ""}
          {value}%
        </span>
      </div>
      <input
        type="range"
        min={-50}
        max={100}
        step={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-zinc-900 dark:accent-zinc-50"
      />
    </div>
  );
}
