"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/get-site-url";
import type { AuthState } from "../auth-form";

const VALID_PLANS = new Set(["starter", "growth"]);

export async function signUp(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const plan = String(formData.get("plan") ?? "");

  const supabase = await createClient();
  const siteUrl = await getSiteUrl();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${siteUrl}/auth/callback?next=/onboarding` },
  });

  if (error) return { error: error.message };

  // Carries the plan picked on /pricing through onboarding to the plan
  // step, so a "Start with Growth" click doesn't dead-end on a generic
  // picker. Short-lived since it's only meant to survive one onboarding
  // pass, not persist as a lasting preference.
  if (VALID_PLANS.has(plan)) {
    (await cookies()).set("intended_plan", plan, {
      maxAge: 60 * 60,
      path: "/",
      sameSite: "lax",
    });
  }

  if (!data.session) {
    return { message: "Check your email to confirm your account, then log in." };
  }

  redirect("/onboarding");
}
