import Link from "next/link";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/morning-brief", label: "Morning Brief" },
  { href: "/vital-signs", label: "Vital Signs" },
  { href: "/decisions", label: "Decisions Log" },
  { href: "/content-studio", label: "Content Studio" },
  { href: "/square-integration", label: "Square Integration" },
];

export function AppNav() {
  return (
    <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <div className="mx-auto flex max-w-3xl gap-4 overflow-x-auto px-4 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
