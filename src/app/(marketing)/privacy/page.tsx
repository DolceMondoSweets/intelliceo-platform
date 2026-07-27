import type { Metadata } from "next";
import { PrivacyPolicyContent } from "@/components/marketing/sections/legal/PrivacyPolicyContent";

export const metadata: Metadata = {
  title: "Privacy Policy — IntelliCEO",
  description:
    "What information IntelliCEO collects, how it's used, who it's shared with, and the choices you have.",
};

export default function PrivacyPage() {
  return <PrivacyPolicyContent />;
}
