import { Manrope } from "next/font/google";
import { MarketingHeader } from "@/components/marketing/layout/MarketingHeader";
import { MarketingFooter } from "@/components/marketing/layout/MarketingFooter";

// Manrope is the confirmed permanent typeface for the marketing site (matches
// the finalized logo, which was itself set in Manrope) — scoped to this route
// group only, since the existing product app keeps its own Geist setup.
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${manrope.variable} font-marketing flex min-h-full flex-col bg-mkt-bg-primary text-mkt-text-primary`}>
      <MarketingHeader />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}
