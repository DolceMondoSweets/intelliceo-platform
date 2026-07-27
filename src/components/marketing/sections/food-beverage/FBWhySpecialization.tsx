import { Check } from "lucide-react";
import { Container, ProseWidth } from "@/components/marketing/ui/Container";
import { Reveal } from "@/components/marketing/ui/Reveal";
import { sectionHeadline } from "@/components/marketing/ui/typography";
import { whySpecializationSection } from "@/content/solutions";

// Why Industry Specialization Matters — reuses the homepage's Competitive
// Difference pattern exactly (headline, one paragraph, three bullets).
export function FBWhySpecialization() {
  return (
    <section className="py-[5.5rem] md:py-40">
      <Container>
        <Reveal>
          <ProseWidth large>
            <h2 className={`${sectionHeadline} text-mkt-text-primary`}>
              {whySpecializationSection.headline}
            </h2>
            <p className="mt-5 text-xl leading-relaxed text-mkt-text-secondary">
              {whySpecializationSection.copy}
            </p>
          </ProseWidth>

          <ul className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-8">
            {whySpecializationSection.points.map((point) => (
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
