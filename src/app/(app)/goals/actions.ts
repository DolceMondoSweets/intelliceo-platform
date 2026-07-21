"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSessionState } from "@/lib/supabase/session";

export type GoalFormState = { error?: string; success?: boolean };

export async function logGoal(
  _prevState: GoalFormState,
  formData: FormData
): Promise<GoalFormState> {
  const title = String(formData.get("title") ?? "").trim();
  const targetMetric = String(formData.get("targetMetric") ?? "").trim();
  const targetValueRaw = String(formData.get("targetValue") ?? "").trim();
  const targetDate = String(formData.get("targetDate") ?? "").trim();

  if (!title) return { error: "Enter what you're trying to achieve." };

  const targetValue = targetValueRaw ? Number(targetValueRaw) : null;
  if (targetValueRaw && !Number.isFinite(targetValue)) {
    return { error: "Target value must be a number." };
  }

  const { businessId } = await getSessionState();
  const supabase = await createClient();
  const { error } = await supabase.from("goals").insert({
    business_id: businessId,
    title,
    target_metric: targetMetric || null,
    target_value: targetValue,
    target_date: targetDate || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/goals");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function markGoalAchieved(goalId: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("goals").update({ status: "Achieved" }).eq("id", goalId);

  if (error) return { error: error.message };

  revalidatePath("/goals");
  revalidatePath("/dashboard");
  return {};
}
