import type { ReactNode } from "react";
import { Container } from "@/components/marketing/ui/Container";
import { Eyebrow } from "@/components/marketing/ui/Eyebrow";
import { Button } from "@/components/marketing/ui/Button";
import { Reveal } from "@/components/marketing/ui/Reveal";
import { sectionHeadline } from "@/components/marketing/ui/typography";

// Shared layout for the four product showcases (CEO Brief, Financial
// Visibility, AI Advisor, Content Studio) — same visual treatment and
// prominence for all four, alternating image side for rhythm without
// becoming inconsistent (Section 25 / Design Quality Checklist).
export function ShowcaseSection({
  eyebrow,
  headline,
  copy,
  note,
  ctaLabel,
  ctaHref,
  mockup,
  mockupSide = "right",
  background = "primary",
  id,
}: {
  eyebrow?: string;
  headline: string;
  copy: string;
  note?: string;
  ctaLabel: string;
  ctaHref: string;
  mockup: ReactNode;
  mockupSide?: "left" | "right";
  background?: "primary" | "secondary";
  id?: string;
}) {
  return (
    <section
      id={id}
      className={
        background === "secondary"
          ? "bg-mkt-bg-secondary py-[5.5rem] md:py-40"
          : "py-[5.5rem] md:py-40"
      }
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className={mockupSide === "left" ? "lg:order-2" : ""}>
            {eyebrow && (
              <div className="mb-4">
                <Eyebrow>{eyebrow}</Eyebrow>
              </div>
            )}
            <h2 className={`${sectionHeadline} text-mkt-text-primary`}>{headline}</h2>
            <p className="mt-5 max-w-[520px] text-xl leading-relaxed text-mkt-text-secondary">
              {copy}
            </p>
            {note && <p className="mt-4 text-sm italic text-mkt-text-muted">{note}</p>}
            <div className="mt-8">
              <Button href={ctaHref} variant="secondary" showArrow>
                {ctaLabel}
              </Button>
            </div>
          </Reveal>

          <Reveal
            delay={0.1}
            className={`flex justify-center ${mockupSide === "left" ? "lg:order-1 lg:justify-start" : "lg:justify-end"}`}
          >
            {mockup}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
