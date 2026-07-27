"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "text" | "gold";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-[11px] px-[22px] h-[52px] text-base font-semibold transition-all duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal disabled:opacity-60 disabled:pointer-events-none active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-teal text-white hover:bg-brand-teal-dark hover:-translate-y-px active:translate-y-0",
  secondary:
    "bg-transparent text-brand-teal border border-mkt-border-medium hover:bg-brand-teal-light hover:border-brand-teal/30 hover:-translate-y-px active:translate-y-0",
  text: "h-auto px-0 text-brand-teal font-medium hover:text-brand-teal-dark active:scale-100",
  // For CTAs on dark brand-teal sections (e.g. Early Access) where the
  // primary teal button would have no contrast against the background.
  gold: "bg-brand-gold text-brand-teal-deep hover:bg-brand-gold-dark hover:-translate-y-px active:translate-y-0",
};

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  children: ReactNode;
  showArrow?: boolean;
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
}

export function Button({
  href,
  onClick,
  variant = "primary",
  children,
  showArrow = false,
  type = "button",
  className = "",
  disabled,
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;
  const content = (
    <>
      {children}
      {showArrow && (
        <ArrowUpRight
          className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          strokeWidth={2}
        />
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {content}
    </button>
  );
}
