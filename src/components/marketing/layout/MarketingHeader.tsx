"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, Utensils, X } from "lucide-react";
import { Logo } from "@/components/marketing/brand/Logo";
import { Button } from "@/components/marketing/ui/Button";
import { Container } from "@/components/marketing/ui/Container";
import { primaryNav, solutions } from "@/content/navigation";

export function MarketingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close any open menu on route change.
  useEffect(() => {
    setMobileOpen(false);
    setSolutionsOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "h-20 border-b border-mkt-border-light bg-mkt-surface-white/90 backdrop-blur-md"
          : "h-22 bg-mkt-bg-primary/60 md:bg-transparent"
      }`}
      style={{ height: scrolled ? 80 : 88 }}
    >
      <Container className="flex h-full items-center justify-between">
        <Link
          href="/"
          aria-label="IntelliCEO home"
          className="flex flex-col items-start gap-1"
        >
          <Logo height={42} href={null} priority />
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-brand-teal">
            RUN SMARTER.
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <div
            className="relative"
            onMouseEnter={() => setSolutionsOpen(true)}
            onMouseLeave={() => setSolutionsOpen(false)}
          >
            <button
              type="button"
              className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-mkt-text-secondary transition-colors hover:text-mkt-text-primary"
              aria-expanded={solutionsOpen}
              onClick={() => setSolutionsOpen((v) => !v)}
            >
              Solutions
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${solutionsOpen ? "rotate-180" : ""}`}
                strokeWidth={2}
              />
            </button>
            <AnimatePresence>
              {solutionsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute left-0 top-full pt-2"
                >
                  <div className="w-80 rounded-mkt-lg border border-mkt-border-light bg-mkt-surface-white p-2 shadow-mkt-mockup">
                    {solutions.map((s) => (
                      <Link
                        key={s.href}
                        href={s.href}
                        className="flex items-start gap-3 rounded-mkt-md p-3 transition-colors hover:bg-mkt-bg-secondary"
                      >
                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-mkt-sm bg-brand-teal-light text-brand-teal">
                          <Utensils className="h-4.5 w-4.5" strokeWidth={1.75} />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold text-mkt-text-primary">
                            {s.label}
                          </span>
                          <span className="mt-0.5 block text-sm leading-snug text-mkt-text-muted">
                            {s.description}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-mkt-text-secondary transition-colors hover:text-mkt-text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right side */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-mkt-text-secondary transition-colors hover:text-mkt-text-primary"
          >
            Log In
          </Link>
          <Button href="/beta" className="h-11 px-5 text-sm">
            Join the Beta
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-lg text-mkt-text-primary md:hidden"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-0 z-40 flex flex-col bg-mkt-surface-white md:hidden"
            style={{ paddingTop: 80 }}
          >
            <Container className="flex flex-1 flex-col gap-1 overflow-y-auto py-6">
              <button
                type="button"
                onClick={() => setMobileSolutionsOpen((v) => !v)}
                className="flex items-center justify-between rounded-lg px-2 py-3 text-left text-lg font-medium text-mkt-text-primary"
                aria-expanded={mobileSolutionsOpen}
              >
                Solutions
                <ChevronDown
                  className={`h-5 w-5 transition-transform duration-200 ${mobileSolutionsOpen ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {mobileSolutionsOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden pl-2"
                  >
                    {solutions.map((s) => (
                      <Link
                        key={s.href}
                        href={s.href}
                        className="block rounded-lg px-2 py-2.5 text-base text-mkt-text-secondary"
                      >
                        {s.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {primaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-2 py-3 text-lg font-medium text-mkt-text-primary"
                >
                  {item.label}
                </Link>
              ))}

              <div className="mt-4 flex flex-col gap-3 border-t border-mkt-border-light pt-6">
                <Link
                  href="/login"
                  className="rounded-lg px-2 py-3 text-center text-lg font-medium text-mkt-text-primary"
                >
                  Log In
                </Link>
                <Button href="/beta" className="w-full">
                  Join the Beta
                </Button>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
