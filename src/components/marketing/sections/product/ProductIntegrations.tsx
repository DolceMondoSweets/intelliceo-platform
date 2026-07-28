import { CreditCard } from "lucide-react";
import { Container, ProseWidth } from "@/components/marketing/ui/Container";
import { Reveal } from "@/components/marketing/ui/Reveal";
import { SpotlightCard } from "@/components/marketing/ui/SpotlightCard";
import { sectionHeadline } from "@/components/marketing/ui/typography";
import { integrationsSection } from "@/content/product";

// Integrations — Square and Clover specifically, both real, both
// revenue-sync only (matches src/app/(app)/pos-integration/actions.ts).
// No brand marks used, since these are text-only illustrative cards, not
// real screenshots.
export function ProductIntegrations() {
  return (
    <section id="integrations" className="bg-mkt-bg-secondary py-[5.5rem] md:py-40">
      <Container>
        <Reveal>
          <ProseWidth large>
            <h2 className={`${sectionHeadline} text-mkt-text-primary`}>
              {integrationsSection.headline}
            </h2>
            <p className="mt-5 text-xl leading-relaxed text-mkt-text-secondary">
              {integrationsSection.copy}
            </p>
          </ProseWidth>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {integrationsSection.integrations.map((integration) => (
            <SpotlightCard
              key={integration.name}
              className="flex items-start gap-4 rounded-mkt-lg border border-mkt-border-light bg-mkt-surface-white p-6 shadow-mkt-card"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-mkt-md bg-brand-teal-light text-brand-teal">
                <CreditCard className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <div>
                <h3 className="text-base font-semibold text-mkt-text-primary">
                  {integration.name}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-mkt-text-secondary">
                  {integration.description}
                </p>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </Container>
    </section>
  );
}
