import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export const getSessionState = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, businessId: null as string | null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("business_id")
    .eq("id", user.id)
    .maybeSingle();

  return { user, businessId: profile?.business_id ?? null };
});
