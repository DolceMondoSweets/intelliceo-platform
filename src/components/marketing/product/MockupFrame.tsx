import type { ReactNode } from "react";
import { SpotlightCard } from "@/components/marketing/ui/SpotlightCard";

// Minimal application-window chrome so product mockups read as real software
// screenshots rather than isolated UI cards — three muted window dots plus a
// small page label. Deliberately restrained: no fake address bar, no color,
// no traffic-light dots (Section 24's "no more than five content areas" /
// calm-executive tone rules apply to the frame too, not just the content).
export function MockupFrame({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <SpotlightCard
      className={`w-full overflow-hidden rounded-mkt-xl border border-mkt-border-light bg-mkt-surface-white shadow-mkt-mockup ${className}`}
    >
      <div className="flex items-center gap-2.5 border-b border-mkt-border-light bg-mkt-bg-secondary/70 px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-mkt-border-medium" />
          <span className="h-2 w-2 rounded-full bg-mkt-border-medium" />
          <span className="h-2 w-2 rounded-full bg-mkt-border-medium" />
        </div>
        <span className="text-[11px] font-medium tracking-wide text-mkt-text-muted">{label}</span>
      </div>
      {children}
    </SpotlightCard>
  );
}
