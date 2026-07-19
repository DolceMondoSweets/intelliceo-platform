import type { ButtonHTMLAttributes } from "react";

export const inputClass =
  "rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-900 outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50";

type ButtonVariant = "primary" | "secondary";

const buttonVariantClass: Record<ButtonVariant, string> = {
  primary: "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900",
  secondary: "border border-zinc-300 text-zinc-900 dark:border-zinc-700 dark:text-zinc-50",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      {...props}
      className={`rounded-full px-5 py-3.5 text-base font-medium transition-colors disabled:opacity-60 ${buttonVariantClass[variant]} ${className}`}
    />
  );
}
