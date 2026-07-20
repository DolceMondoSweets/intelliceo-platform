import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripeClient } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { applySubscriptionUpdate, findBusinessIdByCustomer } from "@/lib/subscription-sync";

export async function POST(req: Request) {
  const stripe = getStripeClient();
  const signature = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature ?? "", process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 });
  }

  const admin = createAdminClient();

  // Idempotency: Stripe can and does redeliver events. Recording the event
  // id first means a redelivery hits the unique-violation path below and
  // returns immediately instead of re-running handler logic.
  const { error: insertError } = await admin
    .from("stripe_webhook_events")
    .insert({ id: event.id, type: event.type });

  if (insertError) {
    if (insertError.code === "23505") {
      return NextResponse.json({ received: true, duplicate: true });
    }
    return NextResponse.json({ error: "Failed to record webhook event" }, { status: 500 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (typeof session.subscription !== "string") break;

      const businessId =
        session.client_reference_id ??
        (typeof session.customer === "string"
          ? await findBusinessIdByCustomer(admin, session.customer)
          : null);
      if (!businessId) break;

      const subscription = await stripe.subscriptions.retrieve(session.subscription);
      await applySubscriptionUpdate(admin, businessId, subscription);
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const businessId =
        subscription.metadata?.business_id ??
        (typeof subscription.customer === "string"
          ? await findBusinessIdByCustomer(admin, subscription.customer)
          : null);
      if (!businessId) break;

      await applySubscriptionUpdate(admin, businessId, subscription);
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
