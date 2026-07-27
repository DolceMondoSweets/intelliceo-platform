// Contact page copy + category → recipient routing. Delivery is via Resend
// (see src/lib/email.ts and src/app/(marketing)/contact/actions.ts) — not a
// mailto: link, so submissions actually arrive rather than depending on the
// visitor's own email client being configured.

export const contactHero = {
  eyebrow: "CONTACT",
  headline: "Get in touch.",
  copy: "Questions about the product, partnerships, press, or anything else — we read every message ourselves.",
};

export const responseTimeCommitment = "We respond within 48 hours.";

export const contactCategories = [
  { value: "beta_support", label: "Beta Support", recipient: "help@intelliceo.com" },
  { value: "general", label: "General Inquiries", recipient: "info@intelliceo.com" },
  { value: "partnerships", label: "Partnerships", recipient: "info@intelliceo.com" },
  { value: "media", label: "Media & Press", recipient: "info@intelliceo.com" },
  { value: "investor", label: "Investor Relations", recipient: "info@intelliceo.com" },
] as const;
