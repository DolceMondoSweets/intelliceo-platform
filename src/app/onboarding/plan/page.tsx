import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getSessionState } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { classifySubscription } from "@/lib/subscription";
import { PlanPicker } from "./plan-picker";
import type { SubscriptionTier } from "@/lib/stripe";

const GROWTH_POS_SYSTEMS = new Set(["square", "clover"]);
const VALID_TIERS = new Set<SubscriptionTier>(["starter", "growth"]);

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

  // Growth unlocks either from the self-reported POS answer at the end of
  // first-time onboarding (?pos=, not persisted anywhere — see
  // onboarding/actions.ts) or from an actual POS already connected via
  // /pos-integration for a business returning here later (e.g. after a
  // subscription reset via reactivate/upgrade/(app) layout, none of which
  // pass ?pos=). Relying on the query param alone meant an already-connected
  // business would incorrectly lose access to Growth the moment it landed
  // back on this page any other way.
  const { pos } = await searchParams;
  const supabase = await createClient();
  const { data: posCredentials } = await supabase
    .from("pos_credentials")
    .select("pos_type")
    .eq("business_id", businessId)
    .maybeSingle();
  const growthAvailable =
    GROWTH_POS_SYSTEMS.has(pos ?? "") ||
    GROWTH_POS_SYSTEMS.has(posCredentials?.pos_type ?? "");

  const intendedPlanCookie = (await cookies()).get("intended_plan")?.value;
  const initialTier =
    intendedPlanCookie && VALID_TIERS.has(intendedPlanCookie as SubscriptionTier)
      ? (intendedPlanCookie as SubscriptionTier)
      : undefined;

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
      <PlanPicker growthAvailable={growthAvailable} initialTier={initialTier} />
    </div>
  );
}
