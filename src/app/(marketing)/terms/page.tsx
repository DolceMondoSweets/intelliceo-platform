import type { Metadata } from "next";
import { TermsOfServiceContent } from "@/components/marketing/sections/legal/TermsOfServiceContent";

export const metadata: Metadata = {
  title: "Terms of Service — IntelliCEO",
  description:
    "The terms governing your access to and use of the IntelliCEO platform.",
};

export default function TermsPage() {
  return <TermsOfServiceContent />;
}
