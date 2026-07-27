import { ShowcaseSection } from "@/components/marketing/sections/ShowcaseSection";
import { FinancialOverview } from "@/components/marketing/product/FinancialOverview";
import { financialVisibilitySection } from "@/content/product";

export function ProductFinancialVisibility() {
  return (
    <ShowcaseSection
      headline={financialVisibilitySection.headline}
      copy={financialVisibilitySection.copy}
      ctaLabel={financialVisibilitySection.ctaLabel}
      ctaHref="/beta"
      mockup={<FinancialOverview businessName={financialVisibilitySection.businessName} />}
      mockupSide="left"
      background="secondary"
    />
  );
}
