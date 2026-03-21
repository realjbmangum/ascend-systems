export default function Terms() {
  return (
    <div className="bg-white py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-charcoal mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-charcoal-lighter mb-12">
          Last updated: March 2026
        </p>

        <div className="space-y-10 text-charcoal-lighter leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-charcoal mb-3">
              Services
            </h2>
            <p>
              Ascend Systems, operated by Lighthouse 27 LLC, provides custom
              software development, consulting, and technology advisory services.
              The specific scope and deliverables for each engagement are defined
              in a written agreement between Ascend Systems and the client.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-charcoal mb-3">
              Engagement
            </h2>
            <p>
              All project work is scoped and documented via a written agreement
              before work begins. This agreement outlines deliverables,
              timelines, and payment terms. No work is performed without mutual
              written consent on the scope.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-charcoal mb-3">
              Intellectual Property
            </h2>
            <p>
              Upon full payment, the client owns all custom deliverables created
              specifically for their project. Ascend Systems retains ownership of
              reusable tools, libraries, frameworks, and methodologies developed
              independently or prior to the engagement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-charcoal mb-3">
              Payment Terms
            </h2>
            <p>
              Payment is invoiced per the terms outlined in each project
              agreement. Specific payment schedules, milestones, and methods are
              agreed upon before work begins.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-charcoal mb-3">
              Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, Ascend Systems and
              Lighthouse 27 LLC shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages arising out of or
              related to the use of our services. Our total liability for any
              claim shall not exceed the amount paid by the client for the
              specific services giving rise to the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-charcoal mb-3">
              Termination
            </h2>
            <p>
              Either party may terminate an engagement with 30 days written
              notice. Upon termination, the client is responsible for payment of
              all work completed up to the termination date. Any completed
              deliverables will be transferred to the client upon final payment.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-charcoal mb-3">
              Governing Law
            </h2>
            <p>
              These terms shall be governed by and construed in accordance with
              the laws of the State of North Carolina, without regard to its
              conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-charcoal mb-3">
              Contact
            </h2>
            <p>
              If you have questions about these terms, contact us at{' '}
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
  );
}
