import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSessionState } from "@/lib/supabase/session";
import { isGrowthTier } from "@/lib/subscription";
import { SquareIntegrationClient } from "./square-integration-client";

export default async function SquareIntegrationPage() {
  const { businessId: id, subscriptionTier } = await getSessionState();
  const businessId = id as string; // guaranteed by (app)/layout.tsx
  if (!isGrowthTier(subscriptionTier)) redirect("/upgrade");
  const supabase = await createClient();

  const [{ data: creds }, { data: finance }] = await Promise.all([
    supabase
      .from("square_credentials")
      .select("access_token, location_id")
      .eq("business_id", businessId)
      .maybeSingle(),
    supabase.from("finance_data").select("revenue_mtd").eq("business_id", businessId).maybeSingle(),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 bg-zinc-50 px-6 py-10 dark:bg-black">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Square Integration
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Connect your own Square account to pull month-to-date revenue directly into your finance
          snapshot.
        </p>
      </div>

      <SquareIntegrationClient
        hasToken={!!creds?.access_token}
        locationId={creds?.location_id ?? ""}
        currentRevenueMtd={finance?.revenue_mtd ?? 0}
      />
    </div>
  );
}
