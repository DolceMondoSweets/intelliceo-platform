import { Coffee, Croissant, Utensils } from "lucide-react";
import { Container, ProseWidth } from "@/components/marketing/ui/Container";
import { Eyebrow } from "@/components/marketing/ui/Eyebrow";
import { Reveal } from "@/components/marketing/ui/Reveal";
import { SpotlightCard } from "@/components/marketing/ui/SpotlightCard";
import { sectionHeadline } from "@/components/marketing/ui/typography";
import { useCasesSection } from "@/content/solutions";

const iconMap = { Coffee, Utensils, Croissant };

// Real-World Use Cases — IntelliCEO has no real pilot businesses yet, so
// these are explicitly framed as illustrative scenarios (the disclaimer is
// load-bearing copy, not decoration) rather than anything implying real
// customer testimonials. Reuses the same example businesses shown in the
// mockups above (Bluebird Coffee Co., Golden Crust Bakery, Rosa's Kitchen).
export function FBUseCases() {
  return (
    <section className="bg-brand-teal-light py-[5.5rem] md:py-40">
      <Container>
        <Reveal>
          <ProseWidth large>
            <Eyebrow>{useCasesSection.eyebrow}</Eyebrow>
            <h2 className={`${sectionHeadline} mt-4 text-mkt-text-primary`}>
              {useCasesSection.headline}
            </h2>
            <p className="mt-5 text-base italic leading-relaxed text-mkt-text-secondary">
              {useCasesSection.disclaimer}
            </p>
          </ProseWidth>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {useCasesSection.scenarios.map((item) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            return (
              <SpotlightCard
                key={item.business}
                className="flex flex-col gap-4 rounded-mkt-lg border border-mkt-border-light bg-mkt-surface-white p-6 shadow-mkt-card"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-mkt-md bg-brand-teal-light text-brand-teal">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="text-base font-semibold text-mkt-text-primary">{item.business}</p>
                  <p className="text-xs font-medium uppercase tracking-[0.06em] text-mkt-text-muted">
                    {item.type}
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-mkt-text-secondary">{item.scenario}</p>
              </SpotlightCard>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
