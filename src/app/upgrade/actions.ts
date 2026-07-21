"use server";

import { redirect } from "next/navigation";
import { getSessionState } from "@/lib/supabase/session";
import {
  changeSubscriptionTier,
  openBillingPortal as openBillingPortalShared,
  sanitizeReturnTo,
  type BillingPortalResult,
} from "@/lib/subscription-change";

export type UpgradeResult = { error?: string };

// Upgrades an already-paying Starter subscriber to Growth by updating their
// EXISTING Stripe subscription in place (proration handled by Stripe) —
// not a new Checkout Session, since they already have a payment method on
// file. Redirects back to whatever Growth feature sent them here.
export async function upgradeToGrowth(returnTo?: string): Promise<UpgradeResult> {
  const { user, businessId } = await getSessionState();
  if (!user || !businessId) return { error: "Your session expired — please log in again." };

  const result = await changeSubscriptionTier(businessId, "growth");
  if (result.error) return result;

  redirect(sanitizeReturnTo(returnTo, "/dashboard"));
}

export async function openBillingPortal(): Promise<BillingPortalResult> {
  return openBillingPortalShared("/upgrade");
}
