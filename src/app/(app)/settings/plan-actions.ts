"use server";

import { revalidatePath } from "next/cache";
import { getSessionState } from "@/lib/supabase/session";
import {
  changeSubscriptionTier,
  setCancelAtPeriodEnd,
  openBillingPortal as openBillingPortalShared,
  type BillingPortalResult,
} from "@/lib/subscription-change";
import type { SubscriptionTier } from "@/lib/stripe";

export type PlanActionResult = { error?: string };

async function requireBusinessId(): Promise<string | { error: string }> {
  const { businessId } = await getSessionState();
  if (!businessId) return { error: "Your session expired — please log in again." };
  return businessId;
}

export async function changePlan(tier: SubscriptionTier): Promise<PlanActionResult> {
  const businessId = await requireBusinessId();
  if (typeof businessId !== "string") return businessId;

  const result = await changeSubscriptionTier(businessId, tier);
  if (result.error) return result;

  revalidatePath("/settings");
  return {};
}

export async function cancelPlan(): Promise<PlanActionResult> {
  const businessId = await requireBusinessId();
  if (typeof businessId !== "string") return businessId;

  const result = await setCancelAtPeriodEnd(businessId, true);
  if (result.error) return result;

  revalidatePath("/settings");
  return {};
}

export async function undoCancelPlan(): Promise<PlanActionResult> {
  const businessId = await requireBusinessId();
  if (typeof businessId !== "string") return businessId;

  const result = await setCancelAtPeriodEnd(businessId, false);
  if (result.error) return result;

  revalidatePath("/settings");
  return {};
}

export async function openBillingPortal(): Promise<BillingPortalResult> {
  return openBillingPortalShared("/settings");
}
