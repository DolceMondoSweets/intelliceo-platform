import Image from "next/image";
import { Container, ProseWidth } from "@/components/marketing/ui/Container";
import { Eyebrow } from "@/components/marketing/ui/Eyebrow";
import { Reveal } from "@/components/marketing/ui/Reveal";
import { pageHeadline } from "@/components/marketing/ui/typography";
import { securityHero } from "@/content/security";

export function SecurityHero() {
  return (
    <section className="bg-mkt-bg-primary py-[5.5rem] md:py-40">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[7fr_5fr] lg:gap-16">
          <Reveal>
            <ProseWidth large>
              <Eyebrow>{securityHero.eyebrow}</Eyebrow>
              <h1 className={`${pageHeadline} mt-4 text-mkt-text-primary`}>
                {securityHero.headline}
              </h1>
              <p className="mt-5 max-w-[680px] text-xl leading-relaxed text-mkt-text-secondary">
                {securityHero.copy}
              </p>
            </ProseWidth>
          </Reveal>

          <Reveal delay={0.1} className="relative aspect-[4/5] w-full max-w-[380px] justify-self-center overflow-hidden rounded-mkt-xl shadow-mkt-card lg:justify-self-end">
            <Image
              src="/images/Waiter_1.png"
              alt="A waiter serving a table at an outdoor restaurant"
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
