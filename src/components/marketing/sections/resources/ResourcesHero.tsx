import { Container, ProseWidth } from "@/components/marketing/ui/Container";
import { Eyebrow } from "@/components/marketing/ui/Eyebrow";
import { Reveal } from "@/components/marketing/ui/Reveal";
import { pageHeadline } from "@/components/marketing/ui/typography";
import { helpCenterHero } from "@/content/help-center";

export function ResourcesHero() {
  return (
    <section className="bg-mkt-bg-primary py-[5.5rem] md:py-40">
      <Container>
        <Reveal>
          <ProseWidth large>
            <Eyebrow>{helpCenterHero.eyebrow}</Eyebrow>
            <h1 className={`${pageHeadline} mt-4 text-mkt-text-primary`}>
              {helpCenterHero.headline}
            </h1>
            <p className="mt-5 max-w-[620px] text-xl leading-relaxed text-mkt-text-secondary">
              {helpCenterHero.copy}
            </p>
          </ProseWidth>
        </Reveal>
      </Container>
    </section>
  );
}
