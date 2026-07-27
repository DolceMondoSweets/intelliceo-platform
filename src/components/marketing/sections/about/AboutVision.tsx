import { Container } from "@/components/marketing/ui/Container";
import { Eyebrow } from "@/components/marketing/ui/Eyebrow";
import { Reveal } from "@/components/marketing/ui/Reveal";
import { visionSection } from "@/content/about";

// Brief-verbatim vision statement — dark teal, the same "premium dark
// moment" treatment used by EarlyAccessSection/SecurityContact elsewhere.
export function AboutVision() {
  return (
    <section className="bg-brand-teal-deep py-[5.5rem] text-white md:py-40">
      <Container>
        <Reveal className="mx-auto flex max-w-[760px] flex-col items-center text-center">
          <Eyebrow>{visionSection.eyebrow}</Eyebrow>
          <p className="mt-5 text-[clamp(1.75rem,3.2vw,2.5rem)] font-semibold leading-snug tracking-[-0.02em] text-white">
            {visionSection.statement}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
