import { ShowcaseSection } from "@/components/marketing/sections/ShowcaseSection";
import { FinancialOverview } from "@/components/marketing/product/FinancialOverview";
import { financialVisibilitySection } from "@/content/product";

export function ProductFinancialVisibility() {
  return (
    <ShowcaseSection
      id="financial-visibility"
      headline={financialVisibilitySection.headline}
      copy={financialVisibilitySection.copy}
      ctaLabel={financialVisibilitySection.ctaLabel}
      ctaHref="/signup"
      mockup={<FinancialOverview businessName={financialVisibilitySection.businessName} />}
      mockupSide="left"
      background="secondary"
    />
  );
}
