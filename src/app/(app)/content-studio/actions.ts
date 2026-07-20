"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSessionState } from "@/lib/supabase/session";
import { isGrowthTier } from "@/lib/subscription";
import { getAnthropicClient, askClaude } from "@/lib/anthropic";
import { getKbContext } from "@/lib/business-context";

const GROWTH_REQUIRED_ERROR = "Content Studio is a Growth plan feature.";

export type GenerateDraftInput = {
  contentType: string;
  platform: string | null;
  topic: string;
  toneNotes: string;
};

export type GenerateDraftResult = { content?: string; error?: string };

export async function generateDraft(input: GenerateDraftInput): Promise<GenerateDraftResult> {
  if (!input.topic.trim()) {
    return { error: "Tell Atlas what this content should be about first." };
  }

  const client = getAnthropicClient();
  if (!client) return { error: "ANTHROPIC_API_KEY isn't configured yet." };

  const { businessId, subscriptionTier } = await getSessionState();
  if (!isGrowthTier(subscriptionTier)) return { error: GROWTH_REQUIRED_ERROR };

  const supabase = await createClient();
  const kbContext = await getKbContext(supabase, businessId as string);

  const system =
    "You are Atlas's marketing content assistant. Use ONLY the business context provided for " +
    "facts about products, channels, pricing, and priorities — never invent product names, " +
    "prices, or claims not grounded in that context. Match a warm, premium brand voice " +
    "appropriate to a small but ambitious business. Output ONLY the ready-to-use copy itself — " +
    'no meta-commentary, no "Here\'s a draft:", no explanation before or after.';

  const platformLine = input.platform ? `Platform: ${input.platform}\n` : "";
  const userMessage =
    `BUSINESS CONTEXT:\n${kbContext}\n\n` +
    `CONTENT TYPE: ${input.contentType}\n` +
    platformLine +
    `TOPIC/FOCUS: ${input.topic.trim()}\n` +
    `TONE/NOTES: ${input.toneNotes.trim() || "Use your best judgment based on the brand context."}\n\n` +
    "Write the content now.";

  const draft = await askClaude(client, system, userMessage, 1500);
  if (!draft) return { error: "Atlas didn't return any content. Try again." };

  return { content: draft };
}

export type SaveDraftInput = {
  contentType: string;
  topic: string;
  content: string;
};

export async function saveDraft(input: SaveDraftInput): Promise<{ error?: string }> {
  const { businessId, subscriptionTier } = await getSessionState();
  if (!isGrowthTier(subscriptionTier)) return { error: GROWTH_REQUIRED_ERROR };

  const supabase = await createClient();

  const { error } = await supabase.from("marketing_drafts").insert({
    business_id: businessId,
    content_type: input.contentType,
    topic: input.topic,
    content: input.content,
  });

  if (error) return { error: error.message };

  revalidatePath("/content-studio");
  return {};
}
