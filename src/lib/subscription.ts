export type SubscriptionState = "never_started" | "inactive" | "ok";

// Mirrors Stripe's own subscription.status values verbatim (see
// intelliceo_schema.sql's comment on businesses.subscription_status) —
// this function just groups those raw statuses into what the app does
// about them.
export function classifySubscription(status: string | null): SubscriptionState {
  if (status === null || status === "incomplete" || status === "incomplete_expired") {
    return "never_started";
  }
  if (status === "canceled" || status === "unpaid") {
    return "inactive";
  }
  // "trialing" | "active" | "past_due" — past_due still gets access since
  // Stripe is actively retrying the payment at that point; access is only
  // cut once Stripe gives up (status becomes "unpaid") or the subscription
  // is canceled outright.
  return "ok";
}

export function isGrowthTier(tier: string | null): boolean {
  return tier === "growth";
}
