import SharedPublicLayout from "@/components/SharedPublicLayout";

export const metadata = {
  title: "Privacy Policy — Nudgify",
  description: "How Nudgify collects and uses your data.",
};

export default function PrivacyPage() {
  return (
    <SharedPublicLayout>
      <div className="max-w-2xl mx-auto px-6 pt-28 pb-24">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-400">Last updated: April 2026</p>
        </div>

        <div className="space-y-10 text-sm text-gray-600 leading-relaxed">
          <Section title="What data we collect">
            <p>We collect the following data when you use Nudgify:</p>
            <ul className="mt-3 space-y-1.5 list-disc list-inside">
              <li><strong className="text-gray-800">Account data:</strong> your email address and password hash when you sign up.</li>
              <li><strong className="text-gray-800">Usage events:</strong> when your end-users interact with flows (flow_shown, step_advanced, flow_completed, flow_dismissed). These events are attributed to your project, not linked to personal identity unless you call <code className="bg-gray-100 px-1 rounded">Nudgify.identify()</code>.</li>
              <li><strong className="text-gray-800">Flow analytics:</strong> aggregate impression and completion counts per flow.</li>
              <li><strong className="text-gray-800">Billing data:</strong> subscription status and plan tier, processed by Stripe. We do not store card numbers.</li>
            </ul>
          </Section>

          <Section title="How we use your data">
            <p>We use your data solely to provide and improve the Nudgify service:</p>
            <ul className="mt-3 space-y-1.5 list-disc list-inside">
              <li>To show you analytics for your flows in the dashboard.</li>
              <li>To evaluate targeting rules and decide which flows to show to your users.</li>
              <li>To send you transactional emails (account creation, billing receipts).</li>
            </ul>
            <p className="mt-4 font-medium text-gray-800">We never sell, share, or rent your data to third parties.</p>
          </Section>

          <Section title="Data storage">
            <p>
              All data is stored in Supabase with Row-Level Security enabled. Each project is isolated —
              your data is not accessible to other accounts. Our Supabase instance is hosted in the
              EU region (Frankfurt).
            </p>
          </Section>

          <Section title="Cookies and localStorage">
            <p>
              The Nudgify snippet uses <strong className="text-gray-800">localStorage only</strong> — no tracking cookies.
              We store a record of which flows a user has seen so we don&apos;t show them twice.
              This data never leaves the user&apos;s browser and is cleared when they call{" "}
              <code className="bg-gray-100 px-1 rounded">Nudgify.reset()</code> or clear their browser storage.
            </p>
            <p className="mt-3">
              The dashboard application uses a secure HttpOnly session cookie for authentication only.
              No advertising or tracking cookies are used.
            </p>
          </Section>

          <Section title="Your rights">
            <p>
              You can request deletion of your account and all associated data at any time by emailing{" "}
              <a href="mailto:hello@nudgify.app" className="text-[#4f6ef7] hover:underline">
                hello@nudgify.app
              </a>
              . We will delete your data within 30 days.
            </p>
          </Section>

          <Section title="Changes to this policy">
            <p>
              If we make material changes to this policy, we will notify you by email at the address
              associated with your account. Continued use of the service after changes constitutes
              acceptance of the updated policy.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Questions about this privacy policy?{" "}
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
