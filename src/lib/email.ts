import "server-only";
import { Resend } from "resend";

// Same lazy-init pattern as src/lib/stripe.ts / src/lib/anthropic.ts.
let client: Resend | null = null;

export function getResendClient(): Resend {
  if (!client) {
    client = new Resend(process.env.RESEND_API_KEY!);
  }
  return client;
}

// Must be an address on a domain verified in the Resend dashboard (Domains
// → Add Domain → add the DNS records it gives you), or sends will fail —
// Resend does not deliver from unverified sending domains.
export const CONTACT_FROM_ADDRESS = "IntelliCEO Contact Form <contact@intelliceo.com>";

// In-app Feedback (logged-in businesses only) — same verified sending
// domain/pipeline as the marketing Contact form, distinct display name so
// it's identifiable in the help@ inbox at a glance.
export const FEEDBACK_FROM_ADDRESS = "IntelliCEO Feedback <contact@intelliceo.com>";
