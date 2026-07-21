import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSessionState } from "@/lib/supabase/session";
import { isGrowthTier } from "@/lib/subscription";
import { PosIntegrationClient } from "./pos-integration-client";
import type { PosType } from "./actions";

export default async function PosIntegrationPage() {
  const { businessId: id, subscriptionTier } = await getSessionState();
  const businessId = id as string; // guaranteed by (app)/layout.tsx
  if (!isGrowthTier(subscriptionTier)) redirect("/upgrade?from=/pos-integration");
  const supabase = await createClient();

  const [{ data: creds }, { data: finance }] = await Promise.all([
    supabase
      .from("pos_credentials")
      .select("pos_type, access_token, location_id, merchant_id")
      .eq("business_id", businessId)
      .maybeSingle(),
    supabase.from("finance_data").select("revenue_mtd").eq("business_id", businessId).maybeSingle(),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 bg-zinc-50 px-6 py-10 dark:bg-black">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">POS Integration</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Connect Square or Clover to pull month-to-date revenue directly into your finance
          snapshot.
        </p>
      </div>

      <PosIntegrationClient
        currentPosType={(creds?.pos_type as PosType | undefined) ?? null}
        hasToken={!!creds?.access_token}
        locationId={creds?.location_id ?? ""}
        merchantId={creds?.merchant_id ?? ""}
        currentRevenueMtd={finance?.revenue_mtd ?? 0}
      />
    </div>
  );
}
