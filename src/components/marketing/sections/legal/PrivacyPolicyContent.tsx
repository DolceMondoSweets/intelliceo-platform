import { LegalLayout, LegalSection } from "@/components/marketing/sections/legal/LegalLayout";

const link = "text-brand-teal hover:underline";
const strong = "font-semibold text-mkt-text-primary";
const list = "list-disc space-y-2 pl-6";

export function PrivacyPolicyContent() {
  return (
    <LegalLayout
      eyebrow="PRIVACY POLICY"
      title="Privacy Policy"
      lastUpdated="July 27, 2026"
      intro={
        <>
          <p>
            IntelliCEO (&ldquo;IntelliCEO,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
            &ldquo;our&rdquo;) provides an AI-powered business intelligence platform for
            independent food &amp; beverage businesses. This Privacy Policy explains what
            information we collect, how we use it, and the choices you have.
          </p>
          <p className="mt-4">
            By using IntelliCEO, you agree to the practices described in this policy.
          </p>
        </>
      }
    >
      <LegalSection heading="1. Information We Collect">
        <p>
          <span className={strong}>Account Information.</span>{" "}
          When you sign up, we collect your email address and a securely hashed password. We
          never store your password in plain text.
        </p>
        <p>
          <span className={strong}>Business Information.</span>{" "}
          During onboarding and ongoing use, you provide information about your business —
          business name, description, products, priorities, and financial figures (cash on hand,
          monthly burn, revenue, ingredient/labor costs, budgets, and goals). This information is
          used to power the platform&rsquo;s features and is only ever accessible to your own
          account.
        </p>
        <p>
          <span className={strong}>Point-of-Sale (POS) Integration Data.</span>{" "}
          If you choose to connect a supported POS system (currently Square or Clover), we
          retrieve aggregate revenue totals for your business. We do not retrieve or store
          individual transaction details, card numbers, or customer-level purchase data from your
          POS provider. Your POS access credentials are encrypted at rest and are never stored in
          plain text.
        </p>
        <p>
          <span className={strong}>Payment Information.</span>{" "}
          All payment processing is handled directly by Stripe, our payment processor. IntelliCEO
          never receives, processes, or stores your full card number or other sensitive payment
          details. Stripe&rsquo;s own privacy practices govern that information — see{" "}
          <a href="https://stripe.com/privacy" className={link} target="_blank" rel="noreferrer">
            stripe.com/privacy
          </a>
          .
        </p>
        <p>
          <span className={strong}>AI Conversation History.</span>{" "}
          If you use IntelliCEO&rsquo;s Chat feature, your messages and the AI&rsquo;s responses
          are stored so the assistant can maintain context across conversations over time. This
          history is private to your business account.
        </p>
        <p>
          <span className={strong}>Content You Generate.</span>{" "}
          Marketing content you create using Content Studio, decisions you log, and goals you set
          are stored as part of your account.
        </p>
        <p>
          <span className={strong}>Usage and Technical Data.</span>{" "}
          We collect standard technical information — such as IP address, browser type, and
          general usage patterns — to operate, secure, and improve the platform.
        </p>
      </LegalSection>

      <LegalSection heading="2. How We Use Your Information">
        <p>We use the information we collect to:</p>
        <ul className={list}>
          <li>Provide, operate, and maintain the platform&rsquo;s features</li>
          <li>
            Generate the CEO Brief, Vital Signs, financial calculations, and other insights based
            on your business data
          </li>
          <li>Process payments and manage your subscription</li>
          <li>Communicate with you about your account, including support requests</li>
          <li>Monitor and improve platform performance, security, and reliability</li>
          <li>Comply with legal obligations</li>
        </ul>
        <p>We do not sell your information to third parties.</p>
      </LegalSection>

      <LegalSection heading="3. How We Share Your Information">
        <p>
          We share information only with the service providers necessary to operate the platform,
          and only for that purpose:
        </p>
        <ul className={list}>
          <li>
            <span className={strong}>Supabase</span>
            {" "}— database hosting, authentication, and secure file storage
          </li>
          <li>
            <span className={strong}>Stripe</span>
            {" "}— payment processing and subscription billing
          </li>
          <li>
            <span className={strong}>Anthropic</span>
            {" "}— powers the AI features (CEO Brief, Vital Signs, Chat, Content Studio). See
            Section 4 below for how this works.
          </li>
          <li>
            <span className={strong}>Square / Clover</span>
            {" "}— if you connect a POS system, to retrieve your aggregate revenue data
          </li>
          <li>
            <span className={strong}>Sentry</span>
            {" "}— error monitoring, to help us identify and fix technical issues
          </li>
          <li>
            <span className={strong}>Resend</span>
            {" "}— email delivery, for account and support communications
          </li>
        </ul>
        <p>
          Each of these providers is contractually and/or technically limited to using your
          information only to provide their specific service to us. We do not share your business
          or financial data with other businesses on the platform, advertisers, or data brokers.
        </p>
        <p>
          We may also disclose information if required by law, or to protect the rights,
          property, or safety of IntelliCEO, our users, or others.
        </p>
      </LegalSection>

      <LegalSection heading="4. AI and Your Data">
        <p>
          IntelliCEO uses Anthropic&rsquo;s AI models to generate the CEO Brief, Vital
          Signs, Chat responses, and Content Studio drafts. Your business data is sent to
          Anthropic&rsquo;s API to generate these features.
        </p>
        <p>
          Under Anthropic&rsquo;s commercial API terms, data submitted through the API is not used
          to train Anthropic&rsquo;s models. This is different from consumer AI products, which
          may have different default settings.
        </p>
        <p>
          AI-generated content is based on the information you&rsquo;ve provided and general
          business knowledge. It is not a substitute for professional financial, legal, tax, or
          accounting advice. See our Terms of Service for more detail on this point.
        </p>
      </LegalSection>

      <LegalSection heading="5. Data Security">
        <p>
          We take the security of your information seriously. Technical measures in place include
          encryption in transit (TLS), encryption at rest for stored data, encrypted storage of
          sensitive credentials like POS access tokens, and row-level data isolation ensuring no
          business can access another business&rsquo;s data.
        </p>
        <p>
          For a full description of our security practices, see our{" "}
          <a href="/security" className={link}>
            Security page
          </a>
          .
        </p>
        <p>
          No system can guarantee perfect security. If you become aware of a security issue,
          please contact us immediately at info@intelliceo.com.
        </p>
      </LegalSection>

      <LegalSection heading="6. Data Retention and Deletion">
        <p>
          We retain your information for as long as your account is active, and for a reasonable
          period afterward in case you wish to reactivate.
        </p>
        <p>
          IntelliCEO does not currently offer a fully automated self-service data export or
          deletion tool. If you would like a copy of your data, or would like your account and
          data permanently deleted, email{" "}
          <span className={strong}>info@intelliceo.com</span>
          {" "}and we will process your request, typically within a reasonable timeframe which we
          will communicate to you directly.
        </p>
        <p>
          Canceling your subscription stops billing but does not delete your account or data —
          your information remains available if you choose to reactivate.
        </p>
      </LegalSection>

      <LegalSection heading="7. Your Rights and Choices">
        <p>
          Depending on your location, you may have rights regarding your personal information,
          including the right to access, correct, or delete your data, and to object to or
          restrict certain processing.
        </p>
        <p>
          To exercise any of these rights, contact us at{" "}
          <span className={strong}>info@intelliceo.com</span>.
        </p>
      </LegalSection>

      <LegalSection heading="8. Children's Privacy">
        <p>
          IntelliCEO is intended for business use by adults. We do not knowingly collect
          information from anyone under 18. If you believe a minor has provided us with
          information, please contact us so we can remove it.
        </p>
      </LegalSection>

      <LegalSection heading="9. International Users">
        <p>
          IntelliCEO is operated from the United States, and your information will be processed
          in the United States. If you access IntelliCEO from outside the United States, you
          understand your information will be transferred to, stored, and processed in the United
          States.
        </p>
      </LegalSection>

      <LegalSection heading="10. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. If we make material changes, we
          will notify you by updating the &ldquo;Last Updated&rdquo; date above, or through other
          reasonable means.
        </p>
      </LegalSection>

      <LegalSection heading="11. Contact Us">
        <p>Questions about this Privacy Policy or your data can be sent to:</p>
        <p className={strong}>info@intelliceo.com</p>
      </LegalSection>
    </LegalLayout>
  );
}
