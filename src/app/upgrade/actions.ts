"use server";

import { redirect } from "next/navigation";
import { getSessionState } from "@/lib/supabase/session";
import { getStripeClient } from "@/lib/stripe";
import { ensureStripeCustomer } from "@/lib/stripe-customer";
import { getBaseUrl } from "@/lib/url";

export type BillingPortalResult = { error?: string };

// Growth is a plan CHANGE for an already-paying customer, not a fresh
// signup — Stripe's Billing Portal handles proration and payment method
// updates for that correctly, so this hands off to it rather than building
// custom upgrade/downgrade logic.
export async function openBillingPortal(): Promise<BillingPortalResult> {
  const { user, businessId } = await getSessionState();
  if (!user || !businessId) return { error: "Your session expired — please log in again." };

  const { customerId, error: customerError } = await ensureStripeCustomer(businessId, user.email);
  if (customerError || !customerId) return { error: customerError ?? "Could not open billing." };

  const baseUrl = await getBaseUrl();
  const stripe = getStripeClient();

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${baseUrl}/upgrade`,
  });

  redirect(session.url);
}
