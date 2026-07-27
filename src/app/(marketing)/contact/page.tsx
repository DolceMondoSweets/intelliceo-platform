import type { Metadata } from "next";
import { ContactHero } from "@/components/marketing/sections/contact/ContactHero";
import { ContactForm } from "@/components/marketing/sections/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact — IntelliCEO",
  description:
    "Questions about the product, partnerships, press, or anything else — get in touch with IntelliCEO.",
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactForm />
    </>
  );
}
