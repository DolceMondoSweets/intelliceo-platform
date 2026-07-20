import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

const LOGO_SIGNED_URL_EXPIRES_IN = 3600;

export interface BusinessBrand {
  name: string;
  logoUrl: string | null;
}

// business-logos is a private bucket, so logo_url (a Storage object path,
// not a public URL) has to be turned into a fresh signed URL on every read.
// Shared by (app)/layout.tsx (for AppNav), dashboard/page.tsx, and
// settings/page.tsx so this signing logic only lives in one place.
export async function getBusinessBrand(
  supabase: SupabaseClient<Database>,
  businessId: string
): Promise<BusinessBrand> {
  const { data } = await supabase
    .from("businesses")
    .select("name, logo_url")
    .eq("id", businessId)
    .single();

  let logoUrl: string | null = null;
  if (data?.logo_url) {
    const { data: signed } = await supabase.storage
      .from("business-logos")
      .createSignedUrl(data.logo_url, LOGO_SIGNED_URL_EXPIRES_IN);
    logoUrl = signed?.signedUrl ?? null;
  }

  return { name: data?.name ?? "", logoUrl };
}
