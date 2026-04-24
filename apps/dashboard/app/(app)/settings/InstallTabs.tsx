"use client";

import { useState } from "react";

interface Props {
  apiKey: string;
  snippetUrl: string;
}

export default function InstallTabs({ apiKey, snippetUrl }: Props) {
  const [tab, setTab] = useState<"simple" | "advanced">("simple");
  const [copied, setCopied] = useState(false);

  const simpleCode =
    `<script src="${snippetUrl}" async></script>\n` +
    `<script>FlowLift.init("${apiKey}")</script>`;

  const advancedCode =
    `<script src="${snippetUrl}" async></script>\n` +
    `<script>\n` +
    `  FlowLift.init("${apiKey}");\n` +
    `  FlowLift.identify({ id: user.id, plan: user.plan });\n` +
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

      <p className="mt-2 text-xs text-gray-400">
        {tab === "simple"
          ? "That's it. No identify() needed to get started."
          : "Add this after your user logs in for smarter targeting."}
      </p>
    </div>
  );
}
