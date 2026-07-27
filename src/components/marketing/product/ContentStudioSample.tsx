import { BookmarkCheck, Megaphone, Sparkles } from "lucide-react";
import { MockupFrame } from "./MockupFrame";

// The Content Studio mockup — the simple input alongside the generated
// output, reinforcing that it's fast and grounded in the real business
// rather than generic AI filler. Parameterized (content type/platform/
// topic/output) so the same real UI pattern can show different real
// content types — Platform only renders when provided, matching the real
// product (platform picker only shows for Social Media Post).
export function ContentStudioSample({
  businessName = "Bluebird Coffee Co.",
  contentType = "Social Media Post",
  platform,
  topic = "Seasonal pumpkin spice latte",
  outputLabel = "Generated caption",
  generatedContent = "Meet our Seasonal Pumpkin Spice Latte ☕ — real espresso, house-made spice blend, and a silky oat milk swirl. Back for the season, only through October. Come cozy up with us.",
}: {
  businessName?: string;
  contentType?: string;
  platform?: string;
  topic?: string;
  outputLabel?: string;
  generatedContent?: string;
}) {
  return (
    <div className="w-full max-w-[480px]">
      <MockupFrame label={`Content Studio · ${businessName}`}>
        <div className="p-6 sm:p-8">
          {/* The input */}
          <div className="flex flex-col gap-3 rounded-mkt-md bg-mkt-bg-secondary p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-brand-gold" strokeWidth={1.75} />
              <span className="text-xs font-semibold uppercase tracking-[0.06em] text-mkt-text-muted">
                Content Studio
              </span>
            </div>
            <div className={`grid gap-2 text-xs ${platform ? "grid-cols-2" : "grid-cols-1"}`}>
              <div className="rounded-mkt-sm border border-mkt-border-medium bg-mkt-surface-white px-3 py-2">
                <span className="block text-mkt-text-muted">Content type</span>
                <span className="font-medium text-mkt-text-primary">{contentType}</span>
              </div>
              {platform && (
                <div className="rounded-mkt-sm border border-mkt-border-medium bg-mkt-surface-white px-3 py-2">
                  <span className="block text-mkt-text-muted">Platform</span>
                  <span className="font-medium text-mkt-text-primary">{platform}</span>
                </div>
              )}
            </div>
            <div className="rounded-mkt-sm border border-mkt-border-medium bg-mkt-surface-white px-3 py-2 text-xs">
              <span className="block text-mkt-text-muted">Topic</span>
              <span className="font-medium text-mkt-text-primary">{topic}</span>
            </div>
          </div>

          {/* The output */}
          <div className="mt-4 rounded-mkt-md border border-mkt-border-light p-4">
            <div className="flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-brand-teal" strokeWidth={1.75} />
              <span className="text-xs font-medium text-mkt-text-muted">{outputLabel}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-mkt-text-primary">
              {generatedContent}
            </p>
          </div>

          {/* Saved-to-library footer — reflects the real "save your favorite
              drafts" feature, not a new capability. */}
          <div className="mt-4 flex items-center gap-2 text-xs text-mkt-text-muted">
            <BookmarkCheck className="h-3.5 w-3.5 text-brand-teal" strokeWidth={1.75} />
            Saved to your Content Library
          </div>
        </div>
      </MockupFrame>
    </div>
  );
}
