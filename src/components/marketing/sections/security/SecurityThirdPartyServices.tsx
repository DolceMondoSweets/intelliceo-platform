import { Bot, Bug, CreditCard, Database, Store } from "lucide-react";
import { Container, ProseWidth } from "@/components/marketing/ui/Container";
import { Reveal } from "@/components/marketing/ui/Reveal";
import { SpotlightCard } from "@/components/marketing/ui/SpotlightCard";
import { sectionHeadline } from "@/components/marketing/ui/typography";
import { thirdPartyServicesSection } from "@/content/security";

const iconsByService: Record<string, typeof Database> = {
  Supabase: Database,
  Stripe: CreditCard,
  Anthropic: Bot,
  "Square & Clover": Store,
  Sentry: Bug,
};

export function SecurityThirdPartyServices() {
  return (
    <section className="bg-mkt-bg-secondary py-[5.5rem] md:py-40">
      <Container>
        <Reveal>
          <ProseWidth large>
            <h2 className={`${sectionHeadline} text-mkt-text-primary`}>
              {thirdPartyServicesSection.headline}
            </h2>
            <p className="mt-5 text-xl leading-relaxed text-mkt-text-secondary">
              {thirdPartyServicesSection.copy}
            </p>
          </ProseWidth>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {thirdPartyServicesSection.services.map((service) => {
            const Icon = iconsByService[service.name];
            return (
              <SpotlightCard
                key={service.name}
                className="flex items-start gap-4 rounded-mkt-lg border border-mkt-border-light bg-mkt-surface-white p-6"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-mkt-md bg-brand-teal-light text-brand-teal">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-mkt-text-primary">
                    {service.name}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-mkt-text-secondary">
                    {service.description}
                  </p>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
