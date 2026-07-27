import type { Metadata } from "next";
import { Hero } from "@/components/marketing/sections/Hero";
import { RecognitionStrip } from "@/components/marketing/sections/RecognitionStrip";
import { ProblemSection } from "@/components/marketing/sections/ProblemSection";
import { MeetIntelliCEO } from "@/components/marketing/sections/MeetIntelliCEO";
import { CompetitiveDifference } from "@/components/marketing/sections/CompetitiveDifference";
import { HowItWorks } from "@/components/marketing/sections/HowItWorks";
import { CEOBriefShowcase } from "@/components/marketing/sections/CEOBriefShowcase";
import { FinancialVisibilityShowcase } from "@/components/marketing/sections/FinancialVisibilityShowcase";
import { AIAdvisorShowcase } from "@/components/marketing/sections/AIAdvisorShowcase";
import { ContentStudioShowcase } from "@/components/marketing/sections/ContentStudioShowcase";
import { FoodBeverageSolution } from "@/components/marketing/sections/FoodBeverageSolution";
import { Differentiation } from "@/components/marketing/sections/Differentiation";
import { SecuritySection } from "@/components/marketing/sections/SecuritySection";
import { EarlyAccessSection } from "@/components/marketing/sections/EarlyAccessSection";
import { FAQSection } from "@/components/marketing/sections/FAQSection";
import { FinalCTA } from "@/components/marketing/sections/FinalCTA";

export const metadata: Metadata = {
  title: "IntelliCEO — Run Smarter",
  description:
    "IntelliCEO gives independent business owners financial clarity, executive guidance, and operational discipline to make better decisions and build stronger businesses.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <RecognitionStrip />
      <ProblemSection />
      <MeetIntelliCEO />
      <CompetitiveDifference />
      <HowItWorks />
      <CEOBriefShowcase />
      <FinancialVisibilityShowcase />
      <AIAdvisorShowcase />
      <ContentStudioShowcase />
      <FoodBeverageSolution />
      <Differentiation />
      <SecuritySection />
      <EarlyAccessSection />
      <FAQSection />
      <FinalCTA />
    </>
  );
}
