"use client";

import { useState, useTransition } from "react";
import { Button, inputClass } from "@/components/ui";
import { generateDraft, saveDraft } from "./actions";

const CONTENT_TYPES = [
  "Social Media Post",
  "Email Campaign",
  "SMS Message",
  "Product Description",
  "Promotional Announcement",
  "Blog / SEO Article",
];

const SOCIAL_PLATFORMS = ["Instagram", "Facebook", "TikTok", "X (Twitter)", "YouTube Community Post"];

export function ContentStudioClient() {
  const [contentType, setContentType] = useState(CONTENT_TYPES[0]);
  const [platform, setPlatform] = useState(SOCIAL_PLATFORMS[0]);
  const [topic, setTopic] = useState("");
  const [toneNotes, setToneNotes] = useState("");
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isSaving, startSaveTransition] = useTransition();

  const showPlatform = contentType === "Social Media Post";

  function handleGenerate() {
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await generateDraft({
        contentType,
        platform: showPlatform ? platform : null,
        topic,
        toneNotes,
      });
      if (result.error) setError(result.error);
      else setDraft(result.content ?? null);
    });
  }

  function handleSave() {
    if (!draft) return;
    startSaveTransition(async () => {
      const result = await saveDraft({ contentType, topic, content: draft });
      if (result.error) setError(result.error);
      else setSaved(true);
    });
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          What are you creating?
        </label>
        <select
          value={contentType}
          onChange={(e) => setContentType(e.target.value)}
          className={inputClass}
        >
          {CONTENT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {showPlatform && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Platform</label>
          <select value={platform} onChange={(e) => setPlatform(e.target.value)} className={inputClass}>
            {SOCIAL_PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          What's this about?
        </label>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          rows={3}
          placeholder="e.g. Promote our new seasonal latte to weekday regulars"
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Brand voice / tone notes (optional)
        </label>
        <input
          value={toneNotes}
          onChange={(e) => setToneNotes(e.target.value)}
          placeholder="e.g. warm and personal, under 100 words"
          className={inputClass}
        />
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <Button type="button" onClick={handleGenerate} disabled={isPending} className="self-start">
        {isPending ? "Drafting…" : "Generate Draft"}
      </Button>

      {draft && (
        <div className="flex flex-col gap-3 rounded-xl bg-zinc-100 p-4 dark:bg-zinc-900">
          <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Draft</h2>
          <pre className="whitespace-pre-wrap font-sans text-sm text-zinc-900 dark:text-zinc-50">
            {draft}
          </pre>
          <Button
            type="button"
            variant="secondary"
            onClick={handleSave}
            disabled={isSaving}
            className="self-start"
          >
            {isSaving ? "Saving…" : saved ? "Saved ✓" : "Save This Draft"}
          </Button>
        </div>
      )}
    </div>
  );
}
