import Image from "next/image";
import { Container, ProseWidth } from "@/components/marketing/ui/Container";
import { Eyebrow } from "@/components/marketing/ui/Eyebrow";
import { Reveal } from "@/components/marketing/ui/Reveal";
import { MockupFrame } from "@/components/marketing/product/MockupFrame";
import { sectionHeadline } from "@/components/marketing/ui/typography";
import type { helpCenterEntries } from "@/content/help-center";

type Entry = (typeof helpCenterEntries)[number];

// One Help Center guide — same grid/spacing/Reveal pattern as the homepage
// and Product page's ShowcaseSection, with a numbered step list in place of
// a single paragraph + CTA (there's nothing to link out to; the steps are
// the whole explanation), and real screenshots instead of illustrative
// mockups.
export function HelpCenterEntry({
  entry,
  mockupSide = "right",
  background = "primary",
}: {
  entry: Entry;
  mockupSide?: "left" | "right";
  background?: "primary" | "secondary";
}) {
  return (
    <section
      className={
        background === "secondary" ? "bg-mkt-bg-secondary py-[5.5rem] md:py-40" : "py-[5.5rem] md:py-40"
      }
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className={mockupSide === "left" ? "lg:order-2" : ""}>
            <ProseWidth>
              <Eyebrow>{entry.label}</Eyebrow>
              <h2 className={`${sectionHeadline} mt-4 text-mkt-text-primary`}>{entry.title}</h2>
            </ProseWidth>

            <ol className="mt-6 flex max-w-[480px] flex-col gap-3.5">
              {entry.steps.map((step, index) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-teal-light text-xs font-bold text-brand-teal">
                    {index + 1}
                  </span>
                  <span className="text-base leading-relaxed text-mkt-text-secondary">{step}</span>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal
            delay={0.1}
            className={`flex justify-center ${mockupSide === "left" ? "lg:order-1 lg:justify-start" : "lg:justify-end"}`}
          >
            <MockupFrame label={entry.label} className="max-w-[420px]">
              {entry.images.map((image, index) => (
                <Image
                  key={image.src}
                  src={`/help-center/screenshots/${image.src}`}
                  alt={`${entry.label} screenshot`}
                  width={image.width}
                  height={image.height}
                  className={`block h-auto w-full ${index > 0 ? "border-t border-mkt-border-light" : ""}`}
                />
              ))}
            </MockupFrame>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
