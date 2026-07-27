// Section 6 (Typography) type scale, as literal Tailwind arbitrary-value
// class strings so they stay reusable across pages without re-deriving the
// clamp() values each time.
export const displayHeadline =
  "text-[clamp(3.75rem,6vw,6rem)] leading-[0.98] tracking-[-0.055em] font-bold";

export const pageHeadline =
  "text-[clamp(3rem,5vw,4.75rem)] leading-[1.02] tracking-[-0.045em] font-bold";

export const sectionHeadline =
  "text-[clamp(2.25rem,4vw,3.75rem)] leading-[1.08] tracking-[-0.04em] font-bold";

export const cardHeadline = "text-[1.35rem] leading-[1.25] font-[650] tracking-[-0.02em]";

export const largeBody = "text-xl leading-[1.65] font-normal";

export const standardBody = "text-base leading-[1.7] font-normal";

export const smallBody = "text-sm leading-[1.55]";
