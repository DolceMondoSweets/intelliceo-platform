// Food & Beverage solutions page copy (Section 19 of the master brief +
// Section 19 correction: same metrics corrections as Section 16.10 — only
// real, built metrics; the challenges/use-cases narrative sections are
// DRAFTED, grounded in verified real product facts (same discipline as
// src/content/homepage.ts). The "Real-World Use Cases" scenarios are
// explicitly framed as illustrative, not customer testimonials — IntelliCEO
// has no real pilot businesses yet.

export const pageHero = {
  eyebrow: "SOLUTIONS · FOOD & BEVERAGE",
  headline: "Intelligence built for the realities behind the counter.",
  copy: "Financial clarity, operational guidance, and executive intelligence for independent food and beverage businesses.",
};

export const builtForTypes = [
  { label: "Coffee Shops", icon: "Coffee" },
  { label: "Restaurants", icon: "Utensils" },
  { label: "Bakeries", icon: "Croissant" },
  { label: "Food Trucks", icon: "Truck" },
  { label: "Small Hospitality Businesses", icon: "Store" },
] as const;

export const challengesSection = {
  headline: "Running food & beverage means constant decisions — often blind.",
  intro:
    "Independent owners are pulled in a dozen directions at once, usually without the numbers to back up the calls they're making.",
  items: [
    "Food cost can creep up a percentage point at a time until it's a real problem.",
    "Labor is the second-biggest expense — and the easiest one to lose track of.",
    "Cash flow swings with the seasons, but rent and payroll don't.",
    "There's no time to analyze the numbers between prep, service, and close.",
    "Generic accounting software doesn't know what a healthy prime cost looks like.",
  ],
};

// Metrics list is brief-verbatim from Section 16.10's correction (same list
// used on the homepage's Food & Beverage Solution section).
export const financialVisibilitySection = {
  headline: "Know your numbers before they become a problem.",
  copy: "IntelliCEO tracks the metrics that actually decide whether a food & beverage business is healthy — food cost percentage, labor cost percentage, and prime cost against a healthy industry benchmark — alongside revenue synced from your point of sale, budget versus actual performance, and your break-even point.",
  ctaLabel: "Join the Beta",
  businessName: "Golden Crust Bakery",
};

export const operationalVisibilitySection = {
  headline: "Always know what needs your attention.",
  copy: "The CEO Brief reviews your business whenever you generate it — cash position, revenue trend, an Overall Score, and a clear recommended focus area — so nothing falls through the cracks between shifts.",
  ctaLabel: "Join the Beta",
  businessName: "Bluebird Coffee Co.",
};

export const aiAdvisorSection = {
  headline: "Ask the questions you'd ask a trusted advisor.",
  copy: "Chat with IntelliCEO the way you'd talk to a manager who's seen it all — grounded in your real, current numbers and everything you've discussed before, not generic advice.",
  ctaLabel: "Join the Beta",
  businessName: "Rosa's Kitchen",
};

export const useCasesSection = {
  eyebrow: "ILLUSTRATIVE SCENARIOS",
  headline: "How this could look for a business like yours.",
  disclaimer:
    "IntelliCEO is in limited early access. The scenarios below are illustrative examples of how the product works, not real customer stories.",
  scenarios: [
    {
      business: "Bluebird Coffee Co.",
      type: "Coffee shop",
      icon: "Coffee",
      scenario:
        "When weekend labor costs push prime cost to 67%, the CEO Brief flags it immediately and recommends reviewing the schedule before the next payroll cycle.",
    },
    {
      business: "Golden Crust Bakery",
      type: "Bakery",
      icon: "Croissant",
      scenario:
        "A quick look at Vital Signs shows food cost has crept up two months running, enough to catch it before it erodes a full quarter's margin.",
    },
    {
      business: "Rosa's Kitchen",
      type: "Restaurant",
      icon: "Utensils",
      scenario:
        "Instead of digging through spreadsheets, the owner asks IntelliCEO how margin compares to last month and gets a straight answer grounded in the restaurant's real numbers.",
    },
  ],
};

export const whySpecializationSection = {
  headline: "Generic software wasn't built for food & beverage margins.",
  copy: "Most accounting and point-of-sale tools treat every business the same. IntelliCEO is different — built specifically around the benchmarks and pressure points that decide whether a food & beverage business is healthy.",
  points: [
    "Built around real industry benchmarks — a healthy prime cost range, not generic accounting categories.",
    "Understands the specific pressure points of running food & beverage: thin margins, seasonal cash flow, and labor cost.",
    "Every number is grounded in your real point-of-sale data, not projections or industry averages.",
  ],
};

export const finalCtaSection = {
  headline: "Run your food & beverage business like the CEO it deserves.",
  copy: "Limited early access is open now for independent food & beverage businesses.",
  primaryCta: "Join the Beta",
  secondaryCta: "Back to Overview",
};
