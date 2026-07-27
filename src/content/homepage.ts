// Homepage copy, centralized per Section 28 (Content Architecture).
//
// IMPORTANT PROVENANCE NOTE: the master brief and its correction document
// both defer to "the other document" for Sections 3, 4, 5, 10 (row
// structure only), 11, 12, 13, 14 — neither file actually contains the
// original word-for-word copy for those sections, only a structural
// description (e.g. "five question cards", "four capability cards:
// Financial Visibility, AI Business Advisor, Operational Discipline,
// Business Memory"). Everything below marked DRAFTED was written to fit
// that stated structure and the established brand voice, grounded only in
// verified-accurate product facts — it is NOT brief-verbatim and should be
// reviewed. Everything marked BRIEF COPY is reproduced exactly as written
// in the correction document.

import { currentPromotion } from "./promotion";

// ── Section 3: The Problem — DRAFTED (structure only: "five question
// cards, asymmetrical grid") ──────────────────────────────────────────────
export const problemSection = {
  headline: "Most owners are flying without instruments.",
  intro:
    "Running a food & beverage business means constant decisions — often without the numbers to back them up.",
  questions: [
    "Do you know your food cost percentage right now — not last month's, right now?",
    "How many decisions this week were based on real numbers instead of instinct?",
    "If revenue dropped 20% next month, would you see it coming — or find out too late?",
    "Who's checking your margins while you're running the floor?",
    "When did someone last give you a straight, current answer instead of a stack of last month's reports?",
  ],
};

// ── Section 4: Meet IntelliCEO — DRAFTED (card titles are brief-verbatim;
// descriptions are drafted to match) ──────────────────────────────────────
export const capabilityCards = [
  {
    title: "Financial Visibility",
    description:
      "See your cash position, runway, food cost, prime cost, and budget performance in one place — no spreadsheets required.",
    icon: "ChartNoAxesCombined",
  },
  {
    title: "AI Business Advisor",
    description:
      "Ask questions in plain language and get answers grounded in your real, current numbers — remembered across every conversation.",
    icon: "Lightbulb",
  },
  {
    title: "Operational Discipline",
    description:
      "Log decisions, set goals, and keep a clear record of what you decided and why — so nothing falls through the cracks.",
    icon: "ClipboardCheck",
  },
  {
    title: "Business Memory",
    description:
      "IntelliCEO remembers your business — priorities, past decisions, and the conversations that shaped them — so you never start from zero.",
    icon: "Database",
  },
] as const;

// ── Homepage polish pass (new): Competitive Difference — DRAFTED, added
// after Meet IntelliCEO per explicit instruction. Grounded only in real,
// already-stated product facts (Business Memory, Chat's grounded answers) —
// no new capabilities implied. ─────────────────────────────────────────────
export const competitiveDifferenceSection = {
  headline: "Not another AI chatbot bolted onto your business.",
  copy: "Generic AI tools start from zero every time you open them. IntelliCEO is different — it's built around your specific business, holds onto the context of every conversation and decision you've made, and reasons over your real financial data instead of guessing.",
  points: [
    "Understands your business — your numbers, your industry benchmarks, your specific situation.",
    "Remembers past conversations and decisions, so you never have to re-explain yourself.",
    "Works with your real financial data, not hypothetical scenarios or generic advice.",
  ],
};

// ── Section 5: How It Works — DRAFTED (structure only: "five-step
// progression") ────────────────────────────────────────────────────────────
export const howItWorksSteps = [
  {
    step: "01",
    title: "Tell IntelliCEO about your business",
    description:
      "A few minutes during setup: the basics, your starting numbers, and what matters most right now.",
  },
  {
    step: "02",
    title: "Connect your point of sale — or don't",
    description:
      "Link Square or Clover for automatic revenue, or enter numbers yourself. Either way, you're in control.",
  },
  {
    step: "03",
    title: "Get your CEO Brief",
    description:
      "Generate a clear, current picture of where things stand — cash, revenue, margins, and what needs attention.",
  },
  {
    step: "04",
    title: "Ask questions, log decisions",
    description:
      "Use the Ask bar for grounded answers, and keep a running record of decisions and goals as you make them.",
  },
  {
    step: "05",
    title: "Run smarter every week",
    description:
      "Check in on your own schedule, track trends over time, and stay ahead of margin pressure before it compounds.",
  },
] as const;

// ── Section 10/16.11: Differentiation — row structure DRAFTED, the
// "Remembers your business..." row is BRIEF COPY (verbatim reworded row) ──
export const differentiationRows = [
  {
    label: "Understands your real, current numbers",
    intelliceo: true,
    spreadsheets: false,
    genericSoftware: "partial",
  },
  {
    label: "Answers questions in plain language",
    intelliceo: true,
    spreadsheets: false,
    genericSoftware: false,
  },
  {
    label: "Remembers your business and past conversations",
    intelliceo: true,
    spreadsheets: false,
    genericSoftware: false,
  },
  {
    label: "Built around food & beverage benchmarks",
    intelliceo: true,
    spreadsheets: false,
    genericSoftware: false,
  },
  {
    label: "No accounting background required",
    intelliceo: true,
    spreadsheets: false,
    genericSoftware: "partial",
  },
] as const;

export const differentiationColumns = ["IntelliCEO", "Spreadsheets", "Generic Accounting Software"];

// ── Section 12/16.13: Limited Early Access — DRAFTED, grounded in the
// real pricing/promotion facts noted in the correction doc (7-day trial +
// current promotion, sourced from src/content/promotion.ts so it can be
// swapped sitewide in one place) ────────────────────────────────────────────
export const earlyAccessSection = {
  eyebrow: "LIMITED EARLY ACCESS",
  headline: "A curated beta, not a free tier.",
  copy: `IntelliCEO is in a limited, paid early access period for independent food & beverage businesses. Every account gets a 7-day trial and ${currentPromotion.shortLabel} — early access, not a giveaway, because we're building this with a small group of real owners first.`,
  points: [
    "7-day trial before you're charged",
    currentPromotion.bullet,
    "Direct input into what gets built next",
  ],
};

// ── Section 11/16.12: Security — DRAFTED, deliberately avoids unverified
// compliance claims (no SOC 2 / HIPAA / PCI language). The admin-access line
// was corrected to match what's actually enforced in code — there's no
// audit log or support-ticket gate on admin access, so "only to provide
// support you ask for" overclaimed a control that doesn't exist. ─────────
export const securitySection = {
  eyebrow: "SECURITY",
  headline: "Your business data stays yours.",
  copy: "Every business's data is fully isolated at the database level — no other account can ever see it. A small number of authorized team members can access aggregate account information for support and platform operations. Payment details are handled entirely by Stripe; IntelliCEO never stores your card information.",
  points: [
    { title: "Tenant isolation", description: "Row-level security enforced on every table, for every request." },
    { title: "Encrypted in transit", description: "All traffic between you and IntelliCEO is encrypted." },
    { title: "Payments via Stripe", description: "Card details are never stored on IntelliCEO's servers." },
  ],
};

// ── Section 13/16.14: FAQ — DRAFTED, answers grounded in verified real
// product/business facts (pricing, trial, POS integrations, security) ─────
export const faqItems = [
  {
    question: "What does the free trial include?",
    answer:
      "Every plan starts with a 7-day trial with full access to your chosen plan's features. Your card is required upfront, but you won't be charged until the trial ends.",
  },
  {
    question: "Which point-of-sale systems does IntelliCEO support?",
    answer:
      "Square and Clover today, with more platforms planned. If you use something else, you can still enter your numbers manually — every other feature works the same way.",
  },
  {
    question: "Is the CEO Brief updated automatically?",
    answer:
      "The CEO Brief is generated when you ask for it, reviewing your current numbers each time — it's not a constant background monitor, so you're always in control of when it runs.",
  },
  {
    question: "Do I need an accounting background to use this?",
    answer:
      "No. IntelliCEO is built to translate your numbers into plain language, with industry benchmarks for context, so you don't need a finance background to understand where you stand.",
  },
  {
    question: "What happens to my data if I cancel?",
    answer:
      "Nothing is deleted. Your account and data stay intact — you can pick up right where you left off if you reactivate.",
  },
  {
    question: "Is my business data shared with other customers?",
    answer:
      "No. Every business's data is isolated at the database level and enforced on every request — no other account can ever see it.",
  },
] as const;

// ── Section 14/16.15: Final CTA — DRAFTED ──────────────────────────────────
export const finalCtaSection = {
  headline: "Run your business like the CEO it deserves.",
  copy: "Limited early access is open now for independent food & beverage businesses.",
  primaryCta: "Join the Beta",
  secondaryCta: "Explore the Product",
};
