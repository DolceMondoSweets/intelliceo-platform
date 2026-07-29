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

// Internal admin notifications (new business signups, etc.) — same verified
// sending domain, always routed to info@, never a customer-facing send.
const ADMIN_FROM_ADDRESS = "IntelliCEO Admin <contact@intelliceo.com>";
const ADMIN_NOTIFICATION_TO = "info@intelliceo.com";

// Fire-and-forget by design — a failed admin notification should never take
// down the actual subscription sync it's reporting on. Callers don't need
// to (and shouldn't) await error handling beyond this swallowing it.
export async function sendNewBusinessNotification(details: {
  businessName: string;
  email: string;
  plan: string;
}): Promise<void> {
  if (!process.env.RESEND_API_KEY) return;

  try {
    const resend = getResendClient();
    await resend.emails.send({
      from: ADMIN_FROM_ADDRESS,
      to: ADMIN_NOTIFICATION_TO,
      subject: `New business signed up: ${details.businessName}`,
      text:
        `A new business completed signup and checkout.\n\n` +
        `Business: ${details.businessName}\n` +
        `Email: ${details.email}\n` +
        `Plan: ${details.plan}\n` +
        `Time: ${new Date().toISOString()}`,
    });
  } catch (err) {
    const Sentry = await import("@sentry/nextjs");
    Sentry.captureException(err);
  }
}
