"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { inputClass } from "@/components/ui";
import { askChat, getChatHistory, type StoredChatMessage } from "@/app/(app)/chat/actions";

// Persistent header bar, not a corner widget — always visible at the top of
// every (app) page. Typing + submitting expands it into the full
// conversation panel (real persistent history from chat_messages), rather
// than requiring a click just to reveal the feature exists.
export function AskBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasLoadedHistory, setHasLoadedHistory] = useState(false);
  const [messages, setMessages] = useState<StoredChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isLoadingHistory, startHistoryTransition] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isExpanded) return;
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [isExpanded, messages, isPending]);

  function handlePeek() {
    setIsExpanded((prev) => !prev);
    if (!hasLoadedHistory) {
      startHistoryTransition(async () => {
        const history = await getChatHistory();
        setMessages(history);
        setHasLoadedHistory(true);
      });
    }
  }

  function handleSubmit() {
    const text = input.trim();
    if (!text) return;

    setError(null);
    setInput("");
    setIsExpanded(true);

    startTransition(async () => {
      if (!hasLoadedHistory) {
        const history = await getChatHistory();
        setMessages(history);
        setHasLoadedHistory(true);
      }
      setMessages((prev) => [...prev, { role: "user", content: text, createdAt: new Date().toISOString() }]);

      const result = await askChat(text);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: result.reply!, createdAt: new Date().toISOString() },
        ]);
      }
    });
  }

  return (
    <div className="sticky top-0 z-30 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <div className="flex items-center gap-2 px-4 py-2.5">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Ask anything about your business…"
          className={`flex-1 !py-2 text-sm ${inputClass}`}
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending || !input.trim()}
          className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900"
        >
          Ask
        </button>
        <button
          type="button"
          onClick={handlePeek}
          aria-label={isExpanded ? "Collapse conversation" : "Show conversation history"}
          className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

      {isExpanded && (
        <div
          ref={scrollRef}
          className="flex max-h-[50vh] flex-col gap-3 overflow-y-auto border-t border-zinc-200 p-4 dark:border-zinc-800"
        >
          {isLoadingHistory && (
            <p className="text-sm text-zinc-400 dark:text-zinc-600">Loading conversation…</p>
          )}
          {!isLoadingHistory && messages.length === 0 && (
            <p className="text-sm text-zinc-400 dark:text-zinc-600">
              Ask about your finances, priorities, or anything else about your business — I can
              see your current data.
            </p>
          )}
          {messages.map((message, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                message.role === "user"
                  ? "self-end bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                  : "self-start bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50"
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          ))}
          {isPending && (
            <div className="self-start rounded-2xl bg-zinc-100 px-4 py-2 text-sm text-zinc-400 dark:bg-zinc-900 dark:text-zinc-600">
              …
            </div>
          )}
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
      )}
    </div>
  );
}
