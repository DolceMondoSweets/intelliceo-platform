import { Check } from "lucide-react";
import { Container, ProseWidth } from "@/components/marketing/ui/Container";
import { Eyebrow } from "@/components/marketing/ui/Eyebrow";
import { Button } from "@/components/marketing/ui/Button";
import { Reveal } from "@/components/marketing/ui/Reveal";
import { sectionHeadline } from "@/components/marketing/ui/typography";
import { earlyAccessSection } from "@/content/homepage";

// Section 12 (Limited Early Access) — DRAFTED, grounded in the actual
// pricing/promotion facts confirmed in the correction document (25% off
// first month + 7-day trial). Framed as curated paid early access, not a
// free tier.
export function EarlyAccessSection() {
  return (
    <section className="bg-brand-teal-deep py-[5.5rem] text-white md:py-40">
      <Container>
        <Reveal>
          <ProseWidth large>
            <Eyebrow>{earlyAccessSection.eyebrow}</Eyebrow>
            <h2 className={`${sectionHeadline} mt-4 text-white`}>{earlyAccessSection.headline}</h2>
            <p className="mt-5 text-xl leading-relaxed text-white/75">{earlyAccessSection.copy}</p>
          </ProseWidth>
        </Reveal>

        <ul className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-8">
          {earlyAccessSection.points.map((point) => (
            <li key={point} className="flex items-center gap-2.5 text-sm font-medium text-white">
              <Check className="h-4 w-4 text-brand-gold" strokeWidth={2.5} />
              {point}
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <Button href="/signup" variant="gold">
            Join the Beta
          </Button>
        </div>
      </Container>
    </section>
  );
}
