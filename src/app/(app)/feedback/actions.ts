"use server";

import { getResendClient, FEEDBACK_FROM_ADDRESS } from "@/lib/email";
import { getSessionState } from "@/lib/supabase/session";
import { createClient } from "@/lib/supabase/server";
import { getBusinessBrand } from "@/lib/business-brand";

export type FeedbackResult = { success?: boolean; error?: string };

export async function submitFeedback(input: {
  message: string;
  page?: string;
}): Promise<FeedbackResult> {
  const message = input.message.trim();
  if (!message) return { error: "Enter your feedback before sending." };

  const { user, businessId } = await getSessionState();
  if (!user || !businessId) return { error: "Your session expired — please log in again." };

  if (!process.env.RESEND_API_KEY) {
    return { error: "Feedback sending isn't configured yet — please email us directly instead." };
  }

  const supabase = await createClient();
  const brand = await getBusinessBrand(supabase, businessId);

  // ?from= only ever shows up in the sent email's body text, never rendered
  // as markup and never used as a redirect target — capped and restricted
  // to a same-origin-looking path purely to keep the context line tidy.
  const page =
    input.page && input.page.startsWith("/") ? input.page.slice(0, 200) : "(not captured)";

  try {
    const resend = getResendClient();
    const { error } = await resend.emails.send({
      from: FEEDBACK_FROM_ADDRESS,
      to: "help@intelliceo.com",
      replyTo: user.email,
      subject: `[Feedback] ${brand.name || "A business"}`,
      text: `Business: ${brand.name || "(unnamed)"}\nEmail: ${user.email}\nPage: ${page}\n\n${message}`,
    });

    if (error) {
      return { error: "Something went wrong sending your feedback. Please try again." };
    }
    return { success: true };
  } catch {
    return { error: "Something went wrong sending your feedback. Please try again." };
  }
}
