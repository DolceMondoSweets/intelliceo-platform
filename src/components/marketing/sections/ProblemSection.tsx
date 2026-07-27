import { Container, ProseWidth } from "@/components/marketing/ui/Container";
import { Reveal } from "@/components/marketing/ui/Reveal";
import { SpotlightCard } from "@/components/marketing/ui/SpotlightCard";
import { sectionHeadline } from "@/components/marketing/ui/typography";
import { problemSection } from "@/content/homepage";

// Five question cards, asymmetrical grid — varied spans rather than a
// uniform row, per the brief's stated structure for this section.
const spans = [
  "md:col-span-7",
  "md:col-span-5",
  "md:col-span-4",
  "md:col-span-4",
  "md:col-span-4",
];

export function ProblemSection() {
  return (
    <section className="py-[5.5rem] md:py-40">
      <Container>
        <Reveal>
          <ProseWidth large>
            <h2 className={`${sectionHeadline} text-mkt-text-primary`}>
              {problemSection.headline}
            </h2>
            <p className="mt-5 text-xl leading-relaxed text-mkt-text-secondary">
              {problemSection.intro}
            </p>
          </ProseWidth>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-12">
          {problemSection.questions.map((question, index) => (
            <SpotlightCard
              key={question}
              className={`rounded-mkt-lg border border-mkt-border-light bg-mkt-surface-white p-6 shadow-mkt-card md:col-span-4 ${spans[index] ?? ""}`}
            >
              <p className="text-lg font-medium leading-snug text-mkt-text-primary">{question}</p>
            </SpotlightCard>
          ))}
        </div>
      </Container>
    </section>
  );
}
