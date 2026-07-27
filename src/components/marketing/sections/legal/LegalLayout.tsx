import { Container, ProseWidth } from "@/components/marketing/ui/Container";
import { Eyebrow } from "@/components/marketing/ui/Eyebrow";
import { Reveal } from "@/components/marketing/ui/Reveal";
import { pageHeadline } from "@/components/marketing/ui/typography";

// Shared wrapper for /privacy and /terms — long-form legal documents read
// as a single continuous article rather than the stacked marketing
// "sections" used elsewhere on the site, so there's no Reveal-per-section
// scroll choreography here beyond the header.
export function LegalLayout({
  eyebrow,
  title,
  lastUpdated,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  lastUpdated: string;
  intro: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="py-[5.5rem] md:py-40">
      <Container>
        <Reveal>
          <ProseWidth large>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className={`${pageHeadline} mt-4 text-mkt-text-primary`}>{title}</h1>
            <p className="mt-4 text-sm text-mkt-text-muted">Last Updated: {lastUpdated}</p>
            <div className="mt-8 text-xl leading-relaxed text-mkt-text-secondary">{intro}</div>
          </ProseWidth>
        </Reveal>

        <ProseWidth large className="mt-16 flex flex-col gap-14">
          {children}
        </ProseWidth>
      </Container>
    </section>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-[-0.02em] text-mkt-text-primary md:text-[1.75rem]">
        {heading}
      </h2>
      <div className="mt-4 flex flex-col gap-4 text-base leading-relaxed text-mkt-text-secondary">
        {children}
      </div>
    </div>
  );
}
