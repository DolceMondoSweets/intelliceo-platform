import "server-only";
import { createClient } from "@/lib/supabase/server";
import { getStripeClient } from "@/lib/stripe";

// Shared by every flow that needs a Stripe customer attached to a business
// (initial Checkout, reactivation Checkout, the Billing Portal) — creates
// one only if the business doesn't already have one, and persists it via
// the set_stripe_customer_id() RPC (see intelliceo_schema.sql) rather than
// a direct update, since businesses has no tenant UPDATE policy.
export async function ensureStripeCustomer(
  businessId: string,
  email: string | undefined
): Promise<{ customerId?: string; error?: string }> {
  const supabase = await createClient();
  const { data: business } = await supabase
    .from("businesses")
    .select("stripe_customer_id")
    .eq("id", businessId)
    .maybeSingle();

  if (business?.stripe_customer_id) return { customerId: business.stripe_customer_id };

  const stripe = getStripeClient();
  const customer = await stripe.customers.create({
    email,
    metadata: { business_id: businessId },
  });

  const { error } = await supabase.rpc("set_stripe_customer_id", {
    p_customer_id: customer.id,
  });
  if (error) return { error: error.message };

  return { customerId: customer.id };
}
