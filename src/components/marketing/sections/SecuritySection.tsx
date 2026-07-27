import { LockKeyhole, ShieldCheck } from "lucide-react";
import { Container, ProseWidth } from "@/components/marketing/ui/Container";
import { Eyebrow } from "@/components/marketing/ui/Eyebrow";
import { Reveal } from "@/components/marketing/ui/Reveal";
import { SpotlightCard } from "@/components/marketing/ui/SpotlightCard";
import { sectionHeadline } from "@/components/marketing/ui/typography";
import { securitySection } from "@/content/homepage";

// Section 11 (Security) — DRAFTED. Deliberately avoids unverified
// compliance claims (SOC 2, HIPAA, PCI) per the correction document's
// explicit direction to keep this section accurate as-is.
export function SecuritySection() {
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
          </ProseWidth>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {securitySection.points.map((point, index) => (
            <SpotlightCard
              key={point.title}
              className="rounded-mkt-lg border border-mkt-border-light bg-mkt-surface-white p-6"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-mkt-md bg-brand-teal-light text-brand-teal">
                {index === 0 ? (
                  <ShieldCheck className="h-5 w-5" strokeWidth={1.75} />
                ) : (
                  <LockKeyhole className="h-5 w-5" strokeWidth={1.75} />
                )}
              </span>
              <h3 className="mt-4 text-base font-semibold text-mkt-text-primary">{point.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-mkt-text-secondary">
                {point.description}
              </p>
            </SpotlightCard>
          ))}
        </div>
      </Container>
    </section>
  );
}
