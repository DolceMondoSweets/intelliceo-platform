"use client";

import { useState, useTransition } from "react";
import { Button, inputClass } from "@/components/ui";
import { askChat } from "@/app/(app)/chat/actions";
import type { ChatMessage } from "@/lib/anthropic";

export function ChatPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Session-only memory: closing the panel resets the conversation.
  function handleClose() {
    setIsOpen(false);
    setMessages([]);
    setInput("");
    setError(null);
  }

  function handleSend() {
    const text = input.trim();
    if (!text) return;

    setError(null);
    setInput("");
    const history = messages;
    setMessages([...history, { role: "user", content: text }]);

    startTransition(async () => {
      const result = await askChat(history, text);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: result.reply! }]);
      }
    });
  }

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open chat"
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-white shadow-lg hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </button>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 sm:hidden"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-zinc-200 bg-white transition-transform duration-200 ease-in-out dark:border-zinc-800 dark:bg-black ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-800">
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Chat</span>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close chat"
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
          {messages.length === 0 && (
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

        <div className="flex gap-2 border-t border-zinc-200 p-4 dark:border-zinc-800">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask a question…"
            className={`flex-1 ${inputClass}`}
          />
          <Button type="button" onClick={handleSend} disabled={isPending || !input.trim()}>
            Send
          </Button>
        </div>
      </aside>
    </>
  );
}
