import { ShowcaseSection } from "@/components/marketing/sections/ShowcaseSection";
import { AdvisorResponse } from "@/components/marketing/product/AdvisorResponse";
import { aiAdvisorSection } from "@/content/solutions";

// AI Business Advisor — reuses the homepage's AdvisorResponse mockup with a
// different example business (a restaurant, for variety alongside the
// coffee shop and bakery used elsewhere on this page).
export function FBAIAdvisor() {
  return (
    <ShowcaseSection
      headline={aiAdvisorSection.headline}
      copy={aiAdvisorSection.copy}
      ctaLabel={aiAdvisorSection.ctaLabel}
      ctaHref="/signup"
      mockup={<AdvisorResponse businessName={aiAdvisorSection.businessName} />}
      mockupSide="right"
    />
  );
}
