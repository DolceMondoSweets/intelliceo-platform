"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/get-site-url";
import type { AuthState } from "../auth-form";

export async function signUp(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const siteUrl = await getSiteUrl();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${siteUrl}/auth/callback?next=/onboarding` },
  });

  if (error) return { error: error.message };
  if (!data.session) {
    return { message: "Check your email to confirm your account, then log in." };
  }

  redirect("/onboarding");
}
