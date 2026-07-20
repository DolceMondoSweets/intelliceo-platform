import { createClient } from "@/lib/supabase/server";
import { getSessionState } from "@/lib/supabase/session";
import { getBusinessBrand } from "@/lib/business-brand";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const { businessId: id } = await getSessionState();
  const businessId = id as string; // guaranteed by (app)/layout.tsx
  const supabase = await createClient();

  const [brand, { data: kbEntries }, { data: finance }] = await Promise.all([
    getBusinessBrand(supabase, businessId),
    supabase.from("knowledge_base_entries").select("category, content").eq("business_id", businessId),
    supabase
      .from("finance_data")
      .select("cash, burn, runway, monthly_cogs, monthly_labor_cost")
      .eq("business_id", businessId)
      .maybeSingle(),
  ]);

  const kbByCategory = Object.fromEntries(
    (kbEntries ?? []).map((entry) => [entry.category, entry.content ?? ""])
  );

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 bg-zinc-50 px-6 py-10 dark:bg-black">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Settings</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Update your business info — the same details you filled in during onboarding.
        </p>
      </div>

      <SettingsClient
        businessName={brand.name}
        logoUrl={brand.logoUrl}
        overview={kbByCategory.business_overview ?? ""}
        products={kbByCategory.products ?? ""}
        priorities={kbByCategory.priorities ?? ""}
        cash={finance?.cash ?? 0}
        burn={finance?.burn ?? 0}
        runway={finance?.runway ?? 0}
        monthlyCogs={finance?.monthly_cogs ?? null}
        monthlyLaborCost={finance?.monthly_labor_cost ?? null}
      />
    </div>
  );
}
