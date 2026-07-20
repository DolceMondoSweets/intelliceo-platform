import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export const getSessionState = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, businessId: null as string | null, isPlatformAdmin: false };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("business_id, is_platform_admin")
    .eq("id", user.id)
    .maybeSingle();

  return {
    user,
    businessId: profile?.business_id ?? null,
    isPlatformAdmin: profile?.is_platform_admin ?? false,
  };
});
