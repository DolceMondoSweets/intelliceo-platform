"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSessionState } from "@/lib/supabase/session";
import type { Database } from "@/lib/supabase/database.types";

type FinanceDataInsert = Database["public"]["Tables"]["finance_data"]["Insert"];

export type SettingsResult = { error?: string; success?: boolean };

export async function updateBusinessName(name: string): Promise<SettingsResult> {
  const trimmed = name.trim();
  if (!trimmed) return { error: "Business name is required." };

  const supabase = await createClient();

  // businesses has no tenant UPDATE policy (writes go through narrow
  // SECURITY DEFINER RPCs instead, same pattern as billing fields) — a
  // plain .update() here would silently affect 0 rows.
  const { error } = await supabase.rpc("set_business_name", { p_name: trimmed });

  if (error) return { error: error.message };

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { success: true };
}

const MAX_LOGO_BYTES = 2 * 1024 * 1024;
const ALLOWED_LOGO_TYPES = ["image/png", "image/jpeg", "image/webp"];

export async function uploadBusinessLogo(formData: FormData): Promise<SettingsResult> {
  const file = formData.get("logo");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose an image file first." };
  if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
    return { error: "Logo must be a PNG, JPEG, or WebP image." };
  }
  if (file.size > MAX_LOGO_BYTES) return { error: "Logo must be smaller than 2MB." };

  const { businessId } = await getSessionState();
  const id = businessId as string;
  const supabase = await createClient();

  const path = `${id}/logo`;
  const { error: uploadError } = await supabase.storage
    .from("business-logos")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (uploadError) return { error: uploadError.message };

  const { error: rpcError } = await supabase.rpc("set_business_logo_url", { p_logo_url: path });
  if (rpcError) return { error: rpcError.message };

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export type KnowledgeBaseInput = {
  overview: string;
  products: string;
  priorities: string;
};

export async function updateKnowledgeBase(input: KnowledgeBaseInput): Promise<SettingsResult> {
  const { businessId } = await getSessionState();
  const id = businessId as string;
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("knowledge_base_entries")
    .select("id, category")
    .eq("business_id", id);

  const existingIdByCategory = new Map((existing ?? []).map((e) => [e.category, e.id]));

  const entries: Array<{ category: string; content: string | null }> = [
    { category: "business_overview", content: input.overview.trim() || null },
    { category: "products", content: input.products.trim() || null },
    { category: "priorities", content: input.priorities.trim() || null },
  ];

  for (const entry of entries) {
    const existingId = existingIdByCategory.get(entry.category);

    if (existingId) {
      const { error } = await supabase
        .from("knowledge_base_entries")
        .update({ content: entry.content, updated_at: new Date().toISOString() })
        .eq("id", existingId);
      if (error) return { error: error.message };
    } else {
      const { error } = await supabase
        .from("knowledge_base_entries")
        .insert({ business_id: id, category: entry.category, content: entry.content });
      if (error) return { error: error.message };
    }
  }

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  revalidatePath("/morning-brief");
  revalidatePath("/vital-signs");
  revalidatePath("/content-studio");
  return { success: true };
}

export type FinanceSnapshotInput = {
  cash: string;
  burn: string;
  monthlyCogs: string;
  monthlyLaborCost: string;
};

function toNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toNullableNumber(value: string): number | null {
  const trimmed = value.trim();
  return trimmed ? toNumber(trimmed) : null;
}

export async function updateFinanceSnapshot(input: FinanceSnapshotInput): Promise<SettingsResult> {
  const { businessId } = await getSessionState();
  const id = businessId as string;
  const supabase = await createClient();

  const monthlyCogs = toNullableNumber(input.monthlyCogs);
  const monthlyLaborCost = toNullableNumber(input.monthlyLaborCost);

  // Only stamp cogs_updated_at when there's actually something to track —
  // otherwise the staleness reminder would think costs were "just confirmed"
  // even though nothing was ever entered.
  const hasCogsData = monthlyCogs !== null || monthlyLaborCost !== null;

  const payload: FinanceDataInsert = {
    business_id: id,
    cash: toNumber(input.cash),
    burn: toNumber(input.burn),
    monthly_cogs: monthlyCogs,
    monthly_labor_cost: monthlyLaborCost,
    updated_at: new Date().toISOString(),
    ...(hasCogsData ? { cogs_updated_at: new Date().toISOString() } : {}),
  };

  const { error } = await supabase.from("finance_data").upsert(payload);

  if (error) return { error: error.message };

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  revalidatePath("/morning-brief");
  return { success: true };
}
