import { Container, ProseWidth } from "@/components/marketing/ui/Container";
import { Reveal } from "@/components/marketing/ui/Reveal";
import { sectionHeadline } from "@/components/marketing/ui/typography";
import { realExperienceSection } from "@/content/about";

// Brief-verbatim, deliberately kept to two sentences — not a founder
// biography, no name, no timeline, no photo.
export function AboutRealExperience() {
  return (
    <section className="py-[5.5rem] md:py-40">
      <Container>
        <Reveal>
          <ProseWidth large>
            <h2 className={`${sectionHeadline} text-mkt-text-primary`}>
              {realExperienceSection.headline}
            </h2>
            <p className="mt-5 text-xl leading-relaxed text-mkt-text-secondary">
              {realExperienceSection.copy}
            </p>
          </ProseWidth>
        </Reveal>
      </Container>
    </section>
  );
}
