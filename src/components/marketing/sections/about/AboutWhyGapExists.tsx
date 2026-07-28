import Image from "next/image";
import { DollarSign, Layers, Lock } from "lucide-react";
import { Container, ProseWidth } from "@/components/marketing/ui/Container";
import { Reveal } from "@/components/marketing/ui/Reveal";
import { SpotlightCard } from "@/components/marketing/ui/SpotlightCard";
import { sectionHeadline } from "@/components/marketing/ui/typography";
import { whyGapExistsSection } from "@/content/about";

const icons = { DollarSign, Layers, Lock };

export function AboutWhyGapExists() {
  return (
    <section className="bg-mkt-bg-secondary py-[5.5rem] md:py-40">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[7fr_5fr] lg:gap-16">
          <Reveal>
            <ProseWidth large>
              <h2 className={`${sectionHeadline} text-mkt-text-primary`}>
                {whyGapExistsSection.headline}
              </h2>
              <p className="mt-5 text-xl leading-relaxed text-mkt-text-secondary">
                {whyGapExistsSection.copy}
              </p>
            </ProseWidth>
          </Reveal>

          <Reveal delay={0.1} className="relative aspect-[4/5] w-full max-w-[380px] justify-self-center overflow-hidden rounded-mkt-xl shadow-mkt-card lg:justify-self-end">
            <Image
              src="/images/coffee_owner_smiling_2.png"
              alt="A restaurant owner smiling while serving a table"
              fill
              sizes="(min-width: 1024px) 380px, 80vw"
              className="object-cover"
            />
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {whyGapExistsSection.points.map((point) => {
            const Icon = icons[point.icon as keyof typeof icons];
            return (
              <SpotlightCard
                key={point.title}
                className="rounded-mkt-lg border border-mkt-border-light bg-mkt-surface-white p-6"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-mkt-md bg-brand-teal-light text-brand-teal">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h3 className="mt-4 text-base font-semibold text-mkt-text-primary">
                  {point.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-mkt-text-secondary">
                  {point.description}
                </p>
              </SpotlightCard>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
