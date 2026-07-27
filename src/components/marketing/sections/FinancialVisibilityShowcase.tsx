import { ShowcaseSection } from "./ShowcaseSection";
import { FinancialOverview } from "@/components/marketing/product/FinancialOverview";

// Section 7 (Financial Visibility Showcase) — headline and copy are
// brief-verbatim from the correction document. No explicit CTA label was
// given for this section; "Explore Financial Visibility" follows the same
// "Explore the [feature]" pattern used by the sibling showcases.
export function FinancialVisibilityShowcase() {
  return (
    <ShowcaseSection
      headline="See beyond sales."
      copy="Revenue tells only part of the story. IntelliCEO helps owners track cash position, runway, food cost, prime cost against a healthy industry benchmark, budget versus actual performance, and the break-even point that keeps the business healthy."
      ctaLabel="Explore Financial Visibility"
      ctaHref="/product#financial-visibility"
      mockup={<FinancialOverview />}
      mockupSide="left"
      background="secondary"
    />
  );
}
