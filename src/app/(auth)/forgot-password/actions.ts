"use server";

import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/get-site-url";

export type ForgotPasswordState = { error?: string; message?: string };

export async function requestPasswordReset(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const email = String(formData.get("email") ?? "");
  if (!email) return { error: "Enter your email address." };

  const supabase = await createClient();
  const siteUrl = await getSiteUrl();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
  });

  if (error) return { error: error.message };

  return { message: "If an account exists for that email, we've sent a password reset link." };
}
