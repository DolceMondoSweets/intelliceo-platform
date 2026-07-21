import { createClient } from "@/lib/supabase/server";
import { getSessionState } from "@/lib/supabase/session";
import { getBusinessBrand } from "@/lib/business-brand";
import { getLiveSubscriptionDetails } from "@/lib/subscription-change";
import { TIER_DISPLAY, type SubscriptionTier } from "@/lib/stripe";
import { SettingsClient } from "./settings-client";
import { PlanCard } from "./plan-card";

export default async function SettingsPage() {
  const { businessId: id, isPlatformAdmin, subscriptionTier } = await getSessionState();
  const businessId = id as string; // guaranteed by (app)/layout.tsx
  const supabase = await createClient();

  const [brand, { data: kbEntries }, { data: finance }, planDetails] = await Promise.all([
    getBusinessBrand(supabase, businessId),
    supabase.from("knowledge_base_entries").select("category, content").eq("business_id", businessId),
    supabase
      .from("finance_data")
      .select(
        "cash, burn, monthly_cogs, monthly_labor_cost, budgeted_revenue, budgeted_cogs, budgeted_labor"
      )
      .eq("business_id", businessId)
      .maybeSingle(),
    getLiveSubscriptionDetails(businessId),
  ]);

  const kbByCategory = Object.fromEntries(
    (kbEntries ?? []).map((entry) => [entry.category, entry.content ?? ""])
  );

  // subscription_tier from the session is the source of truth for which
  // plan the business is on; planDetails (a live Stripe fetch) only adds
  // status/renewal/cancellation extras that aren't mirrored in our own DB.
  const planTier: SubscriptionTier = subscriptionTier === "growth" ? "growth" : "starter";
  const otherTier: SubscriptionTier = planTier === "growth" ? "starter" : "growth";

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 bg-zinc-50 px-6 py-10 dark:bg-black">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Settings</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Update your business info — the same details you filled in during onboarding.
        </p>
      </div>

      <PlanCard
        tierName={TIER_DISPLAY[planTier].name}
        tierPrice={TIER_DISPLAY[planTier].price}
        otherTierName={TIER_DISPLAY[otherTier].name}
        status={planDetails?.status ?? null}
        trialEndsAt={planDetails?.trialEndsAt ?? null}
        currentPeriodEnd={planDetails?.currentPeriodEnd ?? null}
        cancelAtPeriodEnd={planDetails?.cancelAtPeriodEnd ?? false}
      />

      <SettingsClient
        businessName={brand.name}
        logoUrl={brand.logoUrl}
        overview={kbByCategory.business_overview ?? ""}
        products={kbByCategory.products ?? ""}
        priorities={kbByCategory.priorities ?? ""}
        cash={finance?.cash ?? 0}
        burn={finance?.burn ?? 0}
        monthlyCogs={finance?.monthly_cogs ?? null}
        monthlyLaborCost={finance?.monthly_labor_cost ?? null}
        budgetedRevenue={finance?.budgeted_revenue ?? null}
        budgetedCogs={finance?.budgeted_cogs ?? null}
        budgetedLabor={finance?.budgeted_labor ?? null}
        isPlatformAdmin={isPlatformAdmin}
      />
    </div>
  );
}
