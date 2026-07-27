import { Container, ProseWidth } from "@/components/marketing/ui/Container";
import { Reveal } from "@/components/marketing/ui/Reveal";
import { sectionHeadline } from "@/components/marketing/ui/typography";
import { howItWorksSteps } from "@/content/homepage";

export function HowItWorks() {
  return (
    <section className="py-[5.5rem] md:py-40">
      <Container>
        <Reveal>
          <ProseWidth>
            <h2 className={`${sectionHeadline} text-mkt-text-primary`}>How it works.</h2>
          </ProseWidth>
        </Reveal>

        <div className="mt-14 flex flex-col">
          {howItWorksSteps.map((item, index) => (
            <div
              key={item.step}
              className={`grid grid-cols-[auto_1fr] gap-6 py-8 ${
                index !== howItWorksSteps.length - 1 ? "border-b border-mkt-border-light" : ""
              }`}
            >
              <span className="text-[clamp(2rem,3vw,2.75rem)] font-bold tracking-[-0.03em] text-brand-teal-muted">
                {item.step}
              </span>
              <div>
                <h3 className="text-[1.35rem] font-[650] leading-tight tracking-[-0.02em] text-mkt-text-primary">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-[560px] text-base leading-relaxed text-mkt-text-secondary">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
