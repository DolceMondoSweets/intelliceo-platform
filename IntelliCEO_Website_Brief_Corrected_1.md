# IntelliCEO Website — Master Design System & Build Brief (Corrected v2)

This is the build brief for Claude Code. All copy below has been reconciled
against what the platform actually does today — no unbuilt or oversold
capabilities.

---

## 1. Project Overview

Build a premium, visually distinctive marketing website for **IntelliCEO**,
an AI-powered business intelligence and executive guidance platform for
independent business owners.

### Brand tagline
**RUN SMARTER.**

### Primary homepage headline
**Become the CEO your business deserves.**

### Supporting positioning
**Your AI business partner for clearer finances, better decisions, and
stronger business performance.**

### Target market (V1)
Independent food & beverage businesses only — coffee shops, restaurants,
bakeries, food trucks, dessert shops, small hospitality businesses. The
brand should feel broad enough to expand into additional industries later,
but V1 messaging, examples, and the Solutions dropdown should not reference
or imply other verticals (e.g., no "Specialty Retail" mentions anywhere).

---

## 2-17. [UNCHANGED FROM ORIGINAL BRIEF]

Sections 2 (Core Creative Direction), 3 (What to Avoid), 5 (Color System),
6 (Typography — **Manrope confirmed as the permanent typeface, not a
fallback**; the logo itself was finalized in Manrope, so this is settled),
7 (Grid), 8 (Spacing), 9 (Border Radius), 10 (Shadows), 11 (Borders), 12
(Buttons), 13 (Iconography), 14 (Motion), 15 (Navigation), 16.1-16.2 (Hero,
Recognition Strip), and 17 (Internal Page Structure) all carry over
unchanged from the original brief. Build exactly as specified there.

**One change to Section 4 (Brand Assets):** logo, icon, and color palette
files are confirmed final and should already be placed at:
```
/public/brand/intelliceo-logo.png
/public/brand/intelliceo-icon.png
```

---

## 16.3 Section 3: The Problem — UNCHANGED

Keep as originally written (five question cards, asymmetrical grid).

---

## 16.4 Section 4: Meet IntelliCEO — UNCHANGED

Keep the four capability cards (Financial Visibility, AI Business Advisor,
Operational Discipline, Business Memory) as originally written — these are
accurate.

---

## 16.5 Section 5: How It Works — UNCHANGED

Keep the five-step progression as originally written — accurate to how the
product actually functions.

---

## 16.6 Section 6: CEO Brief Showcase — CORRECTED

**Rename every instance of "CEO Morning Brief" to "CEO Brief" throughout
this section and the hero mockup in Section 16.1.** The product dropped
"Morning" specifically because owners check it throughout the day, not
just in the morning — this must be consistent everywhere, including the
hero mockup copy ("Good morning, Alex" should become a time-neutral
greeting, e.g. "Here's where things stand, Alex").

Headline: **Know what matters, the moment you open the app.**

Copy:
> The CEO Brief reviews your business each time you generate it, flags
> what's changed, surfaces risks, and gives you a clear, current picture
> of where things stand — cash, revenue, margins, and what needs your
> attention.

Show examples such as: revenue trend, cash runway, a flagged margin issue,
a recommended focus area. Remove any implication of continuous/automatic
monitoring — the Brief is generated on request, not pushed proactively
(that's an accurate, still-strong story; no need to oversell it as
constant background monitoring).

CTA: **Explore the CEO Brief**

---

## 16.7 Section 7: Financial Visibility Showcase — CORRECTED

Headline: **See beyond sales.**

Copy:
> Revenue tells only part of the story. IntelliCEO helps owners track cash
> position, runway, food cost and prime cost against healthy industry
> benchmarks, budget versus actual performance, and the break-even point
> that keeps the business healthy.

Mockup should include only real, built metrics:
* Revenue (from Square or Clover, or entered manually)
* Cash balance and runway (calculated automatically)
* Food cost % and prime cost %, with benchmark comparison
* Budget vs. actual (revenue, COGS, labor)
* Break-even point

Do not include gross profit, net operating income, or any metric not
currently calculated by the platform.

---

## 16.8 Section 8: AI Business Advisor Showcase — CORRECTED

Headline: **Ask the questions you'd ask a trusted partner.**

**Replace the original hire/runway-forecast example — it implies
structured scenario-modeling precision the product doesn't yet perform.**
Use an example grounded in what Chat actually does: answer questions using
the business's real, current data and remembered conversation history.

Example conversation:

**Owner**
> How's my margin looking compared to last month?

**IntelliCEO**
> Your prime cost is currently 67%, up from 61% last month — mainly driven
> by the labor cost increase you mentioned when we talked about adding
> weekend staff. That's above the healthy 60-65% range for a business your
> size. Want to look at where the increase is coming from?

Supporting note beneath: *IntelliCEO remembers what you've discussed
before, so you never have to re-explain your business.*

Present as a clean conversational exchange, not a decision-memo format —
this matches the actual Chat interface (the persistent, top-pinned Ask bar
design), which is itself a distinctive, real product detail worth showing
accurately rather than inventing a different visual metaphor.

---

## 16.9 NEW Section: Content Studio Showcase

**Add this as a new full section**, positioned after the AI Advisor
showcase and before the Food & Beverage section — same visual treatment
and prominence as the other three product showcases (CEO Brief, Financial
Visibility, AI Advisor).

Eyebrow: **MARKETING, HANDLED**

Headline: **Real marketing content, without a marketing team.**

Copy:
> IntelliCEO writes ready-to-use marketing content grounded in your actual
> business — social posts, email campaigns, promotional announcements, and
> more. No blank page, no generic templates, no marketing hire required.

Show a realistic mockup of a generated piece of content — e.g., a short
Instagram caption promoting a real menu item, shown alongside the simple
input that generated it (content type, platform, topic). This reinforces
that it's fast and grounded in the real business, not generic AI filler.

Supporting note: *Save your favorite drafts and build a library of content
over time.*

CTA: **See Content Studio in Action**

**Positioning note for the founder:** this section signals Content
Studio's importance now, ahead of its planned growth into a larger
marketing capability — copy can be revisited and expanded as more
marketing features are built, without needing to restructure the page.

---

## 16.10 Section 9: Food & Beverage Solution — CORRECTED

Headline: **Intelligence that understands the realities behind the counter.**

Copy:
> IntelliCEO is built around the daily realities of independent food &
> beverage businesses — cash flow, food cost, labor, and the margin
> pressure that can erode a business quietly if no one's watching.

**Highlight only real, built metrics** — remove waste, inventory coverage,
hourly sales, contribution margin, repeat customer rate, and average order
value, none of which currently exist:
* Food cost percentage
* Labor cost percentage
* Prime cost
* Revenue (via Square or Clover)
* Budget vs. actual
* Break-even point

CTA: **Explore Food & Beverage**

---

## 16.11 Section 10: Differentiation — MOSTLY UNCHANGED, ONE ROW REMOVED

Keep the comparison table structure and tone as originally written. Remove
the row **"Builds long-term business memory"** unless rewritten to
accurately reflect current scope — the real, accurate claim is that
IntelliCEO remembers conversation history and stores business info/
decisions/goals, not an open-ended "long-term memory" claim. Suggest
rewording that row to: **"Remembers your business and past conversations."**

---

## 16.12 Section 11: Security — UNCHANGED

Keep exactly as originally written — the careful avoidance of unverified
compliance claims (SOC 2, HIPAA, PCI, etc.) was already correct and should
not be loosened.

---

## 16.13 Section 12: Limited Early Access — UNCHANGED

Keep as originally written — this already correctly frames beta as
curated paid early access, consistent with the actual pricing/promotion
strategy (25% off first month + 7-day trial, evolving over time), not a
free tier.

---

## 16.14 Section 13: FAQ — UNCHANGED

Keep as originally written — all answers here are accurate as written.

---

## 16.15 Section 14: Final CTA — UNCHANGED

Keep as originally written.

---

## 18. Product Page — CORRECTED LIST

Update the page section list to remove or merge anything not actually
built, and avoid redundancy with the new homepage Content Studio section:

1. Product overview
2. CEO Brief (not "Morning Brief")
3. Financial visibility (cash, runway, food cost %, prime cost %, budget
   vs. actual, break-even)
4. AI Business Advisor (with persistent memory)
5. Goals and Decisions (merge these — both are accountability/tracking
   features, don't split into separate redundant sections)
6. Content Studio (expand here with more detail/examples than the
   homepage teaser — this page is where the "depth" version of the
   showcase lives)
7. Integrations (Square, Clover — not a generic "integrations" list
   implying more exist)
8. Security
9. Product FAQ
10. Beta CTA

**Removed:** "Operational organization" as a separate line from "Goals and
accountability" — these were describing overlapping ground and should not
be two separate sections.

---

## 19. Food & Beverage Page — CORRECTED LIST

Same corrections as Section 16.10 above — remove waste, inventory,
hourly sales, contribution margin, repeat customer rate, average order
value from anywhere this page lists industry metrics. Keep the industry
challenges/use-cases narrative sections as originally written; only the
specific metrics list needs correcting.

---

## 20-33. [UNCHANGED FROM ORIGINAL BRIEF]

Pricing Page, About Page, Footer, Forms, Product Mockup System, Responsive
Behavior, Accessibility, Technical Requirements, Content Architecture, SEO,
Performance, Analytics, and the Design Quality Checklist all carry over
unchanged — these were accurate and well-built in the original brief.

**One addition to the Design Quality Checklist (Section 32):** add
*"Does every feature described actually exist in the product today?"* as a
standing check before any page is considered complete — this is the same
discipline applied throughout this correction pass, and it's worth being
a permanent part of the review checklist for any future page or copy
addition, not just this one.

---

## Summary of What Changed From the Original Brief

- "CEO Morning Brief" → "CEO Brief" everywhere, including hero mockup copy
- AI Advisor example rewritten to match actual Chat capability (grounded
  Q&A with memory, not structured scenario forecasting)
- Food & Beverage metrics lists (homepage and dedicated page) trimmed to
  only real, built metrics
- New full Content Studio showcase section added to the homepage
- Product page section list corrected to remove unbuilt features and
  merge redundant Goals/Decisions sections
- Differentiation table's "long-term business memory" row reworded to
  match actual scope
- "Specialty Retail" removed from the recognition strip — F&B only for V1
- Manrope confirmed as the permanent typeface (matches the finalized logo)
