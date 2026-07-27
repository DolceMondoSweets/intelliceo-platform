import { LegalLayout, LegalSection } from "@/components/marketing/sections/legal/LegalLayout";

const link = "text-brand-teal hover:underline";
const strong = "font-semibold text-mkt-text-primary";
const list = "list-disc space-y-2 pl-6";

export function TermsOfServiceContent() {
  return (
    <LegalLayout
      eyebrow="TERMS OF SERVICE"
      title="Terms of Service"
      lastUpdated="July 27, 2026"
      intro={
        <>
          <p>
            Welcome to IntelliCEO. These Terms of Service (&ldquo;Terms&rdquo;) govern your access
            to and use of the IntelliCEO platform, website, and related services (collectively,
            the &ldquo;Service&rdquo;), operated by IntelliCEO (&ldquo;we,&rdquo; &ldquo;us,&rdquo;
            &ldquo;our&rdquo;).
          </p>
          <p className="mt-4">
            By creating an account or using the Service, you agree to these Terms. If you
            don&rsquo;t agree, please don&rsquo;t use the Service.
          </p>
        </>
      }
    >
      <LegalSection heading="1. Acceptance of Terms">
        <p>
          By accessing or using IntelliCEO, you confirm that you are at least 18 years old, are
          using the Service on behalf of a legitimate business, and have the authority to agree
          to these Terms on that business&rsquo;s behalf if applicable.
        </p>
      </LegalSection>

      <LegalSection heading="2. Description of Service">
        <p>
          IntelliCEO is an AI-powered business intelligence platform designed for independent
          food &amp; beverage businesses. Features include, depending on your subscription plan:
          financial visibility and tracking, an AI business advisor (Chat), daily business health
          summaries (CEO Brief and Vital Signs), goal and decision tracking, marketing content
          generation (Content Studio), and point-of-sale integration (Square or Clover).
        </p>
        <p>We may add, change, or remove features over time as the Service evolves.</p>
      </LegalSection>

      <LegalSection heading="3. Eligibility">
        <p>
          IntelliCEO is currently offered to independent food &amp; beverage businesses during a
          limited early-access period. We reserve the right to determine eligibility and to
          decline or terminate service to any account at our discretion.
        </p>
      </LegalSection>

      <LegalSection heading="4. Account Registration and Security">
        <p>
          You&rsquo;re responsible for maintaining the confidentiality of your account credentials
          and for all activity that occurs under your account. Notify us immediately at
          info@intelliceo.com if you suspect unauthorized access to your account.
        </p>
        <p>
          Each business account should have one authorized owner. IntelliCEO currently supports a
          single login per business account.
        </p>
      </LegalSection>

      <LegalSection heading="5. Subscription Plans, Billing, and Cancellation">
        <p>
          <span className={strong}>Plans.</span>{" "}
          IntelliCEO is offered on paid subscription plans (currently Starter and Growth), billed
          monthly. Current pricing and plan features are listed on our{" "}
          <a href="/pricing" className={link}>
            Pricing page
          </a>
          .
        </p>
        <p>
          <span className={strong}>Free Trial.</span>{" "}
          New subscriptions include a free trial period as described at signup. A valid payment
          method is required to start a trial. If you do not cancel before the trial ends, your
          subscription will automatically begin and your payment method will be charged.
        </p>
        <p>
          <span className={strong}>Billing.</span>{" "}
          Subscriptions renew automatically each billing period until canceled. You authorize us
          (through our payment processor, Stripe) to charge your payment method for all applicable
          fees.
        </p>
        <p>
          <span className={strong}>Promotions.</span>{" "}
          From time to time we may offer promotional pricing or discount codes. Promotional terms
          are specific to each offer and do not guarantee future pricing.
        </p>
        <p>
          <span className={strong}>Cancellation.</span>{" "}
          You may cancel your subscription at any time through your account&rsquo;s billing
          settings. Cancellation stops future billing but does not entitle you to a refund for the
          current billing period unless required by law. Your account and data remain intact
          after cancellation — canceling gates access to paid features but does not delete your
          information.
        </p>
        <p>
          <span className={strong}>Plan Changes.</span>{" "}
          You may upgrade or downgrade your plan at any time. Upgrades take effect immediately,
          with a prorated charge for the difference. Downgrades may result in loss of access to
          features exclusive to a higher tier.
        </p>
      </LegalSection>

      <LegalSection heading="6. Acceptable Use">
        <p>You agree not to:</p>
        <ul className={list}>
          <li>Use the Service for any unlawful purpose</li>
          <li>Attempt to gain unauthorized access to another business&rsquo;s account or data</li>
          <li>Attempt to interfere with, disrupt, or reverse-engineer the Service</li>
          <li>Use the Service to store or transmit data you don&rsquo;t have the legal right to use</li>
          <li>Misrepresent your identity or business when creating an account</li>
        </ul>
        <p>We reserve the right to suspend or terminate accounts that violate these terms.</p>
      </LegalSection>

      <LegalSection heading="7. Your Content and Data">
        <p>
          You retain ownership of the business information, financial data, and content you input
          into or generate through IntelliCEO (&ldquo;Your Data&rdquo;). You grant us a limited
          license to use Your Data solely to provide, maintain, and improve the Service for you —
          including sending relevant data to our AI provider (Anthropic) to generate features like
          the CEO Brief and Chat.
        </p>
        <p>
          We do not claim ownership over Your Data, and we do not use it for purposes unrelated to
          providing you the Service, as described further in our{" "}
          <a href="/privacy" className={link}>
            Privacy Policy
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection heading="8. AI-Generated Content Disclaimer">
        <p>
          IntelliCEO&rsquo;s AI features — including the CEO Brief, Vital Signs, Chat, and Content
          Studio — generate insights, suggestions, and content based on the information you
          provide and general business knowledge.
        </p>
        <p className={strong}>
          This content is provided for informational purposes only and does not constitute
          professional financial, legal, tax, or accounting advice.
        </p>
        <p>
          IntelliCEO is not a licensed financial advisor, accountant, or attorney, and using the
          Service does not create such a relationship. You should consult qualified professionals
          before making significant business, financial, or legal decisions.
        </p>
        <p>
          AI-generated content may contain errors or inaccuracies. You are responsible for
          reviewing and verifying any AI-generated content or recommendation before relying on or
          acting upon it.
        </p>
      </LegalSection>

      <LegalSection heading="9. Third-Party Integrations">
        <p>
          IntelliCEO integrates with third-party services, including Square, Clover, and Stripe.
          Your use of those services is governed by their own terms and policies, which we
          encourage you to review. We are not responsible for the availability, accuracy, or
          practices of third-party services.
        </p>
      </LegalSection>

      <LegalSection heading="10. Intellectual Property">
        <p>
          The Service, including its software, design, branding, and content we create (excluding
          Your Data), is owned by IntelliCEO and protected by intellectual property laws. These
          Terms do not grant you any rights to our trademarks, logos, or brand assets except as
          necessary to use the Service as intended.
        </p>
      </LegalSection>

      <LegalSection heading="11. Disclaimers and Limitation of Liability">
        <p className="font-semibold uppercase tracking-tight">
          The Service is provided &ldquo;as is&rdquo; and &ldquo;as available,&rdquo; without
          warranties of any kind, express or implied, including but not limited to warranties of
          merchantability, fitness for a particular purpose, or non-infringement.
        </p>
        <p className="font-semibold uppercase tracking-tight">
          To the maximum extent permitted by law, IntelliCEO shall not be liable for any indirect,
          incidental, special, consequential, or punitive damages, or any loss of profits,
          revenue, data, or business opportunity, arising from your use of the Service, even if we
          have been advised of the possibility of such damages.
        </p>
        <p className="font-semibold uppercase tracking-tight">
          Our total liability for any claim arising from these Terms or the Service shall not
          exceed the amount you paid us in the three (3) months preceding the claim.
        </p>
      </LegalSection>

      <LegalSection heading="12. Indemnification">
        <p>
          You agree to indemnify and hold IntelliCEO harmless from any claims, damages, or
          expenses (including reasonable attorneys&rsquo; fees) arising from your violation of
          these Terms or your misuse of the Service.
        </p>
      </LegalSection>

      <LegalSection heading="13. Termination">
        <p>
          We may suspend or terminate your access to the Service at any time, with or without
          cause, including for violation of these Terms. You may terminate your account at any
          time by canceling your subscription and contacting us to close your account.
        </p>
        <p>
          Sections of these Terms that by their nature should survive termination (including
          Sections 7, 8, 10, 11, and 12) will survive.
        </p>
      </LegalSection>

      <LegalSection heading="14. Modifications to the Service or Terms">
        <p>
          We may modify or discontinue features of the Service at any time. We may also update
          these Terms from time to time; material changes will be reflected by an updated
          &ldquo;Last Updated&rdquo; date. Continued use of the Service after changes take effect
          constitutes acceptance of the updated Terms.
        </p>
      </LegalSection>

      <LegalSection heading="15. Governing Law and Dispute Resolution">
        <p>
          These Terms are governed by the laws of the State of Texas, without regard to conflict
          of law principles. Any dispute arising from these Terms or the Service will be resolved
          in the state or federal courts located in Texas, and you consent to jurisdiction and
          venue there.
        </p>
      </LegalSection>

      <LegalSection heading="16. Contact Information">
        <p>Questions about these Terms can be sent to:</p>
        <p className={strong}>info@intelliceo.com</p>
      </LegalSection>
    </LegalLayout>
  );
}
