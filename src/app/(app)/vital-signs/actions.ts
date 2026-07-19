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

export type VitalSignsResult = { answers?: VitalSignAnswer[]; error?: string };

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
    "You are Atlas, an AI operating system for a small business. Never hallucinate facts about " +
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
  if (!result) return { error: "Atlas returned a response that couldn't be read. Try again." };

  return { answers: result.answers };
}
