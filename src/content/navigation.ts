// Section 15 (Navigation) + Section 22 (Footer). Centralized so nav/footer
// data isn't duplicated across pages — see Section 28 (Content Architecture).

export const primaryNav = [
  { label: "Product", href: "/product" },
  { label: "Pricing", href: "/pricing" },
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/about" },
] as const;

// Solutions is its own dropdown (not a plain link) — initially one option,
// architected so future industries can be added without a redesign.
export const solutions = [
  {
    label: "Food & Beverage",
    href: "/solutions/food-and-beverage",
    description:
      "Financial clarity, operational guidance, and executive intelligence for independent food and beverage businesses.",
    icon: "Utensils",
  },
] as const;

export const footerColumns = [
  {
    heading: "Solutions",
    links: [{ label: "Food & Beverage", href: "/solutions/food-and-beverage" }],
  },
  {
    heading: "Product",
    links: [
      { label: "Product Overview", href: "/product" },
      { label: "Pricing", href: "/pricing" },
      { label: "Integrations", href: "/product#integrations" },
      { label: "Security", href: "/security" },
    ],
  },
  {
    heading: "Resources",
    links: [
      // Blog and Guides removed 2026-07-27 — those content types don't
      // exist yet (no /resources/blog or /resources/guides route), so
      // linking to them would just be another dead link. Add back once
      // that content actually exists.
      { label: "Help Center", href: "/resources" },
      { label: "FAQ", href: "/product#faq" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Trust",
    links: [
      { label: "Security", href: "/security" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Log In", href: "/login" },
      { label: "Join the Beta", href: "/signup" },
    ],
  },
] as const;
