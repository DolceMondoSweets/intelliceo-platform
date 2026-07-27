"use client";

import { useRef, type ReactNode } from "react";

// Shared premium micro-interaction for cards: a restrained hover lift plus an
// extremely subtle cursor-tracked highlight (never a visible glow/spotlight —
// opacity is capped low enough to read as a barely-there sheen, consistent
// with the brand's no-glow-effects rule).
export function SpotlightCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`group/spotlight relative transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-mkt-hover ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0 transition-opacity duration-300 ease-out group-hover/spotlight:opacity-100"
        style={{
          background:
            "radial-gradient(240px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(0, 77, 89, 0.05), transparent 70%)",
        }}
      />
      {children}
    </div>
  );
}
