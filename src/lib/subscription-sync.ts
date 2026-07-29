import "server-only";
import type Stripe from "stripe";
import { TIER_BY_PRICE_ID, TIER_DISPLAY, getStripeClient } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendNewBusinessNotification } from "@/lib/email";

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

  // A null -> non-null transition on stripe_subscription_id is precisely
  // "this business just genuinely finished signup + onboarding + checkout
  // for the first time" — every later call for the same business (renewals,
  // upgrades/downgrades, cancellations) already has a subscription id set,
  // so this naturally fires exactly once regardless of whether the webhook
  // or the /checkout/success fallback happens to win the race.
  const { data: before } = await admin
    .from("businesses")
    .select("name, stripe_subscription_id")
    .eq("id", businessId)
    .maybeSingle();
  const isNewSubscription = !before?.stripe_subscription_id && !!subscription.id;

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

  if (isNewSubscription && before) {
    const stripe = getStripeClient();
    const customer =
      typeof subscription.customer === "string"
        ? await stripe.customers.retrieve(subscription.customer)
        : subscription.customer;
    const email = customer && !customer.deleted ? customer.email : null;

    await sendNewBusinessNotification({
      businessName: before.name,
      email: email ?? "(unknown)",
      plan: tier ? TIER_DISPLAY[tier].name : "(unknown)",
    });
  }
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
