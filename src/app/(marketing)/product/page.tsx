import type { Metadata } from "next";
import { ProductPageHero } from "@/components/marketing/sections/product/ProductPageHero";
import { ProductCEOBrief } from "@/components/marketing/sections/product/ProductCEOBrief";
import { ProductFinancialVisibility } from "@/components/marketing/sections/product/ProductFinancialVisibility";
import { ProductAIAdvisor } from "@/components/marketing/sections/product/ProductAIAdvisor";
import { ProductGoalsAndDecisions } from "@/components/marketing/sections/product/ProductGoalsAndDecisions";
import { ProductContentStudio } from "@/components/marketing/sections/product/ProductContentStudio";
import { ProductIntegrations } from "@/components/marketing/sections/product/ProductIntegrations";
import { ProductSecurity } from "@/components/marketing/sections/product/ProductSecurity";
import { ProductFAQ } from "@/components/marketing/sections/product/ProductFAQ";
import { ProductBetaCTA } from "@/components/marketing/sections/product/ProductBetaCTA";

export const metadata: Metadata = {
  title: "Product — IntelliCEO",
  description:
    "Financial visibility, an AI business advisor, operational discipline, and content creation — everything IntelliCEO gives independent food & beverage businesses in one place.",
};

export default function ProductPage() {
  return (
    <>
      <ProductPageHero />
      <ProductCEOBrief />
      <ProductFinancialVisibility />
      <ProductAIAdvisor />
      <ProductGoalsAndDecisions />
      <ProductContentStudio />
      <ProductIntegrations />
      <ProductSecurity />
      <ProductFAQ />
      <ProductBetaCTA />
    </>
  );
}
