"use server";

import { redirect } from "next/navigation";
import { getSessionState } from "@/lib/supabase/session";
import { getStripeClient, PRICE_ID_BY_TIER, type SubscriptionTier } from "@/lib/stripe";
import { ensureStripeCustomer } from "@/lib/stripe-customer";
import { getBaseUrl } from "@/lib/url";

export type CreateCheckoutResult = { error?: string };

export async function createCheckoutSession(tier: SubscriptionTier): Promise<CreateCheckoutResult> {
  const { user, businessId } = await getSessionState();
  if (!user || !businessId) return { error: "Your session expired — please log in again." };

  const priceId = PRICE_ID_BY_TIER[tier];
  if (!priceId) return { error: "This plan isn't configured yet." };

  const { customerId, error: customerError } = await ensureStripeCustomer(businessId, user.email);
  if (customerError || !customerId) return { error: customerError ?? "Could not start checkout." };

  const baseUrl = await getBaseUrl();
  const stripe = getStripeClient();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    client_reference_id: businessId,
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      trial_period_days: 7,
      metadata: { business_id: businessId },
    },
    allow_promotion_codes: true,
    success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/onboarding/plan`,
  });

  if (!session.url) return { error: "Could not start checkout — please try again." };
  redirect(session.url);
}
