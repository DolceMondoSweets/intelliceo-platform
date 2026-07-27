import { ShowcaseSection } from "./ShowcaseSection";
import { AdvisorResponse } from "@/components/marketing/product/AdvisorResponse";

// Section 8 (AI Business Advisor Showcase) — headline and the example
// exchange are brief-verbatim from the correction document. The intro
// sentence below the headline was drafted to bridge to the mockup (the
// correction doc gives the headline + example conversation but no separate
// intro paragraph for this section specifically).
export function AIAdvisorShowcase() {
  return (
    <ShowcaseSection
      headline="Ask the questions you'd ask a trusted partner."
      copy="Chat with IntelliCEO the way you'd talk to a trusted advisor — grounded in your real, current numbers, not generic advice."
      ctaLabel="Explore the AI Advisor"
      ctaHref="/product#ai-advisor"
      mockup={<AdvisorResponse />}
      mockupSide="right"
    />
  );
}
