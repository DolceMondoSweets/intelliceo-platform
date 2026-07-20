"use server";

import { createClient } from "@/lib/supabase/server";
import { getSessionState } from "@/lib/supabase/session";
import { getAnthropicClient, askClaudeConversation, type ChatMessage } from "@/lib/anthropic";
import { getKbContext, getFinanceSnapshot, getTrendHistoryString } from "@/lib/business-context";

export type AskChatResult = { reply?: string; error?: string };

// No page.tsx in this folder on purpose — Chat is a global floating panel
// (rendered in (app)/layout.tsx), not a route, so this file only hosts the
// Server Action.
export async function askChat(history: ChatMessage[], newMessage: string): Promise<AskChatResult> {
  const trimmed = newMessage.trim();
  if (!trimmed) return { error: "Type a message first." };

  const client = getAnthropicClient();
  if (!client) return { error: "ANTHROPIC_API_KEY isn't configured yet." };

  const { businessId } = await getSessionState();
  const id = businessId as string; // guaranteed by (app)/layout.tsx
  const supabase = await createClient();

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
    `BUSINESS CONTEXT:\n${kbContext}\n\n` +
    `FINANCE SNAPSHOT:\n${financeSnapshot}\n\n` +
    `RECENT MORNING BRIEF HISTORY:\n${trendHistory}`;

  const messages: ChatMessage[] = [...history, { role: "user", content: trimmed }];

  const reply = await askClaudeConversation(client, system, messages, 1024);
  if (!reply) return { error: "No response — try again." };

  return { reply };
}
