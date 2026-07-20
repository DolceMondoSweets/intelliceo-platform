import { redirect } from "next/navigation";
import { getSessionState } from "@/lib/supabase/session";
import { classifySubscription } from "@/lib/subscription";
import { ReactivateButton } from "./reactivate-button";

export default async function ReactivatePage() {
  const { user, businessId, subscriptionStatus } = await getSessionState();
  if (!user) redirect("/login");
  if (!businessId) redirect("/onboarding");

  const subscriptionState = classifySubscription(subscriptionStatus);
  if (subscriptionState === "never_started") redirect("/onboarding/plan");
  if (subscriptionState === "ok") redirect("/dashboard");

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 bg-zinc-50 px-6 py-10 dark:bg-black">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Your subscription is paused
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Your trial ended or your last payment didn&apos;t go through, so access is on hold.
          Nothing has been deleted — all of your data is exactly as you left it. Reactivate to
          pick up right where you left off.
        </p>
      </div>
      <ReactivateButton />
    </div>
  );
}
