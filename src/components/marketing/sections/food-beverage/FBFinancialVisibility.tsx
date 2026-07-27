import {
  ChartNoAxesCombined,
  CircleDollarSign,
  ClipboardCheck,
  Store,
  Target,
  WalletCards,
} from "lucide-react";
import { Container } from "@/components/marketing/ui/Container";
import { Button } from "@/components/marketing/ui/Button";
import { Reveal } from "@/components/marketing/ui/Reveal";
import { SpotlightCard } from "@/components/marketing/ui/SpotlightCard";
import { sectionHeadline } from "@/components/marketing/ui/typography";
import { FinancialOverview } from "@/components/marketing/product/FinancialOverview";
import { financialVisibilitySection } from "@/content/solutions";

// Corrected metrics list — brief-verbatim from Section 16.10's correction,
// same list/icons as the homepage's Food & Beverage Solution section.
const metrics = [
  { label: "Food cost percentage", icon: CircleDollarSign },
  { label: "Labor cost percentage", icon: WalletCards },
  { label: "Prime cost", icon: ChartNoAxesCombined },
  { label: "Revenue (via Square or Clover)", icon: Store },
  { label: "Budget vs. actual", icon: ClipboardCheck },
  { label: "Break-even point", icon: Target },
];

// Financial Visibility — reuses ShowcaseSection's exact two-column layout
// pattern (not the component itself, since this section needs an extra
// metrics grid below the mockup that ShowcaseSection has no slot for).
export function FBFinancialVisibility() {
  return (
    <section className="py-[5.5rem] md:py-40">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h2 className={`${sectionHeadline} text-mkt-text-primary`}>
              {financialVisibilitySection.headline}
            </h2>
            <p className="mt-5 max-w-[520px] text-xl leading-relaxed text-mkt-text-secondary">
              {financialVisibilitySection.copy}
            </p>
            <div className="mt-8">
              <Button href="/beta" variant="secondary" showArrow>
                {financialVisibilitySection.ctaLabel}
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="flex justify-center lg:justify-end">
            <FinancialOverview businessName={financialVisibilitySection.businessName} />
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map(({ label, icon: Icon }) => (
            <SpotlightCard
              key={label}
              className="flex items-center gap-3 rounded-mkt-md border border-mkt-border-light bg-mkt-surface-white p-5"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-mkt-sm bg-brand-teal-light text-brand-teal">
                <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
              </span>
              <span className="text-sm font-medium text-mkt-text-primary">{label}</span>
            </SpotlightCard>
          ))}
        </div>
      </Container>
    </section>
  );
}
