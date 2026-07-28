import { ShowcaseSection } from "@/components/marketing/sections/ShowcaseSection";
import { CEOBriefCard } from "@/components/marketing/product/CEOBriefCard";
import { operationalVisibilitySection } from "@/content/solutions";

// Operational Visibility — reuses the homepage's CEO Brief mockup, since the
// Overall Score / flagged issues / recommended focus are exactly what
// "operational discipline" means in the product today.
export function FBOperationalVisibility() {
  return (
    <ShowcaseSection
      headline={operationalVisibilitySection.headline}
      copy={operationalVisibilitySection.copy}
      ctaLabel={operationalVisibilitySection.ctaLabel}
      ctaHref="/signup"
      mockup={<CEOBriefCard businessName={operationalVisibilitySection.businessName} />}
      mockupSide="left"
      background="secondary"
    />
  );
}
