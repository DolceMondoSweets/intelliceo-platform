"use client";

import { useState } from "react";

// Business Overview and Products are already editable in Settings and
// rarely change — collapsed by default so the daily-use Dashboard isn't
// restating static setup info every time.
export function BusinessInfoDisclosure({
  overview,
  products,
}: {
  overview: string | null;
  products: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-zinc-500 dark:text-zinc-400"
      >
        Business Info
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div className="flex flex-col gap-4 border-t border-zinc-200 p-4 dark:border-zinc-800">
          <div>
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Business overview
            </h3>
            <p className="mt-1 text-base text-zinc-900 dark:text-zinc-50">
              {overview ?? <span className="text-zinc-400 dark:text-zinc-600">Not provided</span>}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Products</h3>
            <p className="mt-1 text-base text-zinc-900 dark:text-zinc-50">
              {products ?? <span className="text-zinc-400 dark:text-zinc-600">Not provided</span>}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
