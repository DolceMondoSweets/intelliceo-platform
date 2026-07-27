"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Container, ProseWidth } from "@/components/marketing/ui/Container";
import { Reveal } from "@/components/marketing/ui/Reveal";
import { sectionHeadline } from "@/components/marketing/ui/typography";
import { faqItems } from "@/content/homepage";

// Section 13 (FAQ) — DRAFTED, answers grounded in verified real product
// facts (see src/content/homepage.ts for provenance notes). Accessible
// accordion: button + aria-expanded + aria-controls, per Section 26.
export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-[5.5rem] md:py-40">
      <Container>
        <Reveal>
          <ProseWidth>
            <h2 className={`${sectionHeadline} text-mkt-text-primary`}>
              Frequently asked questions.
            </h2>
          </ProseWidth>
        </Reveal>

        <div className="mt-10 flex max-w-[820px] flex-col divide-y divide-mkt-border-light border-y border-mkt-border-light">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-button-${index}`;
            return (
              <div key={item.question}>
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <span className="text-base font-semibold text-mkt-text-primary">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`h-4.5 w-4.5 shrink-0 text-mkt-text-muted transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      strokeWidth={2}
                    />
                  </button>
                </h3>
                {/* Always mounted (not conditionally rendered) so every
                    answer stays present in the DOM for SEO/accessibility —
                    only the height/opacity animate, nothing unmounts. */}
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  aria-hidden={!isOpen}
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <p className="max-w-[680px] pb-5 text-base leading-relaxed text-mkt-text-secondary">
                    {item.answer}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
