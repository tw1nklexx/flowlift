"use client";

import { useState } from "react";
import { Lightbulb } from "lucide-react";

interface Props {
  apiKey: string;
}

export default function InstallTabs({ apiKey }: Props) {
  const [tab, setTab] = useState<"simple" | "advanced">("simple");
  const [copied, setCopied] = useState(false);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://nudgify.app";

  const simpleCode =
    `<!-- Add before closing </body> tag in your HTML -->\n` +
    `<script src="${appUrl}/snippet" async></script>\n` +
    `<script>\n` +
    `  Nudgify.init("${apiKey}"); // ← your project key\n` +
    `</script>`;

  const advancedCode =
    `<!-- Add before closing </body> tag -->\n` +
    `<script src="${appUrl}/snippet" async></script>\n` +
    `<script>\n` +
    `  Nudgify.init("${apiKey}");\n` +
    `\n` +
    `  // Call this after your user logs in:\n` +
    `  Nudgify.identify({\n` +
    `    id: user.id,        // required: your user's unique ID\n` +
    `    plan: user.plan,    // "free" | "pro" — for plan-based targeting\n` +
    `  });\n` +
    `</script>`;

  const code = tab === "simple" ? simpleCode : advancedCode;

  function copy() {
    navigator.clipboard.writeText(code).catch(() => {
      const el = document.createElement("textarea");
      el.value = code;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <div className="flex gap-0 border border-gray-200 rounded-lg overflow-hidden w-fit mb-3">
        {(["simple", "advanced"] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setCopied(false); }}
            className={`px-3 py-1.5 text-xs font-semibold transition-colors capitalize ${
              tab === t
                ? "bg-[#4f6ef7] text-white"
                : "bg-white text-gray-500 hover:text-gray-800"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="relative">
        <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 text-xs overflow-x-auto leading-relaxed">
          {code}
        </pre>
        <button
          onClick={copy}
          className="absolute top-2 right-2 text-xs font-medium text-gray-400 hover:text-emerald-400 transition-colors bg-gray-800 px-2 py-1 rounded"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>

      {tab === "simple" ? (
        <div className="mt-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg p-3 text-xs text-blue-800 leading-relaxed">
          📌 <strong>Where to add this:</strong> In your app&apos;s main HTML file (e.g.{" "}
          <code className="bg-blue-100 px-1 rounded">index.html</code>,{" "}
          <code className="bg-blue-100 px-1 rounded">_document.tsx</code>), just before the closing{" "}
          <code className="bg-blue-100 px-1 rounded">&lt;/body&gt;</code> tag. Your developer does
          this once — you manage everything else from the dashboard.
        </div>
      ) : (
        <div className="mt-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg p-3 text-xs text-blue-800 leading-relaxed">
          <Lightbulb size={13} className="inline-block mr-1 text-blue-500 shrink-0" aria-hidden="true" /><strong>When to use identify():</strong> Call it right after your user authenticates.
          Enables targeting by plan, role, or user properties. Without it, Nudgify still works
          but targets all users equally.
        </div>
      )}
    </div>
  );
}
