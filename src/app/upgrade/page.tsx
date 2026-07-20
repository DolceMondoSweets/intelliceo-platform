import { redirect } from "next/navigation";
import { getSessionState } from "@/lib/supabase/session";
import { classifySubscription, isGrowthTier } from "@/lib/subscription";
import { UpgradeButton } from "./upgrade-button";

export default async function UpgradePage() {
  const { user, businessId, subscriptionStatus, subscriptionTier } = await getSessionState();
  if (!user) redirect("/login");
  if (!businessId) redirect("/onboarding");

  const subscriptionState = classifySubscription(subscriptionStatus);
  if (subscriptionState === "never_started") redirect("/onboarding/plan");
  if (subscriptionState === "inactive") redirect("/reactivate");
  if (isGrowthTier(subscriptionTier)) redirect("/dashboard");

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 bg-zinc-50 px-6 py-10 dark:bg-black">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          This is a Growth feature
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Content Studio and Square Integration are included on the Growth plan ($89/mo).
          Manage your billing to switch plans — the change is prorated automatically.
        </p>
      </div>
      <UpgradeButton />
    </div>
  );
}
