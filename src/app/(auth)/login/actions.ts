"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AuthState } from "../auth-form";

export async function logIn(_prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };

  await supabase.rpc("record_login");

  // Used to redirect to "/" and rely on that route's own auth-based
  // redirect — now that "/" is the public marketing homepage, land
  // directly on the app entry point instead. (app)/layout.tsx still
  // redirects on to /onboarding or /onboarding/plan if either isn't
  // complete yet, exactly as "/" used to.
  redirect("/dashboard");
}
