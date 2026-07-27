import { Container, ProseWidth } from "@/components/marketing/ui/Container";
import { Eyebrow } from "@/components/marketing/ui/Eyebrow";
import { Reveal } from "@/components/marketing/ui/Reveal";
import { pageHeadline } from "@/components/marketing/ui/typography";
import { pricingHero } from "@/content/pricing";

export function PricingHero() {
  return (
    <section className="bg-mkt-bg-primary py-[5.5rem] md:py-40">
      <Container>
        <Reveal>
          <ProseWidth large>
            <Eyebrow>{pricingHero.eyebrow}</Eyebrow>
            <h1 className={`${pageHeadline} mt-4 text-mkt-text-primary`}>
              {pricingHero.headline}
            </h1>
            <p className="mt-5 max-w-[620px] text-xl leading-relaxed text-mkt-text-secondary">
              {pricingHero.copy}
            </p>
          </ProseWidth>
        </Reveal>
      </Container>
    </section>
  );
}
