import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSessionState } from "@/lib/supabase/session";
import { isGrowthTier } from "@/lib/subscription";
import { ContentStudioClient } from "./content-studio-client";

export default async function ContentStudioPage() {
  const { businessId: id, subscriptionTier } = await getSessionState();
  const businessId = id as string; // guaranteed by (app)/layout.tsx
  if (!isGrowthTier(subscriptionTier)) redirect("/upgrade?from=/content-studio");
  const supabase = await createClient();

  const { data: drafts } = await supabase
    .from("marketing_drafts")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 bg-zinc-50 px-6 py-10 dark:bg-black">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Content Studio</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Ready-to-use marketing copy, grounded in your actual products, channels, and priorities.
        </p>
      </div>

      <ContentStudioClient />

      {drafts && drafts.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Saved Drafts ({drafts.length})
          </h2>
          {drafts.map((d) => (
            <div key={d.id} className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                {d.created_at ? new Date(d.created_at).toLocaleDateString() : ""} — {d.content_type}
              </p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{d.topic}</p>
              <pre className="mt-2 whitespace-pre-wrap font-sans text-sm text-zinc-700 dark:text-zinc-300">
                {d.content}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
