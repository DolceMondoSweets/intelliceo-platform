import { redirect } from "next/navigation";
import { getSessionState } from "@/lib/supabase/session";
import { getStripeClient } from "@/lib/stripe";
import { applySubscriptionUpdate } from "@/lib/subscription-sync";
import { createAdminClient } from "@/lib/supabase/admin";

// A synchronous fast path right after Stripe Checkout redirects back —
// webhook delivery isn't guaranteed to beat this redirect (confirmed live:
// a dropped stripe listen connection left a completed checkout stuck with
// subscription_status still null, bouncing the user back to the plan
// picker). This retrieves the same Checkout Session directly and applies
// the identical update the webhook would, so activation doesn't depend on
// webhook timing. The webhook remains the source of truth for everything
// after this — renewals, cancellations, portal-initiated plan changes.
export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; source?: string }>;
}) {
  const { user, businessId } = await getSessionState();
  if (!user) redirect("/login");
  if (!businessId) redirect("/onboarding");

  const { session_id: sessionId, source } = await searchParams;
  const destination = source === "onboarding" ? "/dashboard?welcome=1" : "/dashboard";
  if (!sessionId) redirect(destination);

  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["subscription"],
  });

  // Only apply this session's result to the business it actually belongs
  // to — session ids aren't secret, so this stops someone from replaying a
  // stranger's session_id against their own login.
  if (session.client_reference_id === businessId && session.subscription) {
    const subscription =
      typeof session.subscription === "string" ? null : session.subscription;
    if (subscription) {
      const admin = createAdminClient();
      await applySubscriptionUpdate(admin, businessId, subscription);
    }
  }

  redirect(destination);
}
