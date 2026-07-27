"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { AlertTriangle, ArrowUpRight, LineChart as LineChartIcon } from "lucide-react";
import { LogoIcon } from "@/components/marketing/brand/Logo";
import { MockupFrame } from "./MockupFrame";
import { TrendChart } from "./TrendChart";

const REVENUE_BEFORE = 17050;
const REVENUE_AFTER = 18420;
const OVERALL_SCORE = 84;

function formatCurrency(value: number) {
  return `$${Math.round(value).toLocaleString("en-US")}`;
}

// The right-side hero product presentation, and the mockup shown in the CEO
// Brief showcase — five content areas, matching the "no more than five major
// content areas" mockup rule: greeting, revenue trend, cash runway, a
// flagged margin issue, a recommended focus area.
//
// This is the single signature metrics-animation spec (there is only one
// implementation, reused wherever this component appears): when the card
// enters the viewport, revenue counts up, the Overall Score fades in, the
// trend chart draws, and the recommendation reveals — sequenced to finish
// well under a second, no flashy effects.
export function CEOBriefCard({
  ownerName = "Alex",
  businessName = "Bluebird Coffee Co.",
  date,
  size = "default",
}: {
  ownerName?: string;
  businessName?: string;
  date?: string;
  size?: "default" | "large";
}) {
  const displayDate =
    date ??
    new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [revenue, setRevenue] = useState(REVENUE_BEFORE);
  const [showScore, setShowScore] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(REVENUE_BEFORE, REVENUE_AFTER, {
      duration: 0.4,
      ease: "easeOut",
      onUpdate: setRevenue,
    });
    const scoreTimer = setTimeout(() => setShowScore(true), 320);
    const recommendationTimer = setTimeout(() => setShowRecommendation(true), 600);

    return () => {
      controls.stop();
      clearTimeout(scoreTimer);
      clearTimeout(recommendationTimer);
    };
  }, [isInView]);

  const large = size === "large";

  return (
    <div ref={ref} className={`w-full ${large ? "max-w-[608px]" : "max-w-[480px]"}`}>
      <MockupFrame label={`CEO Brief · ${businessName}`}>
        <div className={large ? "p-7 sm:p-9" : "p-6 sm:p-8"}>
          {/* 1. Header / greeting — generated on request, not a time-of-day greeting */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <LogoIcon size={large ? 40 : 36} />
              <div>
                <p className={`font-bold text-mkt-text-primary ${large ? "text-lg" : "text-base"}`}>
                  Here&apos;s where things stand, {ownerName}
                </p>
                <p className="text-xs text-mkt-text-muted">{displayDate}</p>
              </div>
            </div>

            {/* Overall Score — real product metric name/format (X/100) */}
            <div
              className={`flex shrink-0 flex-col items-end transition-all duration-300 ease-out ${
                showScore ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
              }`}
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-mkt-text-muted">
                Overall Score
              </span>
              <span className={`font-bold text-mkt-success ${large ? "text-2xl" : "text-xl"}`}>
                {OVERALL_SCORE}/100
              </span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            {/* 2. Revenue trend */}
            <div className="rounded-mkt-md border border-mkt-border-light p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-mkt-text-muted">Revenue, last 14 days</span>
                <LineChartIcon className="h-4 w-4 text-brand-teal" strokeWidth={1.75} />
              </div>
              <p className={`mt-1 font-bold text-mkt-text-primary ${large ? "text-3xl" : "text-2xl"}`}>
                {formatCurrency(revenue)}
              </p>
              <TrendChart
                data={[9, 11, 10, 13, 12, 15, 14, 17, 15, 18, 17, 19, 18, 20]}
                height={large ? 76 : 64}
                animate={isInView}
              />
            </div>

            {/* 3. Cash runway */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-mkt-md border border-mkt-border-light p-4">
                <span className="text-xs font-medium text-mkt-text-muted">Cash on hand</span>
                <p className="mt-1 text-xl font-bold text-mkt-text-primary">$34,900</p>
              </div>
              <div className="rounded-mkt-md border border-mkt-border-light p-4">
                <span className="text-xs font-medium text-mkt-text-muted">Runway</span>
                <p className="mt-1 text-xl font-bold text-mkt-text-primary">4.8 mo</p>
              </div>
            </div>

            {/* 4. Flagged margin issue */}
            <div className="flex items-start gap-3 rounded-mkt-md bg-mkt-warning-bg p-4">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-mkt-warning" strokeWidth={1.75} />
              <p className="text-sm leading-snug text-mkt-text-primary">
                Prime cost is up to <span className="font-semibold">67%</span> this week, above the
                healthy 60–65% range.
              </p>
            </div>

            {/* 5. Recommended focus area — the gold "key action" moment, reveals last */}
            <div
              className={`flex items-start justify-between gap-3 rounded-mkt-md border border-brand-gold/30 bg-brand-gold-light p-4 transition-all duration-300 ease-out ${
                showRecommendation ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.08em] text-brand-gold-dark">
                  Recommended focus
                </span>
                <p className="mt-1 text-sm font-medium leading-snug text-mkt-text-primary">
                  Review weekend labor scheduling before next payroll cycle.
                </p>
              </div>
              <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold-dark" strokeWidth={2} />
            </div>
          </div>
        </div>
      </MockupFrame>
    </div>
  );
}
