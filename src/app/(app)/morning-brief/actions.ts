"use server";

import { createClient } from "@/lib/supabase/server";
import { getSessionState } from "@/lib/supabase/session";
import { getAnthropicClient, askClaudeJson } from "@/lib/anthropic";
import { getKbContext, getFinanceSnapshot, getTrendHistoryString } from "@/lib/business-context";

export type DomainScore = { score: number | null; note: string };

export type MorningBrief = {
  momentum: "Positive" | "Neutral" | "Declining";
  cash_runway_days: number | null;
  domain_scores: Record<string, DomainScore>;
  overall_score: number | null;
  overall_note: string;
  biggest_opportunity: string;
  potential_impact: string;
  biggest_risk: string;
  recommended_focus: string;
  flagged_issues: string[];
  top_priorities: string[];
};

export type GenerateBriefResult = { brief?: MorningBrief; error?: string };

export async function generateMorningBrief(): Promise<GenerateBriefResult> {
  const client = getAnthropicClient();
  if (!client) return { error: "ANTHROPIC_API_KEY isn't configured yet." };

  const { businessId } = await getSessionState();
  const id = businessId as string;
  const supabase = await createClient();

  const [kbContext, financeSnapshot, trendHistory] = await Promise.all([
    getKbContext(supabase, id),
    getFinanceSnapshot(supabase, id),
    getTrendHistoryString(supabase, id),
  ]);

  const system =
    "You are Atlas, the AI Operating System for this business. Never hallucinate facts about " +
    "the business — use only what's in the business context and finance snapshot provided. " +
    "Where data is genuinely missing, say so plainly rather than guessing. Default to brutal " +
    "honesty and execution focus.\n\n" +
    "Respond ONLY with valid JSON, no markdown code fences, no commentary before or after — " +
    "just the raw JSON object, matching exactly this shape:\n\n" +
    "{\n" +
    '  "momentum": "Positive" | "Neutral" | "Declining",\n' +
    '  "cash_runway_days": <integer or null>,\n' +
    '  "domain_scores": {\n' +
    '    "Financial Health": {"score": <0-100 or null>, "note": "<reason if null, else empty string>"},\n' +
    '    "Operations": {"score": <0-100 or null>, "note": "..."},\n' +
    '    "Marketing": {"score": <0-100 or null>, "note": "..."},\n' +
    '    "Customer": {"score": <0-100 or null>, "note": "..."},\n' +
    '    "People": {"score": <0-100 or null>, "note": "..."},\n' +
    '    "Growth": {"score": <0-100 or null>, "note": "..."},\n' +
    '    "Risk": {"score": <0-100 or null>, "note": "..."}\n' +
    "  },\n" +
    '  "overall_score": <0-100 or null>,\n' +
    '  "overall_note": "<e.g. average of N scoreable domains>",\n' +
    '  "biggest_opportunity": "<one clear sentence>",\n' +
    '  "potential_impact": "<quantified if possible>",\n' +
    '  "biggest_risk": "<one clear sentence>",\n' +
    '  "recommended_focus": "<one clear action for today>",\n' +
    '  "flagged_issues": ["<short issue>", "..."],\n' +
    '  "top_priorities": ["<priority 1>", "<priority 2>", "<priority 3>", "<priority 4>", "<priority 5>"]\n' +
    "}\n\n" +
    "Every domain score must be your own reasoned estimate grounded in what's actually in the " +
    "business context and finance snapshot — never fabricate a precise number for a domain with " +
    "no underlying data; use null with a note instead. overall_score should reflect only the " +
    "average of domains that ARE scoreable. flagged_issues can be an empty list if nothing needs " +
    "flagging.";

  const userMessage =
    `BUSINESS CONTEXT:\n${kbContext}\n\n` +
    `FINANCE SNAPSHOT:\n${financeSnapshot}\n\n` +
    `RECENT TREND (previous briefs, oldest to newest):\n${trendHistory}\n\n` +
    "Give me the current CEO brief as JSON. Base 'momentum' on the actual trend above where " +
    "history exists (e.g. score/runway moving up or down across entries) rather than a guess " +
    "from today's snapshot alone. If there's no meaningful history yet, say so is fine — don't " +
    "fabricate a trend.";

  const brief = await askClaudeJson<MorningBrief>(client, system, userMessage, 4000);
  if (!brief) return { error: "Atlas returned a response that couldn't be read. Try again." };

  const today = new Date().toISOString().slice(0, 10);
  const { data: financeRow } = await supabase
    .from("finance_data")
    .select("revenue_mtd")
    .eq("business_id", id)
    .maybeSingle();

  await supabase.from("brief_history").upsert(
    {
      business_id: id,
      brief_date: today,
      overall_score: brief.overall_score,
      momentum: brief.momentum,
      cash_runway_days: brief.cash_runway_days,
      revenue_mtd: financeRow?.revenue_mtd ?? 0,
    },
    { onConflict: "business_id,brief_date" }
  );

  return { brief };
}
