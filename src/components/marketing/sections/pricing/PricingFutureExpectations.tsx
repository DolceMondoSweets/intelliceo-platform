import { Container, ProseWidth } from "@/components/marketing/ui/Container";
import { Reveal } from "@/components/marketing/ui/Reveal";
import { sectionHeadline } from "@/components/marketing/ui/typography";
import { futureExpectationsSection } from "@/content/pricing";

export function PricingFutureExpectations() {
  return (
    <section className="py-[5.5rem] md:py-40">
      <Container>
        <Reveal>
          <ProseWidth large>
            <h2 className={`${sectionHeadline} text-mkt-text-primary`}>
              {futureExpectationsSection.headline}
            </h2>
            <p className="mt-5 text-xl leading-relaxed text-mkt-text-secondary">
              {futureExpectationsSection.copy}
            </p>
          </ProseWidth>
        </Reveal>
      </Container>
    </section>
  );
}
