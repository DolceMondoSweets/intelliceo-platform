import { redirect } from "next/navigation";
import { getSessionState } from "@/lib/supabase/session";
import { classifySubscription } from "@/lib/subscription";
import { PlanPicker } from "./plan-picker";

const GROWTH_POS_SYSTEMS = new Set(["square", "clover"]);

export default async function PlanPage({
  searchParams,
}: {
  searchParams: Promise<{ pos?: string }>;
}) {
  const { user, businessId, subscriptionStatus } = await getSessionState();
  if (!user) redirect("/login");
  if (!businessId) redirect("/onboarding");

  const subscriptionState = classifySubscription(subscriptionStatus);
  if (subscriptionState === "ok") redirect("/dashboard");
  if (subscriptionState === "inactive") redirect("/reactivate");

  const { pos } = await searchParams;
  const growthAvailable = GROWTH_POS_SYSTEMS.has(pos ?? "");

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 bg-zinc-50 px-6 py-10 dark:bg-black">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Choose your plan
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          7-day free trial on either plan — your card won&apos;t be charged until day 8.
        </p>
      </div>
      <PlanPicker growthAvailable={growthAvailable} />
    </div>
  );
}
