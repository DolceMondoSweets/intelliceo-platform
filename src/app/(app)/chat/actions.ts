"use server";

import { createClient } from "@/lib/supabase/server";
import { getSessionState } from "@/lib/supabase/session";
import { getAnthropicClient, askClaude, askClaudeConversation, type ChatMessage } from "@/lib/anthropic";
import { getKbContext, getFinanceSnapshot, getTrendHistoryString } from "@/lib/business-context";

// No page.tsx in this folder on purpose — Chat is a global floating panel
// (rendered in (app)/layout.tsx), not a route, so this file only hosts the
// Server Actions.

// Once the verbatim window exceeds this many unsummarized messages, the
// oldest overflow is folded into chat_summary, bringing the window back
// down to RECENT_WINDOW_TARGET. Messages are never deleted from
// chat_messages — this only affects what's sent to Claude as context.
const RECENT_WINDOW_TARGET = 16;
const RECENT_WINDOW_MAX = 20;

export type StoredChatMessage = { role: "user" | "assistant"; content: string; createdAt: string };

export async function getChatHistory(): Promise<StoredChatMessage[]> {
  const { businessId } = await getSessionState();
  const id = businessId as string; // guaranteed by (app)/layout.tsx
  const supabase = await createClient();

  const { data } = await supabase
    .from("chat_messages")
    .select("role, content, created_at")
    .eq("business_id", id)
    .order("created_at", { ascending: true });

  return (data ?? []).map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
    createdAt: m.created_at ?? new Date().toISOString(),
  }));
}

export type AskChatResult = { reply?: string; error?: string };

export async function askChat(newMessage: string): Promise<AskChatResult> {
  const trimmed = newMessage.trim();
  if (!trimmed) return { error: "Type a message first." };

  const client = getAnthropicClient();
  if (!client) return { error: "ANTHROPIC_API_KEY isn't configured yet." };

  const { businessId } = await getSessionState();
  const id = businessId as string; // guaranteed by (app)/layout.tsx
  const supabase = await createClient();

  const { error: insertUserError } = await supabase
    .from("chat_messages")
    .insert({ business_id: id, role: "user", content: trimmed });
  if (insertUserError) return { error: insertUserError.message };

  const { data: summaryRow } = await supabase
    .from("chat_summary")
    .select("summary, summarized_through")
    .eq("business_id", id)
    .maybeSingle();

  const existingSummary = summaryRow?.summary ?? "";
  const summarizedThrough = summaryRow?.summarized_through ?? null;

  // Everything not yet folded into the summary — the current verbatim window.
  let unsummarizedQuery = supabase
    .from("chat_messages")
    .select("role, content, created_at")
    .eq("business_id", id)
    .order("created_at", { ascending: true });
  if (summarizedThrough) {
    unsummarizedQuery = unsummarizedQuery.gt("created_at", summarizedThrough);
  }
  const { data: unsummarizedData } = await unsummarizedQuery;
  const unsummarized = unsummarizedData ?? [];

  let recentMessages = unsummarized;
  let currentSummary = existingSummary;

  if (unsummarized.length > RECENT_WINDOW_MAX) {
    let splitIndex = unsummarized.length - RECENT_WINDOW_TARGET;
    // Anthropic's messages array must start with role "user" — nudge the
    // boundary forward if it would otherwise start the kept window on an
    // assistant message (messages alternate, so this shifts by at most one).
    while (splitIndex < unsummarized.length && unsummarized[splitIndex].role !== "user") {
      splitIndex += 1;
    }

    const oldestChunk = unsummarized.slice(0, splitIndex);
    recentMessages = unsummarized.slice(splitIndex);

    if (oldestChunk.length > 0) {
      const transcript = oldestChunk
        .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
        .join("\n");

      const summarySystem =
        "You maintain a running summary of an ongoing business-advisory chat conversation. " +
        "You'll be given the EXISTING summary (may be empty) and a NEW chunk of older messages " +
        "that need to be folded in. Produce a single, updated summary that preserves the " +
        "important facts, decisions, and context from both — integrate them into one coherent, " +
        "concise narrative rather than just appending the new chunk onto the old summary. " +
        "Output ONLY the updated summary text, no preamble.";
      const summaryUserMessage =
        `EXISTING SUMMARY:\n${existingSummary || "(none yet)"}\n\n` +
        `NEW MESSAGES TO FOLD IN:\n${transcript}`;

      const updatedSummary = await askClaude(client, summarySystem, summaryUserMessage, 1000);
      if (updatedSummary) {
        currentSummary = updatedSummary;
        const cursor = oldestChunk[oldestChunk.length - 1].created_at as string;
        await supabase.from("chat_summary").upsert({
          business_id: id,
          summary: currentSummary,
          summarized_through: cursor,
          updated_at: new Date().toISOString(),
        });
      }
    }
  }

  const [kbContext, financeSnapshot, trendHistory] = await Promise.all([
    getKbContext(supabase, id),
    getFinanceSnapshot(supabase, id),
    getTrendHistoryString(supabase, id),
  ]);

  const system =
    "You are IntelliCEO, a conversational business assistant for a small food & beverage " +
    "business. Answer using ONLY the real business data provided below — never invent numbers, " +
    "products, or facts not grounded in this context. If something isn't covered by the data, " +
    "say so plainly rather than guessing. Keep answers concise and practical.\n\n" +
    (currentSummary ? `SUMMARY OF EARLIER CONVERSATION:\n${currentSummary}\n\n` : "") +
    `BUSINESS CONTEXT:\n${kbContext}\n\n` +
    `FINANCE SNAPSHOT:\n${financeSnapshot}\n\n` +
    `RECENT CEO BRIEF HISTORY:\n${trendHistory}`;

  const conversationMessages: ChatMessage[] = recentMessages.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  const reply = await askClaudeConversation(client, system, conversationMessages, 1024);
  if (!reply) return { error: "No response — try again." };

  const { error: insertAssistantError } = await supabase
    .from("chat_messages")
    .insert({ business_id: id, role: "assistant", content: reply });
  if (insertAssistantError) return { error: insertAssistantError.message };

  return { reply };
}
