import { Check } from "lucide-react";
import { Container, ProseWidth } from "@/components/marketing/ui/Container";
import { Eyebrow } from "@/components/marketing/ui/Eyebrow";
import { Reveal } from "@/components/marketing/ui/Reveal";
import { sectionHeadline } from "@/components/marketing/ui/typography";
import { earlyAccessFraming } from "@/content/pricing";

// Early-access plan framing — reuses the homepage's Limited Early Access
// section pattern exactly (same dark-teal treatment), setting context
// before the plan cards below: this is curated paid early access, not a
// free tier.
export function PricingEarlyAccessFraming() {
  return (
    <section className="bg-brand-teal-deep py-[5.5rem] text-white md:py-40">
      <Container>
        <Reveal>
          <ProseWidth large>
            <Eyebrow>{earlyAccessFraming.eyebrow}</Eyebrow>
            <h2 className={`${sectionHeadline} mt-4 text-white`}>{earlyAccessFraming.headline}</h2>
            <p className="mt-5 text-xl leading-relaxed text-white/75">{earlyAccessFraming.copy}</p>
          </ProseWidth>
        </Reveal>

        <ul className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-8">
          {earlyAccessFraming.points.map((point) => (
            <li key={point} className="flex items-center gap-2.5 text-sm font-medium text-white">
              <Check className="h-4 w-4 text-brand-gold" strokeWidth={2.5} />
              {point}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
