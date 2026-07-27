import { Container } from "@/components/marketing/ui/Container";
import { Button } from "@/components/marketing/ui/Button";
import { Reveal } from "@/components/marketing/ui/Reveal";
import { sectionHeadline } from "@/components/marketing/ui/typography";
import { contactCtaSection } from "@/content/about";

// Reuses the site's Final CTA pattern exactly, single button to /contact.
export function AboutContactCTA() {
  return (
    <section className="py-[5.5rem] md:py-40">
      <Container>
        <Reveal className="flex flex-col items-center rounded-mkt-xl bg-mkt-bg-secondary px-6 py-16 text-center md:py-24">
          <h2 className={`${sectionHeadline} max-w-[720px] text-mkt-text-primary`}>
            {contactCtaSection.headline}
          </h2>
          <p className="mt-4 max-w-[520px] text-xl text-mkt-text-secondary">
            {contactCtaSection.copy}
          </p>
          <div className="mt-8">
            <Button href="/contact">{contactCtaSection.ctaLabel}</Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
