import "server-only";
import type Stripe from "stripe";
import { TIER_BY_PRICE_ID } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

// Applies a Stripe subscription's current state to its business row. Shared
// by the webhook handler (ongoing updates: renewals, cancellations, plan
// changes) and the /checkout/success page (a synchronous fast path right
// after checkout, since webhook delivery isn't guaranteed to beat the
// success_url redirect — confirmed live when a dropped `stripe listen`
// connection left a completed trial signup stuck on subscription_status
// null until the next webhook retry).
export async function applySubscriptionUpdate(
  admin: ReturnType<typeof createAdminClient>,
  businessId: string,
  subscription: Stripe.Subscription
) {
  const priceId = subscription.items.data[0]?.price.id;
  const tier = priceId ? TIER_BY_PRICE_ID[priceId] : undefined;

  await admin
    .from("businesses")
    .update({
      subscription_status: subscription.status,
      stripe_subscription_id: subscription.id,
      trial_ends_at: subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null,
      ...(tier ? { subscription_tier: tier } : {}),
    })
    .eq("id", businessId);
}

export async function findBusinessIdByCustomer(
  admin: ReturnType<typeof createAdminClient>,
  customerId: string
): Promise<string | null> {
  const { data } = await admin
    .from("businesses")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();
  return data?.id ?? null;
}
