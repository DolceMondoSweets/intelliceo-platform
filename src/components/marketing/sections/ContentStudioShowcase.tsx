import { ShowcaseSection } from "./ShowcaseSection";
import { ContentStudioSample } from "@/components/marketing/product/ContentStudioSample";

// Section 9 (NEW) — Content Studio Showcase. Fully brief-verbatim from the
// correction document. Same visual treatment/prominence as the other three
// showcases, positioned after AI Advisor and before Food & Beverage.
export function ContentStudioShowcase() {
  return (
    <ShowcaseSection
      eyebrow="MARKETING, HANDLED"
      headline="Real marketing content, without a marketing team."
      copy="IntelliCEO writes ready-to-use marketing content grounded in your actual business — social posts, email campaigns, promotional announcements, and more. No blank page, no generic templates, no marketing hire required."
      note="Save your favorite drafts and build a library of content over time."
      ctaLabel="See Content Studio in Action"
      ctaHref="/product#content-studio"
      mockup={<ContentStudioSample />}
      mockupSide="left"
      background="secondary"
    />
  );
}
