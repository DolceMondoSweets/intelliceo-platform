import { Check } from "lucide-react";
import { Container, ProseWidth } from "@/components/marketing/ui/Container";
import { Reveal } from "@/components/marketing/ui/Reveal";
import { sectionHeadline } from "@/components/marketing/ui/typography";
import { competitiveDifferenceSection } from "@/content/homepage";

// Short, concise section added directly after Meet IntelliCEO: one headline,
// one paragraph, three bullets on what actually makes IntelliCEO different
// from a generic AI chatbot — grounded in the Business Memory / Chat facts
// already established elsewhere on the page, not new claims.
export function CompetitiveDifference() {
  return (
    <section className="py-[5.5rem] md:py-40">
      <Container>
        <Reveal>
          <ProseWidth large>
            <h2 className={`${sectionHeadline} text-mkt-text-primary`}>
              {competitiveDifferenceSection.headline}
            </h2>
            <p className="mt-5 text-xl leading-relaxed text-mkt-text-secondary">
              {competitiveDifferenceSection.copy}
            </p>
          </ProseWidth>

          <ul className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-8">
            {competitiveDifferenceSection.points.map((point) => (
              <li key={point} className="flex items-start gap-2.5 sm:max-w-[280px]">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mkt-success-bg text-mkt-success">
                  <Check className="h-3 w-3" strokeWidth={2.5} />
                </span>
                <span className="text-sm leading-snug text-mkt-text-secondary">{point}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
