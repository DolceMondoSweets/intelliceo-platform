import { createClient } from "@/lib/supabase/server";
import { getSessionState } from "@/lib/supabase/session";
import { calculateRunwayMonths, formatRunwayMonths } from "@/lib/financial-formulas";
import { MorningBriefClient } from "./morning-brief-client";
import type { MorningBrief } from "./actions";

export default async function MorningBriefPage() {
  const { businessId: id } = await getSessionState();
  const businessId = id as string; // guaranteed by (app)/layout.tsx
  const supabase = await createClient();

  const [{ data: finance }, { data: history }] = await Promise.all([
    supabase.from("finance_data").select("*").eq("business_id", businessId).maybeSingle(),
    supabase
      .from("brief_history")
      .select("brief_date, overall_score, full_content, created_at")
      .eq("business_id", businessId)
      .order("brief_date", { ascending: true }),
  ]);

  // One row per business per day (brief_history's own unique constraint),
  // so the last entry in this ascending list is also the most recent
  // overall -- no separate query needed for "latest saved brief."
  const latest = history && history.length > 0 ? history[history.length - 1] : null;
  const initialBrief = (latest?.full_content as MorningBrief | null) ?? null;
  const initialCreatedAt = latest?.created_at ?? null;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 bg-zinc-50 px-6 py-10 dark:bg-black">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          CEO Brief
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>

      <div className="rounded-xl border-l-4 border-emerald-500 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
        Cash: ${(finance?.cash ?? 0).toLocaleString()} | Burn: $
        {(finance?.burn ?? 0).toLocaleString()} | Runway:{" "}
        {formatRunwayMonths(calculateRunwayMonths(finance?.cash ?? 0, finance?.burn ?? 0))} | MTD
        Revenue: ${(finance?.revenue_mtd ?? 0).toLocaleString()}
      </div>

      <MorningBriefClient
        initialBrief={initialBrief}
        initialCreatedAt={initialCreatedAt}
        trendHistory={history ?? []}
      />
    </div>
  );
}
