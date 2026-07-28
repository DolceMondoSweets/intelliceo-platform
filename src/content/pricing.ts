// Pricing page copy (Section 20 of the master brief). Every number here is
// verified against the real billing implementation, not invented:
// - Prices: src/lib/stripe.ts TIER_DISPLAY ($59/mo Starter, $89/mo Growth)
// - Trial: src/app/onboarding/plan/actions.ts (trial_period_days: 7) and
//   the exact UI copy at src/app/onboarding/plan/page.tsx ("your card
//   won't be charged until day 8")
// - Growth/POS gating: src/app/onboarding/plan/page.tsx
//   (GROWTH_POS_SYSTEMS = Set(["square", "clover"]))
// - Feature gating: isGrowthTier (src/lib/subscription.ts) is only checked
//   in content-studio/ and pos-integration/ — every other Starter feature
//   listed below is confirmed ungated.
// The current promotion is sourced from src/content/promotion.ts so it can
// be swapped sitewide without touching this file or any component.

import { currentPromotion } from "./promotion";

export const pricingHero = {
  eyebrow: "PRICING",
  headline: "Simple, transparent pricing for independent owners.",
  copy: "Two plans, no hidden fees, and a 7-day free trial to see it work with your own numbers before you're charged.",
};

export const earlyAccessFraming = {
  eyebrow: "LIMITED EARLY ACCESS",
  headline: "A curated beta, not a free tier.",
  copy: `IntelliCEO is in a limited, paid early access period for independent food & beverage businesses. Every account gets a 7-day trial and ${currentPromotion.shortLabel} — early access, not a giveaway, because we're building this with a small group of real owners first.`,
  points: [
    "7-day trial before you're charged",
    currentPromotion.bullet,
    "Direct input into what gets built next",
  ],
};

export const trialNote = "7-day free trial on either plan — your card won't be charged until day 8.";

export const plans = [
  {
    tier: "starter" as const,
    name: "Starter",
    price: "$59",
    cadence: "/mo",
    description: "Full financial visibility and an AI business advisor for your business.",
    featuresIntro: "What's included:",
    features: [
      "Dashboard",
      "CEO Brief",
      "Vital Signs",
      "Decisions Log",
      "Chat",
      "Food cost % / prime cost tracking",
      "Budget vs. actual",
      "Break-even calculator",
      "Goals tracker",
      "What-if calculator",
    ],
    availabilityNote: null as string | null,
    ctaLabel: "Start with Starter",
  },
  {
    tier: "growth" as const,
    name: "Growth",
    price: "$89",
    cadence: "/mo",
    description: "Everything in Starter, plus marketing content and automatic POS sync.",
    featuresIntro: "Everything in Starter, plus:",
    features: ["Content Studio", "POS Integration (Square or Clover)"],
    availabilityNote: "Growth is available to businesses using Square or Clover.",
    ctaLabel: "Start with Growth",
  },
] as const;

export const whatsIncludedSection = {
  headline: "Every plan includes.",
  items: [
    {
      title: "Full onboarding",
      description:
        "Tell IntelliCEO about your business once, and every feature is grounded in your real numbers from day one.",
    },
    {
      title: "Tenant data isolation",
      description:
        "Your business data is isolated at the database level — no other account can ever see it.",
    },
    {
      title: "Cancel anytime",
      description: "No long-term contract and no cancellation fee, on either plan.",
    },
    {
      title: "Every future update",
      description: "New features ship to your existing plan at no extra cost.",
    },
  ],
};

export const futureExpectationsSection = {
  headline: "What to expect as pricing evolves.",
  copy: "Early-access pricing reflects where IntelliCEO is today — a small, growing product built directly with early customers. As new capabilities are added, pricing may evolve, but you'll always know exactly what you're paying before you're ever charged, and current promotions apply for the period they're offered.",
};

export const pricingFaqItems = [
  {
    question: "How much does IntelliCEO cost?",
    answer: `Starter is $59/month and Growth is $89/month. Both plans include a 7-day free trial, and early access members currently get ${currentPromotion.shortLabel}.`,
  },
  {
    question: "What's included in each plan?",
    answer:
      "Starter includes the Dashboard, CEO Brief, Vital Signs, Decisions Log, Chat, food cost and prime cost tracking, budget vs. actual, a break-even calculator, a goals tracker, and a what-if calculator. Growth includes everything in Starter, plus Content Studio and POS Integration.",
  },
  {
    question: "Is there a free trial?",
    answer: trialNote,
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes, anytime. There's no long-term contract or cancellation fee on either plan.",
  },
  {
    question: "Will early-access pricing change?",
    answer:
      "Early-access pricing and promotions may change as IntelliCEO grows, but you'll always know exactly what you're paying before you're charged — and the price you signed up at doesn't change retroactively.",
  },
  {
    question: "Which POS systems are required for Growth?",
    answer:
      "Growth is available to businesses using Square or Clover, since Content Studio and POS Integration are built around those systems today. If you use a different POS or none at all, Starter gives you full financial visibility and the AI Business Advisor.",
  },
  {
    question: "Is onboarding included?",
    answer:
      "Yes. Setup takes a few minutes — tell IntelliCEO about your business, connect your POS if you use one, and every feature is ready to go.",
  },
  {
    question: "What happens after the trial?",
    answer:
      "If you don't cancel during the trial, your card is charged for your first month — with the early-access discount applied if it's active — and your subscription continues month to month.",
  },
] as const;

export const betaCtaSection = {
  headline: "See it in action for your own business.",
  copy: "Limited early access is open now for independent food & beverage businesses.",
  primaryCta: "Join the Beta",
  secondaryCta: "Back to Overview",
};
