import "server-only";
import Stripe from "stripe";

let client: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (!client) {
    client = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-06-24.dahlia",
    });
  }
  return client;
}

export type SubscriptionTier = "starter" | "growth";

// Maps a Stripe Price id back to our own tier name — the webhook and
// Checkout Session creation are the only two places this is read.
export const TIER_BY_PRICE_ID: Record<string, SubscriptionTier> = {
  ...(process.env.STRIPE_PRICE_STARTER
    ? { [process.env.STRIPE_PRICE_STARTER]: "starter" as const }
    : {}),
  ...(process.env.STRIPE_PRICE_GROWTH
    ? { [process.env.STRIPE_PRICE_GROWTH]: "growth" as const }
    : {}),
};

export const PRICE_ID_BY_TIER: Record<SubscriptionTier, string> = {
  starter: process.env.STRIPE_PRICE_STARTER ?? "",
  growth: process.env.STRIPE_PRICE_GROWTH ?? "",
};
