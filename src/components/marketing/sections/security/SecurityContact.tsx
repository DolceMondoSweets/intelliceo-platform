import { Container, ProseWidth } from "@/components/marketing/ui/Container";
import { Button } from "@/components/marketing/ui/Button";
import { Reveal } from "@/components/marketing/ui/Reveal";
import { sectionHeadline } from "@/components/marketing/ui/typography";
import { securityContactSection } from "@/content/security";

// Closing section — reuses the dark-teal emphasis treatment established by
// EarlyAccessSection/PricingEarlyAccessFraming for the page's final,
// most-actionable moment.
export function SecurityContact() {
  return (
    <section className="bg-brand-teal-deep py-[5.5rem] text-white md:py-40">
      <Container>
        <Reveal>
          <ProseWidth large>
            <h2 className={`${sectionHeadline} text-white`}>{securityContactSection.headline}</h2>
            <p className="mt-5 text-xl leading-relaxed text-white/75">
              {securityContactSection.copy}
            </p>
          </ProseWidth>

          <div className="mt-8">
            <Button href={`mailto:${securityContactSection.email}`} variant="gold">
              {securityContactSection.email}
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
