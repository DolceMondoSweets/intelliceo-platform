import { ShowcaseSection } from "./ShowcaseSection";
import { CEOBriefCard } from "@/components/marketing/product/CEOBriefCard";

// Section 6 (CEO Brief Showcase) — brief-verbatim copy from the correction
// document. "CEO Brief," never "Morning Brief," and no implication of
// continuous/automatic monitoring — it's generated on request.
export function CEOBriefShowcase() {
  return (
    <ShowcaseSection
      headline="Know what matters, the moment you open the app."
      copy="The CEO Brief reviews your business each time you generate it, flags what's changed, surfaces risks, and gives you a clear, current picture of where things stand — cash, revenue, margins, and what needs your attention."
      ctaLabel="Explore the CEO Brief"
      ctaHref="/product#ceo-brief"
      mockup={<CEOBriefCard />}
      mockupSide="right"
    />
  );
}
