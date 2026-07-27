import { Container, ProseWidth } from "@/components/marketing/ui/Container";
import { Button } from "@/components/marketing/ui/Button";
import { Eyebrow } from "@/components/marketing/ui/Eyebrow";
import { Reveal } from "@/components/marketing/ui/Reveal";
import { pageHeadline } from "@/components/marketing/ui/typography";
import { pageHero } from "@/content/solutions";

// Page-level hero for the Food & Beverage solutions page — same design
// system as the homepage hero (Eyebrow, pageHeadline token, Button), scaled
// down to an interior-page hero rather than the homepage's full treatment.
export function FBPageHero() {
  return (
    <section className="bg-mkt-bg-primary py-[5.5rem] md:py-40">
      <Container>
        <Reveal>
          <ProseWidth large>
            <Eyebrow>{pageHero.eyebrow}</Eyebrow>
            <h1 className={`${pageHeadline} mt-4 text-mkt-text-primary`}>{pageHero.headline}</h1>
            <p className="mt-5 max-w-[620px] text-xl leading-relaxed text-mkt-text-secondary">
              {pageHero.copy}
            </p>
          </ProseWidth>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button href="/beta">Join the Beta</Button>
            <Button href="/product" variant="secondary" showArrow>
              See How It Works
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
