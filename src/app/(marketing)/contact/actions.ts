"use server";

import { getResendClient, CONTACT_FROM_ADDRESS } from "@/lib/email";
import { contactCategories } from "@/content/contact";

export type ContactFormInput = {
  name: string;
  email: string;
  category: string;
  message: string;
  // Honeypot — real users never see this field (hidden via CSS + aria-hidden
  // in ContactForm), but bots that fill every input reliably populate it.
  company?: string;
};

export type ContactFormResult = { success?: boolean; error?: string };

export async function submitContactForm(input: ContactFormInput): Promise<ContactFormResult> {
  if (input.company) return { success: true };

  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();

  if (!name) return { error: "Enter your name." };
  if (!email || !email.includes("@")) return { error: "Enter a valid email address." };
  if (!message) return { error: "Enter a message." };

  const category = contactCategories.find((c) => c.value === input.category);
  if (!category) return { error: "Choose what this is about." };

  if (!process.env.RESEND_API_KEY) {
    return { error: "Message sending isn't configured yet — please email us directly instead." };
  }

  try {
    const resend = getResendClient();
    const { error } = await resend.emails.send({
      from: CONTACT_FROM_ADDRESS,
      to: category.recipient,
      replyTo: email,
      subject: `[${category.label}] New message from ${name}`,
      text: `Category: ${category.label}\nName: ${name}\nEmail: ${email}\n\n${message}`,
    });

    if (error) {
      return { error: "Something went wrong sending your message. Please try again." };
    }
    return { success: true };
  } catch {
    return { error: "Something went wrong sending your message. Please try again." };
  }
}
