import { CalendarX, Compass, RefreshCw, ShieldCheck } from "lucide-react";
import { Container, ProseWidth } from "@/components/marketing/ui/Container";
import { Reveal } from "@/components/marketing/ui/Reveal";
import { SpotlightCard } from "@/components/marketing/ui/SpotlightCard";
import { sectionHeadline } from "@/components/marketing/ui/typography";
import { whatsIncludedSection } from "@/content/pricing";

const icons = [Compass, ShieldCheck, CalendarX, RefreshCw];

export function PricingWhatsIncluded() {
  return (
    <section className="bg-mkt-bg-secondary py-[5.5rem] md:py-40">
      <Container>
        <Reveal>
          <ProseWidth>
            <h2 className={`${sectionHeadline} text-mkt-text-primary`}>
              {whatsIncludedSection.headline}
            </h2>
          </ProseWidth>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {whatsIncludedSection.items.map((item, index) => {
            const Icon = icons[index];
            return (
              <SpotlightCard
                key={item.title}
                className="flex flex-col gap-4 rounded-mkt-lg border border-mkt-border-light bg-mkt-surface-white p-8 shadow-mkt-card"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-mkt-md bg-brand-teal-light text-brand-teal">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h3 className="text-[1.35rem] font-[650] leading-tight tracking-[-0.02em] text-mkt-text-primary">
                  {item.title}
                </h3>
                <p className="text-base leading-relaxed text-mkt-text-secondary">
                  {item.description}
                </p>
              </SpotlightCard>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
