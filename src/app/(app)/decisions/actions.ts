"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSessionState } from "@/lib/supabase/session";

export type DecisionFormState = { error?: string; success?: boolean };

export async function logDecision(
  _prevState: DecisionFormState,
  formData: FormData
): Promise<DecisionFormState> {
  const decision = String(formData.get("decision") ?? "").trim();
  const why = String(formData.get("why") ?? "").trim();
  const who = String(formData.get("who") ?? "").trim() || "Founder";
  const expectedOutcome = String(formData.get("expectedOutcome") ?? "").trim();

  if (!decision) return { error: "Enter what was decided." };

  const { businessId } = await getSessionState();
  const supabase = await createClient();
  const { error } = await supabase.from("decisions").insert({
    business_id: businessId,
    decision,
    why: why || null,
    who,
    expected_outcome: expectedOutcome || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/decisions");
  return { success: true };
}

export async function closeDecision(
  decisionId: string,
  actualOutcome: string
): Promise<{ error?: string }> {
  const trimmed = actualOutcome.trim();
  if (!trimmed) return { error: "Enter what actually happened." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("decisions")
    .update({ actual_outcome: trimmed, status: "Closed" })
    .eq("id", decisionId);

  if (error) return { error: error.message };

  revalidatePath("/decisions");
  return {};
}
