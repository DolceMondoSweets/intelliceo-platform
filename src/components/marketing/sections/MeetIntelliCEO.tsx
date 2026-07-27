import { ChartNoAxesCombined, ClipboardCheck, Database, Lightbulb } from "lucide-react";
import { Container, ProseWidth } from "@/components/marketing/ui/Container";
import { Reveal } from "@/components/marketing/ui/Reveal";
import { SpotlightCard } from "@/components/marketing/ui/SpotlightCard";
import { sectionHeadline } from "@/components/marketing/ui/typography";
import { capabilityCards } from "@/content/homepage";

const iconMap = {
  ChartNoAxesCombined,
  Lightbulb,
  ClipboardCheck,
  Database,
};

export function MeetIntelliCEO() {
  return (
    <section className="bg-brand-teal-light py-[5.5rem] md:py-40">
      <Container>
        <Reveal>
          <ProseWidth>
            <h2 className={`${sectionHeadline} text-mkt-text-primary`}>Meet IntelliCEO.</h2>
          </ProseWidth>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {capabilityCards.map((card) => {
            const Icon = iconMap[card.icon as keyof typeof iconMap];
            return (
              <SpotlightCard
                key={card.title}
                className="flex flex-col gap-4 rounded-mkt-lg border border-mkt-border-light bg-mkt-surface-white p-8 shadow-mkt-card"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-mkt-md bg-brand-teal-light text-brand-teal">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h3 className="text-[1.35rem] font-[650] leading-tight tracking-[-0.02em] text-mkt-text-primary">
                  {card.title}
                </h3>
                <p className="text-base leading-relaxed text-mkt-text-secondary">
                  {card.description}
                </p>
              </SpotlightCard>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
