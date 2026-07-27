import { Container, ProseWidth } from "@/components/marketing/ui/Container";
import { Button } from "@/components/marketing/ui/Button";
import { Eyebrow } from "@/components/marketing/ui/Eyebrow";
import { Reveal } from "@/components/marketing/ui/Reveal";
import { pageHeadline } from "@/components/marketing/ui/typography";
import { productOverview } from "@/content/product";

// Product Overview — page-level hero, same pattern as the Food & Beverage
// solutions page's hero.
export function ProductPageHero() {
  return (
    <section className="bg-mkt-bg-primary py-[5.5rem] md:py-40">
      <Container>
        <Reveal>
          <ProseWidth large>
            <Eyebrow>{productOverview.eyebrow}</Eyebrow>
            <h1 className={`${pageHeadline} mt-4 text-mkt-text-primary`}>
              {productOverview.headline}
            </h1>
            <p className="mt-5 max-w-[620px] text-xl leading-relaxed text-mkt-text-secondary">
              {productOverview.copy}
            </p>
          </ProseWidth>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button href="/beta">Join the Beta</Button>
            <Button href="/solutions/food-and-beverage" variant="secondary" showArrow>
              See the Food &amp; Beverage Solution
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
