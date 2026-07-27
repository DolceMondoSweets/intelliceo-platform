// Resources page — Help Center. Every screenshot is real product UI,
// captured from a dedicated demo account (Harborlight Café, entirely
// fictional business/financial data — never real customer data). Steps are
// grounded in what each screen actually does; nothing here describes a
// feature that doesn't exist.

export const helpCenterHero = {
  eyebrow: "RESOURCES",
  headline: "Help Center",
  copy: "Real screenshots and short, clear steps for everything in IntelliCEO — from your first sign-up to connecting your point of sale.",
};

type HelpCenterImage = { src: string; width: number; height: number };

export const helpCenterEntries: {
  label: string;
  title: string;
  images: HelpCenterImage[];
  steps: string[];
}[] = [
  {
    label: "Sign Up",
    title: "Create your account.",
    images: [{ src: "signup.jpeg", width: 450, height: 427 }],
    steps: [
      "Go to Sign Up and enter your email and a password.",
      "Tell IntelliCEO about your business — name, a quick overview, what you sell, and what matters most right now.",
      "Choose whether you use Square, Clover, or another/no POS system.",
      "Enter your starting numbers — cash on hand, monthly burn, and this month's revenue.",
      "Pick a plan and start your 7-day free trial.",
    ],
  },
  {
    label: "Dashboard",
    title: "Your business at a glance.",
    images: [
      { src: "Dashboard.jpg", width: 653, height: 758 },
      { src: "Dashboard-2.jpg", width: 645, height: 819 },
    ],
    steps: [
      "See your finance snapshot — cash, burn, runway, revenue, food cost, and prime cost — the moment you log in.",
      "Check Budget vs. Actual to see where you're over or under plan.",
      "Review your break-even point and how far above or below it you are this month.",
      "Try the What-If Calculator to see how a change in revenue or costs would move your numbers, without saving anything.",
    ],
  },
  {
    label: "CEO Brief",
    title: "Get a full read on the business, on demand.",
    images: [{ src: "morning-brief.jpg", width: 652, height: 837 }],
    steps: [
      "Open CEO Brief and click Generate Fresh CEO Brief.",
      "Review your Overall Score, momentum, and cash runway.",
      "See today's biggest opportunity and biggest risk, grounded in your real numbers.",
      "Check the Recommended Focus for one clear action to take today.",
    ],
  },
  {
    label: "Vital Signs",
    title: "The 10 questions every founder should be able to answer.",
    images: [{ src: "vital-signs.jpg", width: 477, height: 819 }],
    steps: [
      "Open Vital Signs and click Get Your Answers.",
      "Each question is flagged good, caution, or concern based on your real data.",
      "Click Read More under any question for a fuller explanation.",
      "Questions without enough data yet are marked honestly instead of guessed.",
    ],
  },
  {
    label: "Decisions Log",
    title: "Keep a record of what you decided, and why.",
    images: [{ src: "decisions.jpg", width: 654, height: 763 }],
    steps: [
      "Log a new decision — what was decided, why, and who made the call.",
      "Come back later and close the loop by recording what actually happened.",
      "Open and closed decisions both stay on record, so you can see your own track record over time.",
    ],
  },
  {
    label: "Goals",
    title: "Set a target, and track it.",
    images: [{ src: "goals.jpg", width: 632, height: 806 }],
    steps: [
      "Set a new goal — what you're trying to achieve, the metric, a target value, and a date.",
      "Track it as Active until you hit it.",
      "Click Mark Achieved once you've reached it.",
    ],
  },
  {
    label: "POS Integration",
    title: "Connect Square or Clover.",
    images: [{ src: "pos-integration.jpg", width: 642, height: 703 }],
    steps: [
      "Open POS Integration and choose Square or Clover.",
      "Enter your production access token and location/merchant ID from your POS provider's developer dashboard.",
      "Click Save Credentials.",
      "Click Fetch MTD Revenue to pull your real month-to-date revenue directly into your finance snapshot.",
    ],
  },
  {
    label: "Content Studio",
    title: "Real marketing content in seconds.",
    images: [{ src: "content-studio.jpg", width: 630, height: 887 }],
    steps: [
      "Choose what you're creating — social post, email, announcement, and more.",
      "Tell IntelliCEO what it's about, and add tone notes if you want a specific voice.",
      "Click Generate Draft.",
      "Save any draft you like to your Content Library.",
    ],
  },
  {
    label: "Ask / Chat",
    title: "Ask anything about your business.",
    images: [{ src: "ask-chat-bar.jpg", width: 486, height: 515 }],
    steps: [
      "Use the Ask bar at the top of any page.",
      "Ask a specific question — IntelliCEO answers using your real numbers and everything you've discussed before.",
      "Keep the conversation going; IntelliCEO remembers the context.",
    ],
  },
];
