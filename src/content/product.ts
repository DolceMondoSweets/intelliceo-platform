// Product page copy (Section 17 area of the master brief: dedicated
// Product page). DRAFTED, grounded in verified real product facts — every
// feature described here actually exists in the product today (Design
// Quality Checklist addition from the correction document). Metrics/
// benchmark language matches the food-cost-benchmark fix already applied
// on the homepage and Food & Beverage page: only prime cost has a stated
// healthy range in the product.

export const productOverview = {
  eyebrow: "PRODUCT",
  headline: "Everything you need to run the business, not just track it.",
  copy: "IntelliCEO brings financial visibility, an AI business advisor, operational discipline, and content creation into one place — built specifically for independent food & beverage businesses.",
};

export const ceoBriefSection = {
  headline: "A clear, current picture of your business, generated on request.",
  copy: "The CEO Brief reviews your business each time you generate it — cash position, revenue trend, an Overall Score, a flagged issue, and a clear recommended focus area. It's not a constant background monitor; you're always in control of when it runs.",
  ctaLabel: "Join the Beta",
  businessName: "Bluebird Coffee Co.",
};

export const financialVisibilitySection = {
  headline: "Every number that decides whether the business is healthy.",
  copy: "IntelliCEO tracks food cost percentage, labor cost percentage, and prime cost against a healthy industry benchmark, revenue synced from your point of sale, budget versus actual performance, and your break-even point.",
  ctaLabel: "Join the Beta",
  businessName: "Golden Crust Bakery",
};

export const aiAdvisorSection = {
  headline: "Ask the questions you'd ask a trusted advisor.",
  copy: "Chat with IntelliCEO the way you'd talk to a manager who's seen it all — grounded in your real, current numbers and everything you've discussed before, not generic advice.",
  ctaLabel: "Join the Beta",
  businessName: "Rosa's Kitchen",
};

// Goals + Decisions Log — fields match the real schema exactly: goals have
// a status of Active/Achieved/Overdue (no percent-complete concept);
// decisions have decision/why/who/expected vs. actual outcome and a status
// of Open/Closed.
export const goalsAndDecisionsSection = {
  headline: "Keep a record of what you decided, and why.",
  copy: "Set goals tied to the metrics that matter, and log every real decision — what was decided, why, and what actually happened. Nothing falls through the cracks, and nothing gets forgotten between shifts.",
  goals: {
    title: "Goals",
    description:
      "Set a goal against any metric that matters — a target value and a target date. Track it as Active, mark it Achieved, or see it flagged Overdue.",
  },
  decisions: {
    title: "Decisions Log",
    description:
      "Log what was decided, why, and who made the call. Come back later to record what actually happened and close the loop.",
  },
};

// Content Studio — three real content types from the actual content type
// list (Social Media Post, Email Campaign, Promotional Announcement),
// shown across different example businesses for variety.
export const contentStudioSection = {
  headline: "Real marketing content, without a marketing team.",
  copy: "Content Studio writes ready-to-use marketing content grounded in your actual business — across the content types and platforms you actually need. No blank page, no generic templates, no marketing hire required.",
  ctaLabel: "Join the Beta",
  examples: [
    {
      businessName: "Bluebird Coffee Co.",
      contentType: "Social Media Post",
      platform: "Instagram",
      topic: "Seasonal pumpkin spice latte",
      outputLabel: "Generated caption",
      generatedContent:
        "Meet our Seasonal Pumpkin Spice Latte ☕ — real espresso, house-made spice blend, and a silky oat milk swirl. Back for the season, only through October. Come cozy up with us.",
    },
    {
      businessName: "Golden Crust Bakery",
      contentType: "Email Campaign",
      topic: "Weekend pastry box pre-orders",
      outputLabel: "Generated email",
      generatedContent:
        "Subject: Save yourself a Saturday morning trip. This weekend's pastry boxes are open for pre-order — pick your favorites, skip the line, and grab everything fresh at pickup. Boxes are limited, so reserve yours before Friday at 5pm.",
    },
    {
      businessName: "Rosa's Kitchen",
      contentType: "Promotional Announcement",
      topic: "New happy hour hours",
      outputLabel: "Generated announcement",
      generatedContent:
        "Happy hour just got longer. Starting this week, join us Tuesday through Friday from 3–6pm for half-off appetizers and drink specials at the bar. Same great food, better time to enjoy it.",
    },
  ],
};

export const integrationsSection = {
  headline: "Connect the point-of-sale system you already use.",
  copy: "IntelliCEO syncs month-to-date revenue directly from Square or Clover — no manual entry required. Don't use either? Enter your numbers yourself; every other feature works exactly the same way.",
  integrations: [
    {
      name: "Square",
      description: "Syncs your month-to-date revenue directly from Square, automatically.",
    },
    {
      name: "Clover",
      description: "Syncs your month-to-date revenue directly from Clover, automatically.",
    },
  ],
};

// Admin-access line corrected to match what's actually enforced in code —
// no audit log or support-ticket gate exists, so "only to provide support
// you ask for" overclaimed a control that doesn't exist.
export const securitySection = {
  eyebrow: "SECURITY",
  headline: "Your business data stays yours.",
  copy: "Every business's data is fully isolated at the database level — no other account can ever see it. A small number of authorized team members can access aggregate account information for support and platform operations. Payment details are handled entirely by Stripe; IntelliCEO never stores your card information.",
  ctaLabel: "Read the Full Security Overview",
};

export const productFaqItems = [
  {
    question: "What's the difference between the CEO Brief and Chat?",
    answer:
      "The CEO Brief is a full review of your business, generated on request — cash, revenue, margins, and a recommended focus area. Chat is for asking specific questions any time and getting answers grounded in your real numbers and past conversations.",
  },
  {
    question: "Can I use IntelliCEO without connecting a POS system?",
    answer:
      "Yes. Enter your numbers manually — every other feature, including the CEO Brief, Financial Visibility, and Chat, works exactly the same way.",
  },
  {
    question: "Which point-of-sale systems does IntelliCEO support?",
    answer:
      "Square and Clover today, with more platforms planned. If you use something else, you can still enter your numbers manually.",
  },
  {
    question: "Do I need an accounting background to use this?",
    answer:
      "No. IntelliCEO is built to translate your numbers into plain language, with industry benchmarks for context, so you don't need a finance background to understand where you stand.",
  },
  {
    question: "Is the CEO Brief updated automatically?",
    answer:
      "The CEO Brief is generated when you ask for it, reviewing your current numbers each time — it's not a constant background monitor, so you're always in control of when it runs.",
  },
] as const;

export const betaCtaSection = {
  headline: "See it in action for your own business.",
  copy: "Limited early access is open now for independent food & beverage businesses.",
  primaryCta: "Join the Beta",
  secondaryCta: "Back to Overview",
};
