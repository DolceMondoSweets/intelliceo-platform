import type { Metadata } from "next";
import { SecurityHero } from "@/components/marketing/sections/security/SecurityHero";
import { SecurityDataEncryption } from "@/components/marketing/sections/security/SecurityDataEncryption";
import { SecurityAuth } from "@/components/marketing/sections/security/SecurityAuth";
import { SecurityFinancialData } from "@/components/marketing/sections/security/SecurityFinancialData";
import { SecurityDataOwnership } from "@/components/marketing/sections/security/SecurityDataOwnership";
import { SecurityAIDataUsage } from "@/components/marketing/sections/security/SecurityAIDataUsage";
import { SecurityThirdPartyServices } from "@/components/marketing/sections/security/SecurityThirdPartyServices";
import { SecurityDataRetention } from "@/components/marketing/sections/security/SecurityDataRetention";
import { SecurityResponsibleDisclosure } from "@/components/marketing/sections/security/SecurityResponsibleDisclosure";
import { SecurityContact } from "@/components/marketing/sections/security/SecurityContact";

export const metadata: Metadata = {
  title: "Security — IntelliCEO",
  description:
    "How IntelliCEO protects your business data — tenant isolation, authentication, payment handling, AI data usage, and how to report a vulnerability.",
};

export default function SecurityPage() {
  return (
    <>
      <SecurityHero />
      <SecurityDataEncryption />
      <SecurityAuth />
      <SecurityFinancialData />
      <SecurityDataOwnership />
      <SecurityAIDataUsage />
      <SecurityThirdPartyServices />
      <SecurityDataRetention />
      <SecurityResponsibleDisclosure />
      <SecurityContact />
    </>
  );
}
