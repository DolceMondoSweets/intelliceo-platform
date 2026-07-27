// Single source of truth for the current early-access promotion, per the
// "Beta will always be paid, promotions will vary over time" decision —
// change this one constant to swap the offer sitewide (homepage, pricing
// page) without touching any page or section component. Not enforced by
// any Stripe coupon/percent_off in this codebase — the discount itself is
// configured directly in the Stripe Dashboard; this is display copy only.
export const currentPromotion = {
  // Used inline within a sentence, e.g. "...gets a 7-day trial and {shortLabel}."
  shortLabel: "25% off the first month",
  // Used as a standalone bullet/list item.
  bullet: "25% off your first month",
};
