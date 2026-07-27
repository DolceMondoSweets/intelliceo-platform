// Security page copy (Section 21-area trust page, linked from Product and
// Pricing). Every claim below was verified against the actual codebase
// before being written — RLS policies in intelliceo_schema.sql, Supabase
// Auth usage in src/lib/supabase/*, Stripe-only payment handling, the
// exact data sent to Anthropic (business-context.ts), and the real gaps
// (no MFA, no self-service export/deletion, POS access tokens are not
// field-encrypted at the application layer). No SOC 2/HIPAA/PCI/
// "bank-level"/"military-grade" language — none of that is true here, so
// none of it is claimed.
//
// Security contact and the "email us to delete/export data" commitment
// were explicit decisions confirmed with the user, not assumptions:
// security@intelliceo.com, and manual (not self-service) deletion on
// request.

export const securityHero = {
  eyebrow: "SECURITY",
  headline: "Security is a foundation, not an afterthought.",
  copy: "IntelliCEO is early-stage software built by a small team — and we take that seriously. Every business's data is isolated at the database level, sensitive work like payment processing is handled by specialists who do it better than we could build ourselves, and we're transparent about exactly what's in place today as we continue to harden the platform over time.",
};

export const dataEncryptionSection = {
  headline: "How your data is protected in transit and at rest.",
  copy: "All traffic between you and IntelliCEO — and between IntelliCEO and the infrastructure it runs on — is encrypted using TLS. Application data is stored in Supabase's managed Postgres infrastructure.",
  points: [
    {
      icon: "Lock",
      title: "Encrypted in transit",
      description: "Every connection to IntelliCEO uses TLS, the same standard used across the web for secure connections.",
    },
    {
      icon: "Database",
      title: "Encrypted at rest",
      description: "Application data is stored in Supabase's managed infrastructure, which encrypts data at rest at the platform level.",
    },
  ],
};

export const authSection = {
  headline: "Your account is protected by dedicated authentication infrastructure.",
  copy: "IntelliCEO uses Supabase Auth to handle sign-in, sessions, and password resets — your password is never processed, stored, or logged by IntelliCEO's own systems.",
  points: [
    {
      icon: "KeyRound",
      title: "Managed authentication",
      description: "Sign-in and password handling run through Supabase Auth, a dedicated authentication service, not custom code we wrote ourselves.",
    },
    {
      icon: "RefreshCw",
      title: "Secure sessions",
      description: "Your session is managed through secure cookies and refreshed automatically on every request.",
    },
    {
      icon: "Mail",
      title: "Email-verified password resets",
      description: "Resetting your password requires access to the email address on your account.",
    },
  ],
};

export const financialDataSection = {
  headline: "Your financial data is isolated — and never touches payment details.",
  copy: "Every business's financial data — revenue, cash, costs, and the numbers you enter or sync from your point-of-sale system — is isolated at the database level using row-level security, enforced on every request. No other account can ever query or see it.",
  points: [
    {
      icon: "ShieldCheck",
      title: "Row-level tenant isolation",
      description: "Every table enforces row-level security tied to your business — there's no shared query path that could return another account's data.",
    },
    {
      icon: "CreditCard",
      title: "Payments handled entirely by Stripe",
      description: "IntelliCEO never receives, processes, or stores your card details. All payment data is handled directly by Stripe.",
    },
    {
      icon: "Store",
      title: "POS sync is aggregate-only",
      description: "Square and Clover integrations pull month-to-date revenue totals only, never individual transaction or card-level data.",
    },
  ],
};

export const dataOwnershipSection = {
  headline: "Your business data belongs to you.",
  copy: "IntelliCEO doesn't yet have a self-service export or deletion tool built into the product. If you'd like a copy of your data, or want it deleted entirely, email security@intelliceo.com and we'll take care of it directly.",
};

export const aiDataUsageSection = {
  headline: "What IntelliCEO sends to its AI provider, and what it doesn't.",
  copy: "The CEO Brief, Chat, and Content Studio are powered by Anthropic's Claude. To ground its answers in your real business, IntelliCEO sends the information you've entered — your business overview and priorities, your finance snapshot, and recent conversation history. IntelliCEO never sends your payment details, login credentials, or point-of-sale access tokens to Anthropic or anyone else. Anthropic's own API terms state that data submitted through the API is not used to train their models.",
};

export const thirdPartyServicesSection = {
  headline: "The specialists IntelliCEO relies on.",
  copy: "Rather than building everything ourselves, IntelliCEO relies on established providers for the functions they specialize in.",
  services: [
    { name: "Supabase", description: "Authentication and database infrastructure, including all business data." },
    { name: "Stripe", description: "Billing and payment processing — the only place your card details are ever handled." },
    { name: "Anthropic", description: "Powers the CEO Brief, Chat, and Content Studio." },
    { name: "Square & Clover", description: "Point-of-sale revenue sync, only for businesses that connect one." },
    { name: "Sentry", description: "Error monitoring, to help us catch and fix problems quickly." },
  ],
};

export const dataRetentionSection = {
  headline: "What happens to your data when you cancel.",
  copy: "Canceling your subscription stops billing, but your account and data stay intact — you can pick up right where you left off if you reactivate. If you'd prefer your data be deleted entirely instead of retained, email security@intelliceo.com and we'll process the request.",
};

export const responsibleDisclosureSection = {
  headline: "Found a vulnerability? Tell us.",
  copy: "If you believe you've found a security vulnerability in IntelliCEO, please report it to security@intelliceo.com. We ask that you give us reasonable time to investigate and address the issue before any public disclosure, and we commit to responding to every report we receive.",
};

export const securityContactSection = {
  headline: "Questions about security?",
  copy: "For security questions, vulnerability reports, or data requests, reach us directly.",
  email: "security@intelliceo.com",
};
