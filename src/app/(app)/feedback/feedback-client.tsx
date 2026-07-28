"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button, inputClass } from "@/components/ui";
import { submitFeedback } from "./actions";

export function FeedbackClient({ userEmail, page }: { userEmail: string; page?: string }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await submitFeedback({ message, page });
      if (result.error) {
        setError(result.error);
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 5000);
    });
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-200 p-8 text-center dark:border-zinc-800">
        <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Thank you for your feedback!
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          We read every submission and will get back to you within 24 hours. Taking you back to
          your dashboard…
        </p>
        <Button type="button" variant="secondary" onClick={() => router.push("/dashboard")}>
          Back to Dashboard now
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">Sending as {userEmail}</p>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          What&apos;s on your mind?
        </label>
        <textarea
          id="message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={inputClass}
          placeholder="Bug reports, feature ideas, anything that would make IntelliCEO more useful for your business..."
        />
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <Button type="submit" disabled={isPending} className="self-start">
        {isPending ? "Sending…" : "Send Feedback"}
      </Button>
    </form>
  );
}
