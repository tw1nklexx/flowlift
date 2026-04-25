import SharedPublicLayout from "@/components/SharedPublicLayout";

export const metadata = {
  title: "Terms of Service — Nudgify",
  description: "Terms of service for Nudgify.",
};

export default function TermsPage() {
  return (
    <SharedPublicLayout>
      <div className="max-w-2xl mx-auto px-6 pt-28 pb-24">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-sm text-gray-400">Last updated: April 2026</p>
        </div>

        <div className="space-y-10 text-sm text-gray-600 leading-relaxed">
          <Section title="1. Service description">
            <p>
              Nudgify provides a software-as-a-service platform for creating, managing, and analyzing
              in-app onboarding flows. The service includes a web dashboard and a JavaScript snippet
              for embedding in your application.
            </p>
          </Section>

          <Section title="2. Free and paid plans">
            <p>
              Nudgify offers a free plan with limited features (500 monthly active users, 1 active flow)
              and paid plans with expanded limits. Paid plans are billed monthly or annually via Stripe.
              You can cancel your paid plan at any time; access continues until the end of the billing period.
            </p>
            <p className="mt-3">
              We reserve the right to change pricing with 30 days notice to active subscribers.
            </p>
          </Section>

          <Section title="3. Acceptable use">
            <p>You agree not to use Nudgify to:</p>
            <ul className="mt-3 space-y-1.5 list-disc list-inside">
              <li>Display deceptive, misleading, or fraudulent content to your users.</li>
              <li>Collect personal data without proper consent from your end-users.</li>
              <li>Interfere with or attempt to gain unauthorized access to our infrastructure.</li>
              <li>Resell or sublicense the service without written permission.</li>
              <li>Violate any applicable laws or regulations.</li>
            </ul>
          </Section>

          <Section title="4. Intellectual property">
            <p>
              You retain ownership of all content you create in Nudgify (flow text, designs, targeting rules).
              You grant Nudgify a limited license to store and process this content to provide the service.
            </p>
            <p className="mt-3">
              The Nudgify platform, snippet, and dashboard are the intellectual property of Nudgify.
              You may not copy, modify, or distribute them without permission.
            </p>
          </Section>

          <Section title="5. No warranty">
            <p>
              Nudgify is provided &ldquo;as is&rdquo; without warranty of any kind, express or implied.
              We do not warrant that the service will be uninterrupted, error-free, or free of viruses
              or other harmful components. Use of the service is at your own risk.
            </p>
          </Section>

          <Section title="6. Limitation of liability">
            <p>
              To the maximum extent permitted by law, Nudgify&apos;s total liability for any claim arising
              from your use of the service is limited to the amount you paid us in the 12 months
              preceding the claim. We are not liable for indirect, incidental, special, or consequential
              damages.
            </p>
          </Section>

          <Section title="7. Termination">
            <p>
              Either party may terminate the agreement at any time. We may suspend or terminate your
              account if you violate these terms. Upon termination, your data will be deleted within
              30 days unless you request an earlier deletion.
            </p>
          </Section>

          <Section title="8. Governing law">
            <p>
              These terms are governed by the laws of the jurisdiction in which Nudgify is incorporated.
              Any disputes will be resolved through binding arbitration before resorting to litigation.
            </p>
          </Section>

          <Section title="9. Contact">
            <p>
              Questions about these terms?{" "}
              <a href="mailto:hello@nudgify.app" className="text-[#4f6ef7] hover:underline">
                hello@nudgify.app
              </a>
            </p>
          </Section>
        </div>
      </div>
    </SharedPublicLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-base font-bold text-gray-900 mb-3">{title}</h2>
      {children}
    </div>
  );
}
