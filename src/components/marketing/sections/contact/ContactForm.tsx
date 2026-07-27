"use client";

import { useState, useTransition } from "react";
import { Container, ProseWidth } from "@/components/marketing/ui/Container";
import { Button } from "@/components/marketing/ui/Button";
import { Reveal } from "@/components/marketing/ui/Reveal";
import { SpotlightCard } from "@/components/marketing/ui/SpotlightCard";
import { submitContactForm } from "@/app/(marketing)/contact/actions";
import { contactCategories, responseTimeCommitment } from "@/content/contact";

const fieldClass =
  "w-full rounded-mkt-md border border-mkt-border-medium bg-mkt-surface-white px-4 py-3 text-base text-mkt-text-primary placeholder:text-mkt-text-muted transition-colors focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal/20";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState<string>(contactCategories[0].value);
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot, never shown to real users
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await submitContactForm({ name, email, category, message, company });
      if (result.error) {
        setError(result.error);
        return;
      }
      setSuccess(true);
    });
  }

  return (
    <section className="bg-mkt-bg-secondary py-[5.5rem] md:py-40">
      <Container>
        <Reveal>
          <ProseWidth large className="mx-auto text-center">
            <p className="text-sm text-mkt-text-muted">{responseTimeCommitment}</p>
          </ProseWidth>

          <div className="mx-auto mt-8 max-w-[560px]">
            <SpotlightCard className="rounded-mkt-xl border border-mkt-border-light bg-mkt-surface-white p-8 shadow-mkt-card">
              {success ? (
                <div className="py-4 text-center">
                  <p className="text-lg font-semibold text-mkt-text-primary">Message sent.</p>
                  <p className="mt-2 text-base leading-relaxed text-mkt-text-secondary">
                    {responseTimeCommitment}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm font-medium text-mkt-text-primary">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={fieldClass}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-medium text-mkt-text-primary">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={fieldClass}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="category" className="text-sm font-medium text-mkt-text-primary">
                      What&apos;s this about?
                    </label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={fieldClass}
                    >
                      {contactCategories.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-sm font-medium text-mkt-text-primary">
                      Message
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className={fieldClass}
                    />
                  </div>

                  {/* Honeypot — hidden from sighted and screen-reader users;
                      bots that fill every field reliably populate it. */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="company">Company</label>
                    <input
                      id="company"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>

                  {error && <p className="text-sm text-mkt-danger">{error}</p>}

                  <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                    {isPending ? "Sending…" : "Send Message"}
                  </Button>
                </form>
              )}
            </SpotlightCard>

            <p className="mt-6 text-center text-sm text-mkt-text-muted">
              Prefer email? Reach us directly at{" "}
              <a href="mailto:help@intelliceo.com" className="text-brand-teal hover:underline">
                help@intelliceo.com
              </a>{" "}
              or{" "}
              <a href="mailto:info@intelliceo.com" className="text-brand-teal hover:underline">
                info@intelliceo.com
              </a>
              .
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
