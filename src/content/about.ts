// About page (Section 21 of the master brief). Deliberately centered on the
// systemic problem, not a founder narrative — no name, no personal
// timeline, no photo. Sections 3-5 are the brief's exact given copy
// (Mission, Grounded in Real Experience, Long-Term Vision); Sections 1-2
// are DRAFTED to match the stated structure.

export const problemSection = {
  eyebrow: "ABOUT",
  headline: "Big businesses have a CFO. Independent owners have themselves.",
  copy: "Large businesses have CFOs to read the numbers, data analysts to catch what's changing, and management consultants to tell them what to do about it. Independent business owners have none of that — not because they need it less, but because none of it was ever built for them. That gap costs real money, in decisions made on instinct instead of information, and real stress, in carrying the weight of a business with no one to talk it through with.",
};

export const whyGapExistsSection = {
  headline: "The support was never priced for a business your size.",
  copy: "A CFO, a data analyst, and a management consultant are each a full salary or a consulting retainer — built for companies with the revenue to justify the cost and the complexity to need a specialist for each function. Independent businesses have neither, so the same clarity, judgment, and expertise stay reserved for companies already large enough to afford them.",
  points: [
    {
      icon: "DollarSign",
      title: "Cost",
      description:
        "Full-time hires and consulting retainers are priced for companies with the revenue to support them.",
    },
    {
      icon: "Layers",
      title: "Complexity",
      description:
        "Larger companies bring in a specialist for each function. An independent business needs all of it, from one person.",
    },
    {
      icon: "Lock",
      title: "Access",
      description:
        "The tools and expertise built for enterprise operations were never designed to reach a business this size.",
    },
  ],
};

// Brief-verbatim.
export const missionSection = {
  eyebrow: "OUR MISSION",
  statement:
    "IntelliCEO exists to give independent business owners access to the clarity, expertise, and operating discipline normally available only to much larger companies.",
};

// Brief-verbatim.
export const realExperienceSection = {
  headline: "Grounded in real experience.",
  copy: "IntelliCEO started with a real food & beverage business, not a hypothetical one. That's not incidental — it's why the platform is built around the actual numbers, pressures, and daily decisions independent owners face, rather than generic business software.",
};

// Brief-verbatim.
export const visionSection = {
  eyebrow: "LONG-TERM VISION",
  statement:
    "Build the intelligent operating system that helps small businesses make stronger decisions and operate at a higher level.",
};

export const contactCtaSection = {
  headline: "Have a question, or something to tell us?",
  copy: "We're building this with a small group of real owners first — your perspective matters.",
  ctaLabel: "Contact Us",
};
