# IntelliCEO Website — Complete Design System & AI Code Builder Brief

Use the following as the master prompt for the AI code builder.

---

## 1. Project Overview

Build a premium, visually distinctive marketing website for **IntelliCEO**, an AI-powered business intelligence and executive guidance platform for independent business owners.

IntelliCEO helps owners understand their finances, make better decisions, organize their operations, and lead their businesses with greater confidence.

### Brand tagline

**RUN SMARTER.**

### Primary homepage headline

**Become the CEO your business deserves.**

### Supporting positioning

**Your AI business partner for clearer finances, better decisions, and stronger business performance.**

### Initial target market

Independent food and beverage businesses, including:

* Coffee shops
* Restaurants
* Bakeries
* Food trucks
* Dessert shops
* Small hospitality businesses

The brand must still feel broad enough to expand into additional industries later.

---

# 2. Core Creative Direction

The website should communicate:

* Executive intelligence
* Trust
* Clarity
* Confidence
* Authority
* Calm sophistication
* Modern technology
* High-quality strategic guidance

The website should feel like:

> A premium executive operating system built for the small business owner.

The user should think:

> "These people understand business."

They should not primarily think:

> "This is another AI chatbot."

### Visual reference

Imagine:

* Apple's restraint
* Linear's precision
* Stripe's product storytelling
* American Express's sense of trust and premium service
* A top management consulting firm's authority
* Modern editorial design

Do not directly copy any company's website.

Create a distinct IntelliCEO visual language based on the supplied brand assets.

---

# 3. What the Website Must Not Look Like

Do not create a generic AI startup website.

Avoid:

* Purple or blue neon gradients
* Glowing brains
* Robots
* Circuit-board graphics
* Chat bubbles as primary visual devices
* Floating 3D spheres
* Random glassmorphism
* Excessive gradients
* Cyberpunk imagery
* Dark futuristic backgrounds throughout the site
* Generic stock images of people pointing at laptops
* Oversized pill-shaped cards everywhere
* Excessive animation
* Busy dashboards filled with meaningless charts
* Decorative elements that do not support the message
* Template-like SaaS layouts
* Cartoon illustrations

The design should favor restraint over decoration.

White space is an intentional design element.

---

# 4. Supplied Brand Assets

Use the uploaded IntelliCEO logo and icon assets.

### Primary logo

Use the full IntelliCEO wordmark in the website navigation, footer, login pages, and major brand moments.

The logo features:

* Teal "Intelli"
* Gold "CEO"
* An orbital symbol crossing through the wordmark

### App icon

Use the standalone CEO orbital icon for:

* Favicon
* Mobile navigation
* Social preview graphics
* Product mockups
* Small brand marks
* Loading states
* Future app icon references

### Asset handling

Place optimized logo files in:

```text
/public/brand/intelliceo-logo.png
/public/brand/intelliceo-icon.png
```

Create WebP versions where appropriate while preserving transparent backgrounds.

Do not redraw, alter, stretch, recolor, rotate, or add effects to the primary logo.

Maintain the original aspect ratio.

### Logo clear space

Maintain clear space around the full logo equal to at least the height of the capital letter "I."

Do not crowd the logo against:

* Navigation links
* Buttons
* Screen edges
* Cards
* Decorative graphics

---

# 5. Brand Color System

Use CSS variables or Tailwind design tokens.

## Primary colors

### IntelliCEO Teal

```css
--brand-teal: #004D59;
```

Use for:

* Primary buttons
* Major headings
* Navigation accents
* Product interface accents
* Icons
* Links
* Active states
* Dark brand sections

### IntelliCEO Gold

```css
--brand-gold: #DE8A3E;
```

Use sparingly for:

* Important highlights
* Selected interface details
* Key metrics
* Confidence scores
* Active indicators
* Small decorative lines
* Eyebrow labels
* Important words
* Premium accents

Gold should never dominate the page.

It should feel deliberate and earned.

## Supporting colors

```css
--brand-teal-dark: #003741;
--brand-teal-deep: #002B33;
--brand-teal-light: #E7F1F2;
--brand-teal-muted: #C9DEE1;

--brand-gold-dark: #B86A28;
--brand-gold-light: #F8EBDD;
--brand-gold-muted: #EEC89E;

--background-primary: #FAFBFA;
--background-secondary: #F3F6F5;
--surface-white: #FFFFFF;
--surface-soft: #F7F9F8;

--text-primary: #172126;
--text-secondary: #4F5D62;
--text-muted: #748085;
--border-light: #E3E9E7;
--border-medium: #CFD9D6;

--success: #287A5B;
--success-background: #E7F4ED;
--warning: #A76322;
--warning-background: #FCF0E4;
--danger: #A34040;
--danger-background: #F8EAEA;
```

## Color usage ratio

Use approximately:

* 65% off-white and white
* 20% charcoal and neutral typography
* 10% teal
* 5% gold

Do not use gold as the background for large website sections.

Do not use teal and gold with equal visual weight.

Teal is the structural brand color. Gold is the emphasis color.

---

# 6. Typography

## Confirmed typeface

Use **Manrope** as the permanent typeface — this matches the finalized logo, which was set in Manrope. This is not a fallback; it is the confirmed choice.

Load Manrope through `next/font/google`.

Recommended stack:

```css
font-family: "Manrope", "Inter", Arial, sans-serif;
```

Recommended weights:

* 400 Regular
* 500 Medium
* 600 SemiBold
* 700 Bold
* 800 ExtraBold

## Typography personality

Headlines should feel:

* Bold
* Controlled
* Direct
* Spacious
* Executive

Body copy should feel:

* Clear
* Calm
* Human
* Easy to scan
* Free of jargon

## Type scale

### Display headline

Desktop:

```css
font-size: clamp(3.75rem, 6vw, 6rem);
line-height: 0.98;
letter-spacing: -0.055em;
font-weight: 700;
```

Mobile:

```css
font-size: 3rem;
line-height: 1;
```

### Page headline

```css
font-size: clamp(3rem, 5vw, 4.75rem);
line-height: 1.02;
letter-spacing: -0.045em;
font-weight: 700;
```

### Section headline

```css
font-size: clamp(2.25rem, 4vw, 3.75rem);
line-height: 1.08;
letter-spacing: -0.04em;
font-weight: 700;
```

### Card headline

```css
font-size: 1.35rem;
line-height: 1.25;
font-weight: 650;
letter-spacing: -0.02em;
```

### Large body

```css
font-size: 1.25rem;
line-height: 1.65;
font-weight: 400;
```

### Standard body

```css
font-size: 1rem;
line-height: 1.7;
font-weight: 400;
```

### Small body

```css
font-size: 0.875rem;
line-height: 1.55;
```

### Eyebrow labels

```css
font-size: 0.75rem;
line-height: 1;
font-weight: 700;
letter-spacing: 0.12em;
text-transform: uppercase;
```

Use eyebrow labels sparingly.

---

# 7. Grid and Page Width

Use a responsive 12-column grid.

## Main container

```css
max-width: 1280px;
margin-inline: auto;
padding-inline: 24px;
```

Desktop horizontal padding:

```css
48px
```

Large desktop horizontal padding:

```css
64px
```

Mobile horizontal padding:

```css
20px
```

## Text width

Do not allow long paragraphs to span the entire page.

Recommended maximum widths:

```css
max-width: 680px;
```

for normal content.

```css
max-width: 820px;
```

for large editorial introductions.

## Section spacing

Desktop:

```css
padding-block: 128px;
```

Large feature sections:

```css
padding-block: 160px;
```

Tablet:

```css
padding-block: 96px;
```

Mobile:

```css
padding-block: 72px;
```

Do not compress sections merely to fit more information above the fold.

---

# 8. Spacing System

Use an 8-point spacing system.

Core values:

```text
4px
8px
12px
16px
24px
32px
40px
48px
64px
80px
96px
128px
160px
```

Standard internal card padding:

```text
24px mobile
32px tablet
40px desktop
```

Large product presentation cards may use:

```text
48px to 64px
```

Avoid inconsistent values such as 27px, 43px, or 71px unless technically necessary.

---

# 9. Border Radius

Use rounded corners, but do not make every component excessively soft.

```css
--radius-small: 8px;
--radius-medium: 12px;
--radius-large: 18px;
--radius-xl: 24px;
--radius-pill: 999px;
```

Usage:

* Form inputs: 10–12px
* Buttons: 10–12px
* Standard cards: 16–18px
* Product mockups: 20–24px
* Badges: pill radius
* Large CTA panel: 24px

Do not use a pill shape for every button and card.

---

# 10. Shadows

Use subtle, layered shadows.

## Standard card

```css
box-shadow:
  0 1px 2px rgba(0, 35, 42, 0.04),
  0 8px 24px rgba(0, 35, 42, 0.05);
```

## Elevated product mockup

```css
box-shadow:
  0 2px 4px rgba(0, 35, 42, 0.05),
  0 20px 60px rgba(0, 35, 42, 0.10);
```

## Hover state

```css
box-shadow:
  0 4px 8px rgba(0, 35, 42, 0.05),
  0 24px 48px rgba(0, 35, 42, 0.08);
```

Avoid heavy black shadows.

Avoid strong gold glows.

Avoid large blurry shadows around every object.

---

# 11. Borders

Use subtle borders to create structure.

```css
border: 1px solid var(--border-light);
```

For emphasized cards:

```css
border: 1px solid rgba(0, 77, 89, 0.18);
```

Avoid outlining every individual element.

Let spacing and background contrast do most of the work.

---

# 12. Button System

## Primary button

* Teal background
* White text
* 48–52px height
* 10–12px radius
* Medium or semibold typography
* Optional arrow icon
* No gradient

Example:

```css
background: #004D59;
color: #FFFFFF;
padding: 0 22px;
height: 50px;
border-radius: 11px;
font-weight: 650;
```

Hover:

```css
background: #003741;
transform: translateY(-1px);
```

Active:

```css
transform: translateY(0);
```

## Secondary button

* White or transparent background
* Dark teal text
* Light border
* Same height as primary

Hover:

* Very pale teal background
* Slightly darker border

## Text link

Use teal text with a directional arrow.

Do not underline by default.

Underline or shift the arrow slightly on hover.

## CTA language

Preferred calls to action:

* Join the Beta
* Request Early Access
* See How It Works
* Explore the Product
* View Food & Beverage Solution
* Read the CEO Brief
* Watch the Overview
* Log In

Avoid:

* Get Started Free
* Revolutionize Your Business
* Supercharge Now
* Unlock the Power of AI

---

# 13. Iconography

Use **Lucide React** icons.

Icon characteristics:

* 1.75px to 2px stroke
* Rounded line endings
* Minimal
* Consistent size
* Mostly teal or charcoal
* Gold only for important states

Common icons:

* ChartNoAxesCombined
* WalletCards
* CircleDollarSign
* Landmark
* Lightbulb
* Compass
* Target
* ClipboardCheck
* CalendarCheck
* ShieldCheck
* LockKeyhole
* Database
* Store
* Utensils
* Coffee
* ArrowUpRight
* Check
* Sparkles only when used very sparingly to denote AI assistance

Do not mix multiple icon families.

Do not use emoji.

---

# 14. Motion Principles

Use motion to communicate polish, hierarchy, and responsiveness.

Use **Framer Motion** or lightweight CSS transitions.

## Motion personality

* Quiet
* Smooth
* Controlled
* Purposeful
* Fast enough to feel responsive
* Slow enough to feel premium

## Entrance animation

Elements may:

* Fade from 0 to 1
* Translate upward by 12–20px
* Use 0.45–0.7 second duration
* Use an ease-out curve
* Stagger children by 60–100ms

## Card hover

Cards may:

* Move upward by 3–4px
* Slightly increase shadow
* Change border to light teal
* Keep scale changes below 1.01

## Button hover

Buttons may:

* Move upward by 1px
* Darken slightly
* Shift arrow 2–3px to the right

## Logo animation

Do not continuously rotate the orbit.

An optional homepage-only brand animation may be used:

* The icon orbit draws or moves once during initial page load
* Duration under 1.5 seconds
* No looping
* Respect `prefers-reduced-motion`
* Do not animate the full logo in the navigation after initial load

## Scroll animations

Do not animate every sentence independently.

Animate major content groups rather than every small element.

## Reduced motion

Honor:

```css
@media (prefers-reduced-motion: reduce)
```

Disable nonessential movement.

---

# 15. Navigation

Create a sticky header.

## Desktop layout

Left:

* IntelliCEO logo

Center:

* Solutions with dropdown
* Product
* Pricing
* Resources
* About

Right:

* Log In
* Join the Beta

## Solutions dropdown

Initially include one option:

### Food & Beverage

Supporting description:

> Financial clarity, operational guidance, and executive intelligence for independent food and beverage businesses.

Include a small food and beverage icon.

Design the dropdown so future industries can be added without redesigning it.

## Header visual treatment

At top of page:

* Mostly transparent or off-white
* No heavy border
* 80–88px high

After scrolling:

* White or nearly white background
* Subtle bottom border
* Light backdrop blur
* Slight reduction in height if desired

## Mobile navigation

* Logo left
* Menu icon right
* Full-screen or large drawer menu
* Primary Join the Beta button clearly visible
* Accordion for Solutions
* Avoid a tiny dropdown menu on mobile

---

# 16. Homepage Structure

## Section 1: Hero

### Layout

Use a two-column desktop layout.

Left column: approximately 46%.

Right column: approximately 54%.

Vertically center the content.

Minimum hero height:

```css
min-height: calc(100vh - 88px);
```

Do not make the hero feel vertically cramped.

### Left content

Small brand statement:

> RUN SMARTER.

Main headline:

> Become the CEO your business deserves.

Supporting copy:

> IntelliCEO gives independent business owners the financial clarity, executive guidance, and operational discipline they need to make better decisions and build stronger businesses.

Primary CTA:

> Join the Beta

Secondary CTA:

> See How It Works

Trust note beneath CTA:

> Limited early access for independent food and beverage businesses.

### Headline treatment

Use dark charcoal for most words.

Optionally emphasize one short phrase, such as "CEO," in teal.

Do not turn the entire headline into a gradient.

### Right-side product presentation

Show an idealized, realistic **CEO Brief** product mockup (see corrected copy in the companion correction document — do not use "Morning Brief" naming or a time-of-day-specific greeting).

This should not resemble a generic analytics dashboard.

It should communicate that IntelliCEO explains what matters and recommends what to do next.

The mockup should include:

* Clear hierarchy
* Light neutral interface
* Teal structural accents
* Gold confidence score or key action
* One subtle trend chart
* No more than five major content areas
* Generous internal white space
* Professional interface typography

### Hero background

Use an off-white background.

Add one extremely faint brand device:

* Thin orbital arcs
* A subtle radial teal wash
* A restrained grid
* Soft blurred teal and gold fields at very low opacity

Do not put loud decorative shapes behind the text.

---

## Section 2: Recognition Strip

Create a slim transition strip with text such as:

> Built for the owner making a hundred decisions a day.

Below it, show business types — **food & beverage only, per V1 scope:**

* Coffee Shops
* Restaurants
* Bakeries
* Food Trucks
* Small Hospitality Businesses

Use text and minimal icons, not fake customer logos.

---

## Sections 3-14

See the companion correction document for the full, corrected copy and
structure of Sections 3 through 14 (The Problem, Meet IntelliCEO, How It
Works, CEO Brief Showcase, Financial Visibility Showcase, AI Business
Advisor Showcase, the new Content Studio Showcase, Food & Beverage
Solution, Differentiation, Security, Limited Early Access, FAQ, and Final
CTA).

---

# 17. Internal Page Structure

Create the following routes:

```text
/
 /solutions
 /solutions/food-and-beverage
 /product
 /pricing
 /resources
 /resources/blog
 /resources/guides
 /about
 /security
 /contact
 /login
 /beta
 /privacy
 /terms
```

The `/solutions` page may initially direct attention to Food & Beverage while being architected to support future industry cards.

---

# 18. Product Page

See the companion correction document for the corrected section list.

---

# 19. Food & Beverage Page

See the companion correction document for the corrected metrics list.

---

# 20. Pricing Page

Position beta as limited early access.

Recommended structure:

* Pricing hero
* Early-access plan
* What is included
* Onboarding
* Integrations
* Data and security
* Future pricing expectations
* Pricing FAQ
* CTA

Until pricing is finalized, use configurable content values rather than hardcoding speculative prices.

Create pricing data in a centralized file such as:

```text
/content/pricing.ts
```

---

# 21. About Page

Sections:

* Why IntelliCEO exists
* The gap facing independent business owners
* Mission
* Founder story
* Product philosophy
* Long-term vision
* Values
* Contact CTA

Suggested mission language:

> IntelliCEO exists to give independent business owners access to the clarity, expertise, and operating discipline normally available only to much larger companies.

Long-term vision:

> Build the intelligent operating system that helps small businesses make stronger decisions and operate at a higher level.

---

# 22. Footer

Use a minimal multi-column footer.

## Solutions

* Food & Beverage

## Product

* Product Overview
* Pricing
* Integrations
* Security

## Resources

* Blog
* Guides
* Help Center
* FAQ

## Company

* About
* Contact

## Trust

* Security
* Privacy Policy
* Terms of Service

## Account

* Log In
* Join the Beta

Include:

* Full logo or small logo plus tagline
* `RUN SMARTER.`
* Copyright notice
* Social links only when active

Do not include empty social-media icons.

---

# 23. Forms

All forms should feel premium and simple.

## Beta form fields

* First name
* Last name
* Business name
* Email
* Phone, optional
* Business type
* Number of locations
* Current point-of-sale system
* Primary business challenge
* Consent checkbox

Use labels above fields.

Do not rely only on placeholder text.

Include:

* Validation
* Accessible error messages
* Loading state
* Success confirmation
* Error recovery
* Spam protection
* Privacy notice

---

# 24. Product Mockup System

Build mockups as reusable React components, not flattened screenshot images.

Suggested components:

```text
CEOBriefCard
ExecutiveInsight
MetricCard
PriorityCard
RecommendationPanel
FinancialOverview
RunwayIndicator
TrendChart
DecisionMemo
AdvisorResponse
GoalProgress
BusinessHealthScore
IntegrationCard
ContentStudioSample
```

This makes the marketing site feel like a living preview of the actual product.

## Mockup interface rules

* Use neutral white and off-white surfaces
* Teal for navigation and structure
* Gold for important insights
* Avoid large areas of saturated color
* Limit each screen to one dominant message
* Use plausible business data
* Do not use meaningless random graphs
* Every metric should support the story being told

---

# 25. Responsive Behavior

## Desktop

* Full 12-column layouts
* Two-column hero
* Horizontal product demonstrations
* Spacious navigation
* Generous margins

## Tablet

* Reduce decorative elements
* Keep two-column layouts when readable
* Stack complex product sections
* Preserve hierarchy

## Mobile

* Single-column layout
* Headline remains prominent
* Product mockup appears beneath hero copy
* Full-width CTA buttons where appropriate
* Card padding reduced, not eliminated
* Comparison tables become stacked groups
* Avoid horizontal scrolling
* Navigation uses an accessible drawer

Test common widths:

```text
375px
390px
430px
768px
1024px
1280px
1440px
1728px
```

---

# 26. Accessibility

Target WCAG 2.2 AA.

Requirements:

* Semantic HTML
* Visible keyboard focus states
* Full keyboard navigation
* Proper heading hierarchy
* Descriptive button labels
* Accessible accordion behavior
* Form labels and error associations
* Sufficient contrast
* Alt text for meaningful images
* Empty alt text for decorative images
* Reduced-motion support
* Minimum 44px touch targets
* No important information communicated by color alone

Gold text should not be used on white for small body copy unless contrast passes accessibility standards.

---

# 27. Technical Requirements

Build with:

* Next.js using the App Router
* TypeScript
* Tailwind CSS
* Framer Motion
* Lucide React
* Recharts only where a chart adds genuine value
* `next/image`
* `next/font`
* Vercel deployment
* ESLint
* Prettier

Use reusable components.

Recommended structure:

```text
/app
  /(marketing)
    page.tsx
    product/page.tsx
    pricing/page.tsx
    about/page.tsx
    security/page.tsx
    contact/page.tsx
    beta/page.tsx
    solutions/page.tsx
    solutions/food-and-beverage/page.tsx
  /login/page.tsx

/components
  /brand
  /layout
  /navigation
  /sections
  /product
  /forms
  /ui

/content
  navigation.ts
  homepage.ts
  product.ts
  pricing.ts
  faq.ts
  solutions.ts

/lib
  metadata.ts
  analytics.ts
  validation.ts

/public
  /brand
  /images
```

Avoid putting all homepage markup in one enormous file.

---

# 28. Content Architecture

Keep copy in structured data files where practical.

Example:

```ts
export const homepageCapabilities = [
  {
    title: "Financial Visibility",
    description:
      "Understand revenue, expenses, profitability, cash flow, and runway.",
    icon: "chart",
  },
];
```

This will make future edits easier.

Do not hardcode repeated navigation, FAQ, pricing, or footer data across multiple pages.

---

# 29. SEO and Metadata

Create unique metadata for every page.

Homepage title example:

> IntelliCEO — Run Smarter

Homepage description:

> IntelliCEO gives independent business owners financial clarity, executive guidance, and operational discipline to make better decisions and build stronger businesses.

Include:

* Canonical URLs
* Open Graph metadata
* Twitter/X card metadata
* Favicon
* Sitemap
* Robots file
* Organization structured data
* Software application structured data when accurate
* FAQ structured data where appropriate
* Article structured data for blog posts

Do not keyword-stuff.

---

# 30. Performance

Target:

* Lighthouse performance above 90
* Accessibility above 95
* Best Practices above 95
* SEO above 95

Requirements:

* Optimize images
* Avoid unnecessary JavaScript
* Lazy-load below-the-fold media
* Use server components where appropriate
* Minimize client components
* Avoid autoplay video
* Avoid oversized animation libraries beyond what is needed
* Prevent layout shifts
* Use responsive images
* Preload only critical assets

---

# 31. Analytics and Conversion Events

Prepare the site for analytics.

Track events such as:

```text
hero_join_beta_clicked
navigation_join_beta_clicked
product_demo_clicked
food_beverage_solution_clicked
pricing_viewed
beta_form_started
beta_form_submitted
security_page_viewed
login_clicked
faq_opened
```

Do not add invasive tracking without consent controls.

---

# 32. Design Quality Checklist

Before considering a page complete, verify:

* Does it look specifically like IntelliCEO rather than a template?
* Is the visual hierarchy obvious within three seconds?
* Is there enough white space?
* Is gold used sparingly?
* Is the product, not decoration, the visual hero?
* Are the mockups believable?
* Is the language centered on business outcomes?
* Does the website convey trust before asking for financial data?
* Are sections visually varied without becoming inconsistent?
* Does every animation have a purpose?
* Does the site work just as well without animation?
* Is mobile treated as a designed experience rather than a compressed desktop page?
* Are security statements accurate?
* Is beta presented as curated early access?
* Does every page contain a clear next action?
* **Does every feature described actually exist in the product today?**

---

# 33. Final Direction to the AI Builder

> Build IntelliCEO as a premium executive software brand, not a generic AI startup. Use the supplied teal-and-gold identity as the foundation of a restrained, sophisticated design system. The website should feel calm, intelligent, credible, and highly polished. Product intelligence should be demonstrated through realistic CEO briefs and financial insights rather than through decorative AI imagery. Favor editorial typography, strong hierarchy, believable product interfaces, generous white space, subtle motion, and disciplined use of color. Every screen should reinforce the core promise: IntelliCEO helps independent business owners become stronger CEOs and run smarter.

## Initial implementation priority

Build these first:

1. Global design system
2. Responsive navigation
3. Homepage
4. Reusable product mockup components
5. Food & Beverage page
6. Product page
7. Beta application form
8. Security page
9. Pricing page
10. Footer and secondary pages

Do not begin by generating every page with placeholder content. First establish the design system and complete the homepage to a production-quality standard. Then reuse the approved components and visual language across the remaining site.
