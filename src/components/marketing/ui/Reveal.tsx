"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

// One restrained fade-up-on-scroll treatment reused across section
// headers/content so the page has a consistent, premium scroll rhythm
// instead of everything just snapping into place statically.
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
