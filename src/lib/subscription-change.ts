import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripeClient, PRICE_ID_BY_TIER, type SubscriptionTier } from "@/lib/stripe";
import { applySubscriptionUpdate } from "@/lib/subscription-sync";
import { ensureStripeCustomer } from "@/lib/stripe-customer";
import { getBaseUrl } from "@/lib/url";
import { getSessionState } from "@/lib/supabase/session";

export type SubscriptionChangeResult = { error?: string };

// Only ever set by our own pages (e.g. ?from=/content-studio), but it's a
// query param a user could tamper with — restrict to a same-origin
// relative path so this can never become an open redirect.
export function sanitizeReturnTo(returnTo: string | undefined, fallback: string): string {
  if (!returnTo) return fallback;
  if (!returnTo.startsWith("/") || returnTo.startsWith("//") || returnTo.includes("://")) {
    return fallback;
  }
  return returnTo;
}

export interface LiveSubscriptionDetails {
  tier: SubscriptionTier | null;
  status: string | null;
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

async function getStripeSubscriptionId(businessId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("businesses")
    .select("stripe_subscription_id")
    .eq("id", businessId)
    .maybeSingle();
  return data?.stripe_subscription_id ?? null;
}

// Live details straight from Stripe (not our own DB mirror) for display in
// Settings — current_period_end lives on the subscription ITEM, not the
// subscription itself, in this API version (moved there ahead of Stripe's
// flexible billing-cycle support for multi-item subscriptions).
export async function getLiveSubscriptionDetails(
  businessId: string
): Promise<LiveSubscriptionDetails | null> {
  const subscriptionId = await getStripeSubscriptionId(businessId);
  if (!subscriptionId) return null;

  const stripe = getStripeClient();
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const item = subscription.items.data[0];
  const priceId = item?.price.id;
  const tier =
    (Object.entries(PRICE_ID_BY_TIER).find(([, id]) => id === priceId)?.[0] as
      | SubscriptionTier
      | undefined) ?? null;

  return {
    tier,
    status: subscription.status,
    trialEndsAt: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
    currentPeriodEnd: item ? new Date(item.current_period_end * 1000).toISOString() : null,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  };
}

// Changes an EXISTING paying subscription's plan directly via Stripe's
// subscription-update API — not a new Checkout Session — since the
// customer already has a payment method on file from their original
// signup. Upgrades collect the prorated difference immediately
// (always_invoice); downgrades just credit the difference toward the next
// invoice (create_prorations) rather than attempting to "charge" a
// negative amount.
export async function changeSubscriptionTier(
  businessId: string,
  newTier: SubscriptionTier
): Promise<SubscriptionChangeResult> {
  const subscriptionId = await getStripeSubscriptionId(businessId);
  if (!subscriptionId) return { error: "No active subscription found for this business." };

  const priceId = PRICE_ID_BY_TIER[newTier];
  if (!priceId) return { error: "This plan isn't configured yet." };

  const stripe = getStripeClient();

  try {
    const current = await stripe.subscriptions.retrieve(subscriptionId);
    const itemId = current.items.data[0]?.id;
    if (!itemId) return { error: "Could not find your subscription's billing item." };

    const updated = await stripe.subscriptions.update(subscriptionId, {
      items: [{ id: itemId, price: priceId }],
      proration_behavior: newTier === "growth" ? "always_invoice" : "create_prorations",
      payment_behavior: "error_if_incomplete",
    });

    const admin = createAdminClient();
    await applySubscriptionUpdate(admin, businessId, updated);

    return {};
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not change your plan.";
    return { error: message };
  }
}

export async function setCancelAtPeriodEnd(
  businessId: string,
  cancel: boolean
): Promise<SubscriptionChangeResult> {
  const subscriptionId = await getStripeSubscriptionId(businessId);
  if (!subscriptionId) return { error: "No active subscription found for this business." };

  const stripe = getStripeClient();

  try {
    const updated = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: cancel,
    });

    const admin = createAdminClient();
    await applySubscriptionUpdate(admin, businessId, updated);

    return {};
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not update cancellation.";
    return { error: message };
  }
}

export type BillingPortalResult = { error?: string };

// For things a direct in-app action shouldn't try to reinvent — updating
// the card on file, viewing past invoices — Stripe's own hosted portal
// handles it correctly. Not the primary path for upgrade/downgrade/cancel
// anymore; those happen in-app via changeSubscriptionTier /
// setCancelAtPeriodEnd above.
export async function openBillingPortal(returnTo?: string): Promise<BillingPortalResult> {
  const { user, businessId } = await getSessionState();
  if (!user || !businessId) return { error: "Your session expired — please log in again." };

  const { customerId, error: customerError } = await ensureStripeCustomer(businessId, user.email);
  if (customerError || !customerId) return { error: customerError ?? "Could not open billing." };

  const baseUrl = await getBaseUrl();
  const stripe = getStripeClient();

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${baseUrl}${sanitizeReturnTo(returnTo, "/settings")}`,
  });

  redirect(session.url);
}
