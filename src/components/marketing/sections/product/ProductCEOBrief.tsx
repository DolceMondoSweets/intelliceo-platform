import { ShowcaseSection } from "@/components/marketing/sections/ShowcaseSection";
import { CEOBriefCard } from "@/components/marketing/product/CEOBriefCard";
import { ceoBriefSection } from "@/content/product";

export function ProductCEOBrief() {
  return (
    <ShowcaseSection
      id="ceo-brief"
      headline={ceoBriefSection.headline}
      copy={ceoBriefSection.copy}
      ctaLabel={ceoBriefSection.ctaLabel}
      ctaHref="/signup"
      mockup={<CEOBriefCard businessName={ceoBriefSection.businessName} />}
      mockupSide="right"
    />
  );
}
