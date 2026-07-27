import {
  ChartNoAxesCombined,
  ClipboardCheck,
  CircleDollarSign,
  Store,
  Target,
  WalletCards,
} from "lucide-react";
import { Container, ProseWidth } from "@/components/marketing/ui/Container";
import { Button } from "@/components/marketing/ui/Button";
import { Reveal } from "@/components/marketing/ui/Reveal";
import { sectionHeadline } from "@/components/marketing/ui/typography";

// Section 10 (Food & Beverage Solution) — brief-verbatim headline/copy/CTA
// from the correction document. Metrics list is the corrected, real-only
// list — no waste, inventory, hourly sales, contribution margin, repeat
// customer rate, or average order value.
const metrics = [
  { label: "Food cost percentage", icon: CircleDollarSign },
  { label: "Labor cost percentage", icon: WalletCards },
  { label: "Prime cost", icon: ChartNoAxesCombined },
  { label: "Revenue (via Square or Clover)", icon: Store },
  { label: "Budget vs. actual", icon: ClipboardCheck },
  { label: "Break-even point", icon: Target },
];

export function FoodBeverageSolution() {
  return (
    <section className="bg-brand-gold-light py-[5.5rem] md:py-40">
      <Container>
        <Reveal>
          <ProseWidth large>
            <h2 className={`${sectionHeadline} text-mkt-text-primary`}>
              Intelligence that understands the realities behind the counter.
            </h2>
            <p className="mt-5 text-xl leading-relaxed text-mkt-text-secondary">
              IntelliCEO is built around the daily realities of independent food &amp; beverage
              businesses — cash flow, food cost, labor, and the margin pressure that can erode a
              business quietly if no one&apos;s watching.
            </p>
          </ProseWidth>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-mkt-md border border-mkt-border-light bg-mkt-surface-white p-5"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-mkt-sm bg-brand-teal-light text-brand-teal">
                <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
              </span>
              <span className="text-sm font-medium text-mkt-text-primary">{label}</span>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Button href="/solutions/food-and-beverage" showArrow>
            Explore Food &amp; Beverage
          </Button>
        </div>
      </Container>
    </section>
  );
}
