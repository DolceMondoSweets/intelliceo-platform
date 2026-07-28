import { redirect } from "next/navigation";
import { getSessionState } from "@/lib/supabase/session";
import { FeedbackClient } from "./feedback-client";

export default async function FeedbackPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { user, businessId } = await getSessionState();
  if (!user) redirect("/login");
  if (!businessId) redirect("/onboarding");

  const { from } = await searchParams;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 bg-zinc-50 px-6 py-10 dark:bg-black">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Feedback</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          We genuinely appreciate your feedback — our goal is to keep improving IntelliCEO based
          on real input from businesses like yours. We read every submission and respond within
          24 hours.
        </p>
      </div>

      <FeedbackClient userEmail={user.email ?? ""} page={from} />
    </div>
  );
}
