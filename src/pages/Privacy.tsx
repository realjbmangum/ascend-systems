import SEO from '../components/SEO';

export default function Privacy() {
  return (
    <>
      <SEO
        title="Privacy Policy | Ascend Systems"
        description="Privacy policy for Ascend Systems. Learn how we collect, use, and protect your information."
      />
      <div className="bg-white py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-charcoal mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-charcoal-lighter mb-12">
          Last updated: March 2026
        </p>

        <div className="space-y-10 text-charcoal-lighter leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-charcoal mb-3">
              Information We Collect
            </h2>
            <p>
              When you use our contact form or engage with our services, we may
              collect the following information:
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-1">
              <li>Name</li>
              <li>Email address</li>
              <li>Company name</li>
              <li>Project details and requirements you share with us</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-charcoal mb-3">
              How We Use Your Information
            </h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 mt-3 space-y-1">
              <li>Respond to your inquiries and project requests</li>
              <li>Communicate about ongoing engagements</li>
              <li>Improve our services and website experience</li>
            </ul>
            <p className="mt-3">
              We do not sell, rent, or share your personal information with third
              parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-charcoal mb-3">
              Data Storage
            </h2>
            <p>
              Your data is stored using Cloudflare D1, a US-based database
              service. We take reasonable measures to protect your information
              from unauthorized access, alteration, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-charcoal mb-3">
              Third-Party Services
            </h2>
            <p>We use the following third-party services in operating our business:</p>
            <ul className="list-disc pl-6 mt-3 space-y-1">
              <li>
                <strong>Cloudflare</strong> — hosting, DNS, and data storage
              </li>
              <li>
                <strong>Calendly</strong> — scheduling consultations
              </li>
            </ul>
            <p className="mt-3">
              These services have their own privacy policies governing how they
              handle your data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-charcoal mb-3">
              Your Rights
            </h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 mt-3 space-y-1">
              <li>Request access to the personal data we hold about you</li>
              <li>Request deletion of your personal data</li>
              <li>Opt out of any future communications</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, contact us at the email below.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-charcoal mb-3">
              Contact
            </h2>
            <p>
              If you have questions about this privacy policy, contact us at{' '}
              <a
                href="mailto:hello@ascendsystems.ai"
                className="text-orange hover:text-orange-dark underline"
              >
                hello@ascendsystems.ai
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
    </>
  );
}
