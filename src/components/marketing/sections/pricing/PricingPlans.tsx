import { Check } from "lucide-react";
import { Container } from "@/components/marketing/ui/Container";
import { Button } from "@/components/marketing/ui/Button";
import { Reveal } from "@/components/marketing/ui/Reveal";
import { SpotlightCard } from "@/components/marketing/ui/SpotlightCard";
import { plans, trialNote } from "@/content/pricing";

// Plans & Pricing — side-by-side comparison. Both cards get equal visual
// weight (no "recommended" styling): Growth isn't a strict upgrade for
// every business, since it's only available to Square/Clover users, so
// pushing it as "the better choice" for everyone would misrepresent that.
export function PricingPlans() {
  return (
    <section className="py-[5.5rem] md:py-40">
      <Container>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {plans.map((plan, index) => (
            <Reveal key={plan.name} delay={index * 0.1}>
              <SpotlightCard className="flex h-full flex-col rounded-mkt-xl border border-mkt-border-light bg-mkt-surface-white p-8 shadow-mkt-card">
                <h2 className="text-2xl font-bold text-mkt-text-primary">{plan.name}</h2>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-[clamp(2.5rem,4vw,3.25rem)] font-bold tracking-[-0.03em] text-mkt-text-primary">
                    {plan.price}
                  </span>
                  <span className="text-base font-medium text-mkt-text-muted">{plan.cadence}</span>
                </div>
                <p className="mt-3 text-base leading-relaxed text-mkt-text-secondary">
                  {plan.description}
                </p>

                <div className="mt-6">
                  <Button href={`/signup?plan=${plan.tier}`} className="w-full sm:w-auto">
                    {plan.ctaLabel}
                  </Button>
                </div>

                <div className="mt-8 border-t border-mkt-border-light pt-6">
                  <span className="text-xs font-semibold uppercase tracking-[0.06em] text-mkt-text-muted">
                    {plan.featuresIntro}
                  </span>
                  <ul className="mt-4 flex flex-col gap-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mkt-success-bg text-mkt-success">
                          <Check className="h-3 w-3" strokeWidth={2.5} />
                        </span>
                        <span className="text-sm leading-snug text-mkt-text-secondary">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.availabilityNote && (
                  <p className="mt-6 text-xs leading-relaxed text-mkt-text-muted">
                    {plan.availabilityNote}
                  </p>
                )}
              </SpotlightCard>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-mkt-text-muted">{trialNote}</p>
      </Container>
    </section>
  );
}
