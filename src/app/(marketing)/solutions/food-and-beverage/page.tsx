import type { Metadata } from "next";
import { FBPageHero } from "@/components/marketing/sections/food-beverage/FBPageHero";
import { FBBuiltFor } from "@/components/marketing/sections/food-beverage/FBBuiltFor";
import { FBChallenges } from "@/components/marketing/sections/food-beverage/FBChallenges";
import { FBFinancialVisibility } from "@/components/marketing/sections/food-beverage/FBFinancialVisibility";
import { FBOperationalVisibility } from "@/components/marketing/sections/food-beverage/FBOperationalVisibility";
import { FBAIAdvisor } from "@/components/marketing/sections/food-beverage/FBAIAdvisor";
import { FBUseCases } from "@/components/marketing/sections/food-beverage/FBUseCases";
import { FBWhySpecialization } from "@/components/marketing/sections/food-beverage/FBWhySpecialization";
import { FBFinalCTA } from "@/components/marketing/sections/food-beverage/FBFinalCTA";

export const metadata: Metadata = {
  title: "Food & Beverage Solutions — IntelliCEO",
  description:
    "Financial clarity, operational guidance, and executive intelligence for independent food and beverage businesses.",
};

export default function FoodAndBeveragePage() {
  return (
    <>
      <FBPageHero />
      <FBBuiltFor />
      <FBChallenges />
      <FBFinancialVisibility />
      <FBOperationalVisibility />
      <FBAIAdvisor />
      <FBUseCases />
      <FBWhySpecialization />
      <FBFinalCTA />
    </>
  );
}
