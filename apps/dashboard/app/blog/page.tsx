import SharedPublicLayout from "@/components/SharedPublicLayout";

export const metadata = {
  title: "Blog — Nudgify",
  description: "Thoughts on SaaS onboarding, activation, and growth.",
};

export default function BlogPage() {
  return (
    <SharedPublicLayout>
      <div className="max-w-3xl mx-auto px-6 pt-28 pb-24">
        {/* Header */}
        <div className="mb-14">
          <span className="block text-xs font-semibold uppercase tracking-wider text-blue-600 mb-3">
            Blog
          </span>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-3">Blog</h1>
          <p className="text-lg text-gray-500">
            Thoughts on SaaS onboarding, activation, and growth.
          </p>
        </div>

        {/* Empty state */}
        <div className="bg-gray-50 rounded-3xl px-10 py-16 text-center">
          {/* Illustration placeholder */}
          <div className="flex items-center justify-center gap-1.5 mb-8 mx-auto">
            <div className="w-8 h-10 bg-gray-200 rounded-lg" />
            <div className="w-8 h-14 bg-gray-300 rounded-lg" />
            <div className="w-8 h-10 bg-gray-200 rounded-lg" />
          </div>

          <h2 className="text-lg font-bold text-gray-900 mb-2">Posts coming soon</h2>
          <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed mb-6">
            We&apos;re working on guides about SaaS onboarding, activation rate optimization,
            and how founders use Nudgify.
          </p>
          <p className="text-sm text-gray-400">
            Get notified when we publish:{" "}
            <a
              href="mailto:hello@nudgify.app?subject=Blog updates"
              className="text-[#4f6ef7] hover:underline font-medium"
            >
              hello@nudgify.app
            </a>
          </p>
        </div>
      </div>
    </SharedPublicLayout>
  );
}
