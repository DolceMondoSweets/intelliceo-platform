import { Container, ProseWidth } from "@/components/marketing/ui/Container";
import { Reveal } from "@/components/marketing/ui/Reveal";
import { sectionHeadline } from "@/components/marketing/ui/typography";
import { dataOwnershipSection } from "@/content/security";

export function SecurityDataOwnership() {
  return (
    <section className="bg-mkt-bg-secondary py-[5.5rem] md:py-40">
      <Container>
        <Reveal>
          <ProseWidth large>
            <h2 className={`${sectionHeadline} text-mkt-text-primary`}>
              {dataOwnershipSection.headline}
            </h2>
            <p className="mt-5 text-xl leading-relaxed text-mkt-text-secondary">
              {dataOwnershipSection.copy}
            </p>
          </ProseWidth>
        </Reveal>
      </Container>
    </section>
  );
}
