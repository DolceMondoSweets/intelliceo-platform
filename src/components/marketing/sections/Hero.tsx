"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/marketing/ui/Button";
import { Container } from "@/components/marketing/ui/Container";
import { displayHeadline } from "@/components/marketing/ui/typography";
import { CEOBriefCard } from "@/components/marketing/product/CEOBriefCard";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-mkt-bg-primary">
      {/* Extremely faint brand device — thin orbital arc + soft teal wash,
          restraint over decoration, purely atmospheric. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full opacity-[0.05] blur-3xl"
          style={{ background: "radial-gradient(circle, #004d59, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-32 left-1/3 h-[420px] w-[420px] rounded-full opacity-[0.04] blur-3xl"
          style={{ background: "radial-gradient(circle, #de8a3e, transparent 70%)" }}
        />
        <svg
          className="absolute right-[8%] top-[18%] hidden h-[340px] w-[340px] opacity-[0.06] lg:block"
          viewBox="0 0 200 200"
          fill="none"
        >
          <ellipse
            cx="100"
            cy="100"
            rx="90"
            ry="34"
            stroke="#004d59"
            strokeWidth="1.5"
            transform="rotate(28 100 100)"
          />
          <ellipse
            cx="100"
            cy="100"
            rx="90"
            ry="34"
            stroke="#de8a3e"
            strokeWidth="1.5"
            transform="rotate(-28 100 100)"
          />
        </svg>
      </div>

      <Container className="relative flex min-h-[calc(100vh-56px)] items-center py-20 md:py-16">
        <div className="grid w-full items-center gap-14 md:grid-cols-[46fr_54fr] md:gap-14 lg:gap-20">
          {/* Left content */}
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.08 }}
            className="flex flex-col gap-8"
          >
            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`${displayHeadline} text-mkt-text-primary`}
            >
              Become the <span className="text-brand-teal">CEO</span> your business deserves.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-[520px] text-xl leading-relaxed text-mkt-text-secondary"
            >
              IntelliCEO gives independent business owners the financial clarity, executive
              guidance, and operational discipline they need to make better decisions and build
              stronger businesses.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <Button href="/signup">Join the Beta</Button>
              <Button href="/product" variant="secondary" showArrow>
                See How It Works
              </Button>
            </motion.div>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-sm text-mkt-text-muted"
            >
              Limited early access for independent food and beverage businesses.
            </motion.p>
          </motion.div>

          {/* Right: product presentation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="flex justify-center md:justify-end"
          >
            <CEOBriefCard size="large" />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
