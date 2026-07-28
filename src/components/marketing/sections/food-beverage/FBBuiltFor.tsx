import Image from "next/image";
import { Coffee, Croissant, Store, Truck, Utensils } from "lucide-react";
import { Container, ProseWidth } from "@/components/marketing/ui/Container";
import { Reveal } from "@/components/marketing/ui/Reveal";
import { SpotlightCard } from "@/components/marketing/ui/SpotlightCard";
import { sectionHeadline } from "@/components/marketing/ui/typography";
import { builtForTypes } from "@/content/solutions";

const iconMap = { Coffee, Utensils, Croissant, Truck, Store };

// "Who IntelliCEO Is Built For" — F&B only for V1, matching the homepage
// RecognitionStrip's business-type list exactly.
export function FBBuiltFor() {
  return (
    <section className="bg-mkt-bg-secondary py-[5.5rem] md:py-40">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[7fr_5fr] lg:gap-16">
          <Reveal>
            <ProseWidth>
              <h2 className={`${sectionHeadline} text-mkt-text-primary`}>
                Who IntelliCEO is built for.
              </h2>
            </ProseWidth>
          </Reveal>

          <Reveal delay={0.1} className="relative aspect-[4/5] w-full max-w-[380px] justify-self-center overflow-hidden rounded-mkt-xl shadow-mkt-card lg:justify-self-end">
            <Image
              src="/images/owner_on_cellphone.png"
              alt="A business owner checking her phone while packing an order"
              fill
              sizes="(min-width: 1024px) 380px, 80vw"
              className="object-cover"
            />
          </Reveal>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {builtForTypes.map((type) => {
            const Icon = iconMap[type.icon as keyof typeof iconMap];
            return (
              <SpotlightCard
                key={type.label}
                className="flex flex-col items-center gap-3 rounded-mkt-lg border border-mkt-border-light bg-mkt-surface-white p-6 text-center shadow-mkt-card"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-mkt-md bg-brand-teal-light text-brand-teal">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <span className="text-sm font-medium text-mkt-text-primary">{type.label}</span>
              </SpotlightCard>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
