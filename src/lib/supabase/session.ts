import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export const getSessionState = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      businessId: null as string | null,
      isPlatformAdmin: false,
      subscriptionTier: null as string | null,
      subscriptionStatus: null as string | null,
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("business_id, is_platform_admin")
    .eq("id", user.id)
    .maybeSingle();

  const businessId = profile?.business_id ?? null;

  let subscriptionTier: string | null = null;
  let subscriptionStatus: string | null = null;
  if (businessId) {
    const { data: business } = await supabase
      .from("businesses")
      .select("subscription_tier, subscription_status")
      .eq("id", businessId)
      .maybeSingle();
    subscriptionTier = business?.subscription_tier ?? null;
    subscriptionStatus = business?.subscription_status ?? null;
  }

  return {
    user,
    businessId,
    isPlatformAdmin: profile?.is_platform_admin ?? false,
    subscriptionTier,
    subscriptionStatus,
  };
});
