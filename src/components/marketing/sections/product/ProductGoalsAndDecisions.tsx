import { ListChecks, Target } from "lucide-react";
import { Container, ProseWidth } from "@/components/marketing/ui/Container";
import { Reveal } from "@/components/marketing/ui/Reveal";
import { SpotlightCard } from "@/components/marketing/ui/SpotlightCard";
import { sectionHeadline } from "@/components/marketing/ui/typography";
import { goalsAndDecisionsSection } from "@/content/product";

// Goals and Decisions — merged into one section per the real product's
// scope (these describe overlapping ground, per the correction document's
// note on the Product page section list). Presented as two capability
// cards (same pattern as "Meet IntelliCEO"'s cards) rather than a new
// screenshot mockup, since there's no existing dedicated mockup for this.
export function ProductGoalsAndDecisions() {
  return (
    <section className="bg-mkt-bg-secondary py-[5.5rem] md:py-40">
      <Container>
        <Reveal>
          <ProseWidth large>
            <h2 className={`${sectionHeadline} text-mkt-text-primary`}>
              {goalsAndDecisionsSection.headline}
            </h2>
            <p className="mt-5 text-xl leading-relaxed text-mkt-text-secondary">
              {goalsAndDecisionsSection.copy}
            </p>
          </ProseWidth>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SpotlightCard className="flex flex-col gap-4 rounded-mkt-lg border border-mkt-border-light bg-mkt-surface-white p-8 shadow-mkt-card">
            <span className="flex h-11 w-11 items-center justify-center rounded-mkt-md bg-brand-teal-light text-brand-teal">
              <Target className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <h3 className="text-[1.35rem] font-[650] leading-tight tracking-[-0.02em] text-mkt-text-primary">
              {goalsAndDecisionsSection.goals.title}
            </h3>
            <p className="text-base leading-relaxed text-mkt-text-secondary">
              {goalsAndDecisionsSection.goals.description}
            </p>
          </SpotlightCard>

          <SpotlightCard className="flex flex-col gap-4 rounded-mkt-lg border border-mkt-border-light bg-mkt-surface-white p-8 shadow-mkt-card">
            <span className="flex h-11 w-11 items-center justify-center rounded-mkt-md bg-brand-teal-light text-brand-teal">
              <ListChecks className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <h3 className="text-[1.35rem] font-[650] leading-tight tracking-[-0.02em] text-mkt-text-primary">
              {goalsAndDecisionsSection.decisions.title}
            </h3>
            <p className="text-base leading-relaxed text-mkt-text-secondary">
              {goalsAndDecisionsSection.decisions.description}
            </p>
          </SpotlightCard>
        </div>
      </Container>
    </section>
  );
}
