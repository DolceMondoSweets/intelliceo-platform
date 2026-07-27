import Link from "next/link";
import { Logo } from "@/components/marketing/brand/Logo";
import { Container } from "@/components/marketing/ui/Container";
import { footerColumns } from "@/content/navigation";

export function MarketingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-mkt-border-light bg-mkt-surface-white">
      <Container className="py-16 md:py-20">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-6">
          {footerColumns.map((column) => (
            <div key={column.heading}>
              <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-mkt-text-muted">
                {column.heading}
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-mkt-text-secondary transition-colors hover:text-brand-teal"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-mkt-border-light pt-8 md:flex-row md:items-center">
          <div className="flex flex-col items-start gap-2.5">
            <Logo height={34} href={null} />
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-mkt-text-muted">
              RUN SMARTER.
            </p>
          </div>
          <p className="text-sm text-mkt-text-muted">
            © {year} IntelliCEO. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
