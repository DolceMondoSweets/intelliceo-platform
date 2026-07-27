import type { Metadata } from "next";
import { AboutProblem } from "@/components/marketing/sections/about/AboutProblem";
import { AboutWhyGapExists } from "@/components/marketing/sections/about/AboutWhyGapExists";
import { AboutMission } from "@/components/marketing/sections/about/AboutMission";
import { AboutRealExperience } from "@/components/marketing/sections/about/AboutRealExperience";
import { AboutVision } from "@/components/marketing/sections/about/AboutVision";
import { AboutContactCTA } from "@/components/marketing/sections/about/AboutContactCTA";

export const metadata: Metadata = {
  title: "About — IntelliCEO",
  description:
    "IntelliCEO exists to give independent business owners access to the clarity, expertise, and operating discipline normally available only to much larger companies.",
};

export default function AboutPage() {
  return (
    <>
      <AboutProblem />
      <AboutWhyGapExists />
      <AboutMission />
      <AboutRealExperience />
      <AboutVision />
      <AboutContactCTA />
    </>
  );
}
