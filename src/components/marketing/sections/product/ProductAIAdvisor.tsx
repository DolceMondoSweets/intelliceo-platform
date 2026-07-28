import { ShowcaseSection } from "@/components/marketing/sections/ShowcaseSection";
import { AdvisorResponse } from "@/components/marketing/product/AdvisorResponse";
import { aiAdvisorSection } from "@/content/product";

export function ProductAIAdvisor() {
  return (
    <ShowcaseSection
      id="ai-advisor"
      headline={aiAdvisorSection.headline}
      copy={aiAdvisorSection.copy}
      ctaLabel={aiAdvisorSection.ctaLabel}
      ctaHref="/signup"
      mockup={<AdvisorResponse businessName={aiAdvisorSection.businessName} />}
      mockupSide="right"
    />
  );
}
