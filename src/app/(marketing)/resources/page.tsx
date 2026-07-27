import type { Metadata } from "next";
import { ResourcesHero } from "@/components/marketing/sections/resources/ResourcesHero";
import { HelpCenterGuide } from "@/components/marketing/sections/resources/HelpCenterGuide";

export const metadata: Metadata = {
  title: "Help Center — IntelliCEO",
  description:
    "Real screenshots and short, clear steps for everything in IntelliCEO — sign up, the Dashboard, CEO Brief, Vital Signs, Decisions Log, Goals, POS Integration, Content Studio, and Chat.",
};

export default function ResourcesPage() {
  return (
    <>
      <ResourcesHero />
      <HelpCenterGuide />
    </>
  );
}
