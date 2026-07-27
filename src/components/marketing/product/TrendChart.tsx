"use client";

import { Area, AreaChart, ResponsiveContainer } from "recharts";

// One subtle trend chart, no axes/gridlines/legend — restraint over
// decoration. Plausible business data only, never a meaningless random graph.
//
// `animate` drives the one-time "drawing" moment used by the CEO Brief
// mockup's signature viewport-entry sequence — off by default so this stays
// static everywhere else it's dropped in.
export function TrendChart({
  data,
  height = 64,
  animate = false,
}: {
  data: number[];
  height?: number;
  animate?: boolean;
}) {
  const points = data.map((value, index) => ({ index, value }));

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#004d59" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#004d59" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke="#004d59"
            strokeWidth={2}
            fill="url(#trendFill)"
            isAnimationActive={animate}
            animationDuration={450}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
