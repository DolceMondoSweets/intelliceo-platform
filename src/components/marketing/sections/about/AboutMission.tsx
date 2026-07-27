import { Container } from "@/components/marketing/ui/Container";
import { Eyebrow } from "@/components/marketing/ui/Eyebrow";
import { Reveal } from "@/components/marketing/ui/Reveal";
import { missionSection } from "@/content/about";

// Brief-verbatim mission statement, given a moment of its own — pale teal
// tint (reusing the token already established elsewhere) rather than a new
// color, centered, no card/border needed for one sentence.
export function AboutMission() {
  return (
    <section className="bg-brand-teal-light py-[5.5rem] md:py-40">
      <Container>
        <Reveal className="mx-auto flex max-w-[760px] flex-col items-center text-center">
          <Eyebrow>{missionSection.eyebrow}</Eyebrow>
          <p className="mt-5 text-[clamp(1.75rem,3.2vw,2.5rem)] font-semibold leading-snug tracking-[-0.02em] text-mkt-text-primary">
            {missionSection.statement}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
