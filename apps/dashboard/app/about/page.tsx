import SharedPublicLayout from "@/components/SharedPublicLayout";
import Link from "next/link";

export const metadata = {
  title: "About — Nudgify",
  description: "Why Nudgify was built and who it's for.",
};

export default function AboutPage() {
  return (
    <SharedPublicLayout>
      <div className="max-w-2xl mx-auto px-6 pt-28 pb-24">
        {/* Header */}
        <div className="mb-12">
          <span className="block text-xs font-semibold uppercase tracking-wider text-blue-600 mb-3">
            Our story
          </span>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">About Nudgify</h1>
        </div>

        {/* Body */}
        <div className="prose prose-gray max-w-none">
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Nudgify was built by a founder who was tired of paying $300/mo for onboarding tools
            that required a growth engineer to set up.
          </p>
          <p className="text-base text-gray-500 leading-relaxed mb-6">
            We believe every SaaS — no matter how early — deserves great onboarding.
            Not just the ones with enterprise budgets.
          </p>
          <p className="text-base text-gray-500 leading-relaxed mb-6">
            Nudgify is designed for the 0–50K MAU stage: fast to set up, easy to manage,
            and priced for founders who are still growing. Your developer pastes one script tag.
            After that, you own it — no code changes, no pull requests, no waiting.
          </p>
          <p className="text-base text-gray-500 leading-relaxed mb-10">
            We&apos;re a small team building something we wish existed when we were starting out.
            We ship fast, we listen to customers, and we&apos;re honest about what we are and
            what we&apos;re not.
          </p>
        </div>

        <hr className="border-gray-100 mb-10" />

        {/* Values */}
        <div className="space-y-6 mb-12">
          {[
            {
              title: "Built for founders, not enterprises",
              body: "Appcues is great for teams with $300/mo budgets and dedicated growth engineers. We're built for the stage before that.",
            },
            {
              title: "Honest about trade-offs",
              body: "If you need enterprise SSO, deep CRM integrations, or A/B testing at scale, we'll tell you to use a different tool. We're really good at what we do.",
            },
            {
              title: "Fast and lightweight",
              body: "Our snippet is under 10KB. It loads async. It never blocks your app. Performance is a feature.",
            },
          ].map((v) => (
            <div key={v.title} className="flex items-start gap-4">
              <span className="shrink-0 w-7 h-7 rounded-lg bg-brand-50 flex items-center justify-center mt-0.5">
                <span className="w-2 h-2 rounded-full bg-[#4f6ef7]" />
              </span>
              <div>
                <p className="text-sm font-bold text-gray-900 mb-1">{v.title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{v.body}</p>
              </div>
            </div>
          ))}
        </div>

        <hr className="border-gray-100 mb-10" />

        {/* Contact */}
        <div className="bg-gray-50 rounded-2xl p-7">
          <p className="text-sm font-bold text-gray-900 mb-2">Get in touch</p>
          <p className="text-sm text-gray-500 leading-relaxed mb-3">
            Questions, feedback, or feature requests — we read everything and respond fast.
          </p>
          <a
            href="mailto:hello@nudgify.app"
            className="text-sm font-semibold text-[#4f6ef7] hover:underline"
          >
            hello@nudgify.app →
          </a>
        </div>

        <div className="mt-8 flex items-center gap-4">
          <Link href="/signup" className="text-sm font-semibold bg-[#4f6ef7] text-white px-5 py-2.5 rounded-full hover:bg-[#3b5af5] transition-colors">
            Start for free
          </Link>
          <Link href="/compare" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            See how we compare →
          </Link>
        </div>
      </div>
    </SharedPublicLayout>
  );
}
