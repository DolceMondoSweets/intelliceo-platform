"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface OnboardingInput {
  businessName: string;
  overview: string;
  products: string;
  priorities: string;
  cash: string;
  burn: string;
  runway: string;
  revenueMtd: string;
}

type OnboardingResult = { error?: string };

function toNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toContent(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function completeOnboarding(input: OnboardingInput): Promise<OnboardingResult> {
  const businessName = input.businessName.trim();
  if (!businessName) return { error: "Business name is required." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Your session expired — please log in again." };

  // Bootstraps the business + profile link via a SECURITY DEFINER function —
  // see intelliceo_schema.sql for why (a confirmed Postgres/RLS anomaly on
  // this specific table, pending Supabase support). Everything after this
  // uses plain inserts through normal RLS, same as every other module.
  const { data: businessId, error: businessError } = await supabase.rpc(
    "create_business_and_profile",
    { business_name: businessName, business_industry: "food_and_beverage" }
  );

  if (businessError || !businessId) {
    return { error: businessError?.message ?? "Could not create your business." };
  }

  const { error: kbError } = await supabase.from("knowledge_base_entries").insert([
    { business_id: businessId, category: "business_overview", content: toContent(input.overview) },
    { business_id: businessId, category: "products", content: toContent(input.products) },
    { business_id: businessId, category: "priorities", content: toContent(input.priorities) },
  ]);

  if (kbError) return { error: kbError.message };

  const { error: financeError } = await supabase.from("finance_data").insert({
    business_id: businessId,
    cash: toNumber(input.cash),
    burn: toNumber(input.burn),
    runway: Math.round(toNumber(input.runway)),
    revenue_mtd: toNumber(input.revenueMtd),
  });

  if (financeError) return { error: financeError.message };

  await supabase.rpc("record_login");

  redirect("/dashboard");
}
