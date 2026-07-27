import type { Metadata } from "next";
import { PricingHero } from "@/components/marketing/sections/pricing/PricingHero";
import { PricingEarlyAccessFraming } from "@/components/marketing/sections/pricing/PricingEarlyAccessFraming";
import { PricingPlans } from "@/components/marketing/sections/pricing/PricingPlans";
import { PricingWhatsIncluded } from "@/components/marketing/sections/pricing/PricingWhatsIncluded";
import { PricingFutureExpectations } from "@/components/marketing/sections/pricing/PricingFutureExpectations";
import { PricingFAQ } from "@/components/marketing/sections/pricing/PricingFAQ";
import { PricingBetaCTA } from "@/components/marketing/sections/pricing/PricingBetaCTA";

export const metadata: Metadata = {
  title: "Pricing — IntelliCEO",
  description:
    "Simple, transparent pricing for independent food & beverage businesses — Starter and Growth plans, both with a 7-day free trial.",
};

export default function PricingPage() {
  return (
    <>
      <PricingHero />
      <PricingEarlyAccessFraming />
      <PricingPlans />
      <PricingWhatsIncluded />
      <PricingFutureExpectations />
      <PricingFAQ />
      <PricingBetaCTA />
    </>
  );
}
