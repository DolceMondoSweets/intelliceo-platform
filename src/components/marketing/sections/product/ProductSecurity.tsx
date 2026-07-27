import { Container, ProseWidth } from "@/components/marketing/ui/Container";
import { Button } from "@/components/marketing/ui/Button";
import { Eyebrow } from "@/components/marketing/ui/Eyebrow";
import { Reveal } from "@/components/marketing/ui/Reveal";
import { sectionHeadline } from "@/components/marketing/ui/typography";
import { securitySection } from "@/content/product";

// Security — brief summary only; the full detail lives on the dedicated
// /security page. Copy matches the homepage's securitySection exactly for
// consistency (same real facts: RLS tenant isolation, encryption in
// transit, Stripe handles payments).
export function ProductSecurity() {
  return (
    <section className="py-[5.5rem] md:py-40">
      <Container>
        <Reveal>
          <ProseWidth>
            <Eyebrow>{securitySection.eyebrow}</Eyebrow>
            <h2 className={`${sectionHeadline} mt-4 text-mkt-text-primary`}>
              {securitySection.headline}
            </h2>
            <p className="mt-5 text-xl leading-relaxed text-mkt-text-secondary">
              {securitySection.copy}
            </p>
            <div className="mt-8">
              <Button href="/security" variant="secondary" showArrow>
                {securitySection.ctaLabel}
              </Button>
            </div>
          </ProseWidth>
        </Reveal>
      </Container>
    </section>
  );
}
