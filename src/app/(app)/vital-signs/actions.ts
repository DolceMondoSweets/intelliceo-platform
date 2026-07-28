"use server";

import { createClient } from "@/lib/supabase/server";
import { getSessionState } from "@/lib/supabase/session";
import { getAnthropicClient, askClaudeJson } from "@/lib/anthropic";
import { getKbContext, getFinanceSnapshot } from "@/lib/business-context";
import { TEN_QUESTIONS } from "./constants";

export type VitalSignAnswer = {
  question: string;
  status: "good" | "caution" | "concern" | "unknown";
  verdict: string;
  detail: string;
};

export type VitalSignsResult = { answers?: VitalSignAnswer[]; createdAt?: string; error?: string };

export type StoredVitalSigns = { answers: VitalSignAnswer[]; createdAt: string };

// Most recently saved result, if any -- read directly by the page's server
// component, no client-side round trip needed for the common case of
// "I already generated this today, just show it to me."
export async function getLatestVitalSigns(): Promise<StoredVitalSigns | null> {
  const { businessId } = await getSessionState();
  if (!businessId) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("vital_signs_history")
    .select("full_content, created_at")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data?.full_content || !data.created_at) return null;
  return { answers: (data.full_content as { answers: VitalSignAnswer[] }).answers, createdAt: data.created_at };
}

export async function getVitalSigns(): Promise<VitalSignsResult> {
  const client = getAnthropicClient();
  if (!client) return { error: "ANTHROPIC_API_KEY isn't configured yet." };

  const { businessId } = await getSessionState();
  const supabase = await createClient();
  const [kbContext, financeSnapshot] = await Promise.all([
    getKbContext(supabase, businessId as string),
    getFinanceSnapshot(supabase, businessId as string),
  ]);

  const system =
    "You are IntelliCEO, an AI operating system for a small business. Never hallucinate facts about " +
    "the business — use only the business context and finance snapshot provided. Where the " +
    "answer depends on facts not in your context, say so plainly instead of guessing. Default " +
    "to brutal honesty and execution focus.\n\n" +
    "Respond ONLY with valid JSON, no markdown code fences, no commentary before or after — " +
    "just the raw JSON object, matching exactly this shape:\n\n" +
    "{\n" +
    '  "answers": [\n' +
    "    {\n" +
    '      "question": "<the exact question text as given>",\n' +
    '      "status": "good" | "caution" | "concern" | "unknown",\n' +
    '      "verdict": "<one short punchy phrase, 3-8 words>",\n' +
    '      "detail": "<2-4 sentences of grounded explanation>"\n' +
    "    }\n" +
    "    ... one object per question, in the same order given\n" +
    "  ]\n" +
    "}\n\n" +
    "status meanings: 'good' = healthy/on track, 'caution' = watch this, 'concern' = needs " +
    "attention now, 'unknown' = no data exists to answer this yet (use this honestly rather " +
    "than guessing a status).";

  const questionsBlock = TEN_QUESTIONS.map((q, i) => `${i + 1}. ${q}`).join("\n");
  const userMessage =
    `BUSINESS CONTEXT:\n${kbContext}\n\n` +
    `FINANCE SNAPSHOT:\n${financeSnapshot}\n\n` +
    `QUESTIONS:\n${questionsBlock}`;

  const result = await askClaudeJson<{ answers: VitalSignAnswer[] }>(
    client,
    system,
    userMessage,
    3000
  );
  if (!result) return { error: "IntelliCEO returned a response that couldn't be read. Try again." };

  // Append-only -- unlike brief_history there's no trend-chart use case here
  // requiring one row per day, so every generation just gets its own row;
  // "most recent" is simply the latest by created_at.
  const now = new Date();
  await supabase.from("vital_signs_history").insert({
    business_id: businessId as string,
    full_content: result,
    created_at: now.toISOString(),
  });

  return { answers: result.answers, createdAt: now.toISOString() };
}
