import { LogoIcon } from "@/components/marketing/brand/Logo";
import { MockupFrame } from "./MockupFrame";

// A clean conversational exchange, not a decision-memo — this matches the
// real Chat interface's persistent, top-pinned Ask bar. Grounded in what
// Chat actually does: answers using real data + remembered conversation
// history, not structured scenario-modeling. A second turn is shown so the
// exchange reads as a real conversation, not a single canned Q&A.
export function AdvisorResponse({
  businessName = "Bluebird Coffee Co.",
}: {
  businessName?: string;
}) {
  return (
    <div className="w-full max-w-[520px]">
      <MockupFrame label={`IntelliCEO · ${businessName}`}>
        {/* Ask bar, matching the product's actual persistent top bar */}
        <div className="flex items-center gap-2 border-b border-mkt-border-light bg-mkt-bg-secondary px-4 py-3">
          <div className="flex-1 rounded-full border border-mkt-border-medium bg-mkt-surface-white px-4 py-2 text-sm text-mkt-text-muted">
            Ask anything about your business…
          </div>
        </div>

        <div className="flex flex-col gap-4 p-6">
          {/* Owner question */}
          <div className="flex justify-end">
            <div className="max-w-[85%] rounded-mkt-md rounded-tr-sm bg-mkt-bg-secondary px-4 py-2.5">
              <p className="text-sm text-mkt-text-primary">
                How&apos;s my margin looking compared to last month?
              </p>
            </div>
          </div>

          {/* IntelliCEO response */}
          <div className="flex items-start gap-2.5">
            <LogoIcon size={28} className="mt-0.5 shrink-0" />
            <div className="max-w-[90%] rounded-mkt-md rounded-tl-sm border border-mkt-border-light bg-mkt-surface-white px-4 py-3">
              <p className="text-sm leading-relaxed text-mkt-text-primary">
                Your prime cost is currently <span className="font-semibold">67%</span>, up from{" "}
                <span className="font-semibold">61%</span> last month — mainly driven by the labor
                cost increase you mentioned when we talked about adding weekend staff. That&apos;s
                above the healthy 60-65% range for a business your size. Want to look at where the
                increase is coming from?
              </p>
            </div>
          </div>

          {/* Owner follow-up */}
          <div className="flex justify-end">
            <div className="max-w-[85%] rounded-mkt-md rounded-tr-sm bg-mkt-bg-secondary px-4 py-2.5">
              <p className="text-sm text-mkt-text-primary">What should I do about it?</p>
            </div>
          </div>

          {/* IntelliCEO follow-up response */}
          <div className="flex items-start gap-2.5">
            <LogoIcon size={28} className="mt-0.5 shrink-0" />
            <div className="max-w-[90%] rounded-mkt-md rounded-tl-sm border border-mkt-border-light bg-mkt-surface-white px-4 py-3">
              <p className="text-sm leading-relaxed text-mkt-text-primary">
                Since the increase is concentrated on weekends, I&apos;d start there — review your
                weekend labor scheduling before the next payroll cycle. That&apos;s usually the
                fastest lever without cutting hours during your busiest shifts.
              </p>
            </div>
          </div>
        </div>

        <p className="border-t border-mkt-border-light px-6 py-4 text-xs text-mkt-text-muted">
          IntelliCEO remembers what you&apos;ve discussed before, so you never have to re-explain
          your business.
        </p>
      </MockupFrame>
    </div>
  );
}
