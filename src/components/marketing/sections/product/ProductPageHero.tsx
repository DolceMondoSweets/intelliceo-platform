import Image from "next/image";
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
        <div className="grid items-center gap-10 lg:grid-cols-[7fr_5fr] lg:gap-16">
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
              <Button href="/signup">Join the Beta</Button>
              <Button href="/solutions/food-and-beverage" variant="secondary" showArrow>
                See the Food &amp; Beverage Solution
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="relative aspect-[4/5] w-full max-w-[380px] justify-self-center overflow-hidden rounded-mkt-xl shadow-mkt-card lg:justify-self-end">
            <Image
              src="/images/Food_truck_1.png"
              alt="A food truck owner serving customers"
              fill
              sizes="(min-width: 1024px) 380px, 80vw"
              className="object-cover"
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
