"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PartyPopper, TrendingUp, Sparkles, Undo2, HelpCircle } from "lucide-react";
import type { Flow, Step, StepType, TargetingRules, Condition, ConditionType } from "@/types";
import PreviewModal from "@/components/PreviewModal";
import { GuidedTour, TOUR_STORAGE_KEY } from "@/components/GuidedTour";

interface Props {
  projectId: string;
  initialFlow?: Flow;
  apiKey?: string;
}

const DEFAULT_STEP: Record<StepType, Step> = {
  modal: {
    type: "modal",
    title: "Welcome!",
    body: "Here's something important for you.",
    cta_label: "Next",
    cta_action: "next",
  },
  tooltip: {
    type: "tooltip",
    body: "Click here to get started.",
    cta_label: "Got it",
    cta_action: "next",
    target_selector: "",
  },
  banner: {
    type: "banner",
    body: "New feature available!",
    cta_label: "Learn more",
    cta_action: "next",
  },
};

export default function FlowBuilder({ projectId, initialFlow, apiKey }: Props) {
  const router = useRouter();
  const [name, setName] = useState(initialFlow?.name ?? "Untitled Flow");
  const [steps, setSteps] = useState<Step[]>(initialFlow?.steps ?? []);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(steps.length > 0 ? 0 : null);
  const [targeting, setTargeting] = useState<TargetingRules>(
    initialFlow?.targeting_rules ?? { conditions: [] },
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [published, setPublished] = useState(false);
  const [countdown, setCountdown] = useState(6);
  const [activeTab, setActiveTab] = useState<"content" | "design" | "targeting">("content");
  const [previewing, setPreviewing] = useState(false);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(TOUR_STORAGE_KEY)) setShowTour(true);
  }, []);

  const selectedStep = selectedIdx !== null ? steps[selectedIdx] : null;

  function addStep(type: StepType) {
    const newStep = { ...DEFAULT_STEP[type] };
    const newSteps = [...steps, newStep];
    setSteps(newSteps);
    setSelectedIdx(newSteps.length - 1);
    setActiveTab("content");
  }

  function removeStep(idx: number) {
    const newSteps = steps.filter((_, i) => i !== idx);
    setSteps(newSteps);
    setSelectedIdx(newSteps.length > 0 ? Math.min(idx, newSteps.length - 1) : null);
  }

  function updateStep(idx: number, patch: Partial<Step>) {
    setSteps(steps.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  }

  function addCondition() {
    setTargeting({
      ...targeting,
      conditions: [
        ...targeting.conditions,
        { type: "url_contains", value: "" },
      ],
    });
  }

  function updateCondition(idx: number, patch: Partial<Condition>) {
    setTargeting({
      ...targeting,
      conditions: targeting.conditions.map((c, i) => (i === idx ? { ...c, ...patch } : c)),
    });
  }

  function removeCondition(idx: number) {
    setTargeting({
      ...targeting,
      conditions: targeting.conditions.filter((_, i) => i !== idx),
    });
  }

  async function deleteFlow() {
    if (!initialFlow?.id) return;
    if (!confirm("Delete this flow? This cannot be undone.")) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("flows").delete().eq("id", initialFlow.id);
    router.push("/flows");
    router.refresh();
  }

  useEffect(() => {
    if (!published) return;
    setCountdown(6);
    const redirect = setTimeout(() => {
      router.push("/flows");
      router.refresh();
    }, 6000);
    const tick = setInterval(() => {
      setCountdown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => { clearTimeout(redirect); clearInterval(tick); };
  }, [published, router]);

  async function save(publish: boolean) {
    setSaving(true);
    const supabase = createClient();
    const payload = {
      project_id: projectId,
      name,
      steps,
      targeting_rules: targeting,
      is_active: publish,
    };

    if (initialFlow?.id) {
      await supabase.from("flows").update(payload).eq("id", initialFlow.id);
    } else {
      await supabase.from("flows").insert(payload);
    }
    setSaving(false);

    if (publish) {
      setPublished(true);
    } else {
      router.push("/flows");
      router.refresh();
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/flows")}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            ← Flows
          </button>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-lg font-semibold text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-brand-500 focus:outline-none px-1 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          {initialFlow?.id && (
            <button
              onClick={deleteFlow}
              disabled={deleting}
              className="px-4 py-1.5 text-sm border border-red-200 rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-50 transition-colors"
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          )}
          <button
            onClick={() => setShowTour(true)}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
            title="How to use the builder"
            aria-label="Open builder walkthrough"
          >
            <HelpCircle size={16} />
          </button>
          <button
            onClick={() => save(false)}
            disabled={saving || deleting}
            className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Save draft
          </button>
          <button
            onClick={() => setPreviewing(true)}
            disabled={steps.length === 0}
            className="px-4 py-1.5 text-sm border border-brand-300 rounded-lg text-brand-600 hover:bg-brand-50 disabled:opacity-50 transition-colors flex items-center gap-1.5"
          >
            <span className="text-[10px]">▶</span> Preview
          </button>
          <button
            data-tour="publish-btn"
            onClick={() => save(true)}
            disabled={saving || deleting || steps.length === 0}
            className="px-4 py-1.5 text-sm bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving…" : "Publish"}
          </button>
        </div>
      </div>

      {previewing && (
        <PreviewModal
          steps={steps}
          flowName={name}
          onClose={() => setPreviewing(false)}
        />
      )}

      {showTour && <GuidedTour onClose={() => setShowTour(false)} />}

      {published && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[480px] overflow-hidden">
            {/* Top accent */}
            <div className="h-1 bg-gradient-to-r from-[#4f6ef7] via-[#7c9bff] to-[#4f6ef7]" />

            <div className="p-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-50 mx-auto mb-4">
                <PartyPopper size={32} className="text-brand-600" aria-hidden="true" />
              </div>

              {/* Headline */}
              <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
                Flow published!
              </h2>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Your users will see this flow automatically.
                <br />No deployment needed.
              </p>

              {/* Metrics prediction */}
              <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 mb-4 text-left">
                <p className="text-sm text-green-800 font-medium flex items-center gap-1.5">
                  <TrendingUp size={14} aria-hidden="true" />
                  Flows like this typically improve activation by 15–25%
                </p>
              </div>

              {/* Install reminder — only for first flow (no existing id) */}
              {apiKey && !initialFlow?.id && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-4 text-left">
                  <div className="bg-gray-900 rounded-lg px-4 py-2.5 mb-2">
                    <pre className="text-emerald-400 text-xs font-mono overflow-x-auto">{`Nudgify.init("${apiKey}");`}</pre>
                  </div>
                  <p className="text-xs text-blue-700">
                    Make sure the snippet is installed →{" "}
                    <a href="/settings" className="font-semibold underline underline-offset-2 hover:text-blue-900">
                      Settings
                    </a>
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => { router.push("/flows"); router.refresh(); }}
                  className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors font-medium"
                >
                  ← Back to flows
                </button>
                <button
                  onClick={() => router.push("/flows/new")}
                  className="flex-1 px-4 py-2.5 text-sm bg-[#4f6ef7] text-white rounded-xl hover:bg-[#3b5af5] transition-colors font-semibold shadow-sm"
                >
                  Create another →
                </button>
              </div>

              {/* Countdown */}
              <p className="text-xs text-gray-300 mt-4 tabular-nums">
                Redirecting in {countdown}…
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3-column body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Step list */}
        <div data-tour="steps" className="w-56 bg-white border-r border-gray-200 flex flex-col">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Steps</p>
          </div>
          <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
            {steps.length === 0 && (
              <p className="text-xs text-gray-400 text-center pt-6 px-2">
                Add a step to get started
              </p>
            )}
            {steps.map((step, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedIdx(idx)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer group transition-colors ${
                  selectedIdx === idx
                    ? "bg-brand-50 border border-brand-200"
                    : "hover:bg-gray-50 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <StepTypeIcon type={step.type} />
                  <span className="text-xs font-medium text-gray-700 truncate">
                    {step.title || step.body.slice(0, 20) || step.type}
                  </span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeStep(idx); }}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 text-xs transition-all"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className="px-2 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center mb-2">Add step</p>
            <div className="grid grid-cols-3 gap-1">
              {(["modal", "tooltip", "banner"] as StepType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => addStep(type)}
                  className="text-xs py-1.5 border border-gray-200 rounded-md text-gray-600 hover:bg-brand-50 hover:border-brand-300 hover:text-brand-700 transition-colors capitalize"
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Preview */}
        <div data-tour="preview" className="flex-1 flex items-center justify-center bg-gray-100 p-8">
          {selectedStep ? (
            <StepPreview step={selectedStep} />
          ) : (
            <div className="text-center">
              <p className="text-4xl mb-3">👈</p>
              <p className="text-sm text-gray-400">Select or add a step to preview it</p>
            </div>
          )}
        </div>

        {/* Right: Properties */}
        <div className="w-72 bg-white border-l border-gray-200 flex flex-col">
          <div className="flex border-b border-gray-200">
            {(["Content", "Design", "Targeting"] as const).map((label) => {
              const tab = label.toLowerCase() as "content" | "design" | "targeting";
              return (
                <button
                  key={tab}
                  data-tour={`tab-${tab}`}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-xs font-medium transition-colors ${
                    activeTab === tab
                      ? "text-brand-600 border-b-2 border-brand-600"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {label}
                  {tab === "targeting" && (targeting.conditions.length > 0 || targeting.idle_seconds != null) && (
                    <span className="ml-1 bg-brand-100 text-brand-600 text-xs px-1.5 py-0.5 rounded-full">
                      {targeting.conditions.length + (targeting.idle_seconds != null ? 1 : 0)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            {activeTab === "content" && selectedStep !== null && selectedIdx !== null ? (
              <ContentPanel
                step={selectedStep}
                onChange={(patch) => updateStep(selectedIdx, patch)}
              />
            ) : activeTab === "content" ? (
              <p className="text-sm text-gray-400 text-center mt-8">
                Select a step on the left
              </p>
            ) : activeTab === "design" && selectedStep !== null && selectedIdx !== null ? (
              <DesignPanel
                step={selectedStep}
                onChange={(patch) => updateStep(selectedIdx, patch)}
              />
            ) : activeTab === "design" ? (
              <p className="text-sm text-gray-400 text-center mt-8">
                Select a step on the left
              </p>
            ) : (
              <TargetingPanel
                rules={targeting}
                onAddCondition={addCondition}
                onUpdateCondition={updateCondition}
                onRemoveCondition={removeCondition}
                onIdleChange={(seconds) =>
                  setTargeting({ ...targeting, idle_seconds: seconds ?? undefined })
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Helpers ---

function hexToRgba(hex: string, opacity: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity / 100})`;
}

// --- Sub-components ---

function StepTypeIcon({ type }: { type: StepType }) {
  return (
    <span className="text-sm">
      {type === "modal" ? "🪟" : type === "tooltip" ? "💬" : "📢"}
    </span>
  );
}

function StepPreview({ step }: { step: Step }) {
  const btnColor       = step.btnColor        ?? "#4f6ef7";
  const btnTextColor   = step.btnTextColor    ?? "#ffffff";
  const btnRadius      = step.btnBorderRadius ?? 8;
  const bodyFontSize   = step.bodyFontSize    ?? 15;
  const containerRadius = step.containerRadius ?? 16;
  const intensity      = step.shadowIntensity ?? 50;
  const shadow         = `0 ${intensity * 0.2}px ${intensity * 0.6}px rgba(0,0,0,${intensity / 250})`;

  if (step.type === "modal") {
    const titleColor   = step.titleColor    ?? "#111111";
    const titleSize    = step.titleFontSize ?? 20;
    const overlayBg    = hexToRgba(step.overlayColor ?? "#000000", step.overlayOpacity ?? 45);
    return (
      <div
        className="w-full max-w-lg rounded-2xl p-6 flex items-center justify-center"
        style={{ background: overlayBg }}
      >
        <div className="bg-white w-full p-8" style={{ borderRadius: containerRadius, boxShadow: shadow }}>
          {step.title && (
            <h2 className="font-bold mb-3" style={{ color: titleColor, fontSize: titleSize }}>
              {step.title}
            </h2>
          )}
          <p className="mb-6" style={{ color: "#555", fontSize: bodyFontSize }}>{step.body}</p>
          <button
            className="px-5 py-2 text-sm font-semibold"
            style={{ backgroundColor: btnColor, color: btnTextColor, borderRadius: btnRadius }}
          >
            {step.cta_label}
          </button>
        </div>
      </div>
    );
  }

  if (step.type === "banner") {
    const bannerBg    = step.bgColor      ?? "#4f6ef7";
    const bannerPad   = step.bannerPadding ?? 12;
    return (
      <div className="w-full max-w-2xl flex flex-col gap-1">
        {step.position === "bottom" && (
          <p className="text-xs text-gray-400 text-center mb-1">↓ Anchored to bottom</p>
        )}
        <div
          className="flex items-center justify-between shadow-lg"
          style={{ backgroundColor: bannerBg, borderRadius: containerRadius, padding: `${bannerPad}px 24px` }}
        >
          <p style={{ color: "#ffffff", flex: 1, fontSize: bodyFontSize }}>{step.body}</p>
          <button
            className="ml-6 font-semibold text-xs whitespace-nowrap px-4 py-1.5"
            style={{ color: bannerBg, backgroundColor: "#fff", borderRadius: btnRadius }}
          >
            {step.cta_label}
          </button>
        </div>
        {step.position !== "bottom" && (
          <p className="text-xs text-gray-400 text-center mt-1">↑ Anchored to top</p>
        )}
      </div>
    );
  }

  // tooltip
  const tooltipBg = "#1a1a2e";
  return (
    <div className="relative">
      {step.target_selector && (
        <p className="mb-2 text-xs text-gray-400 text-center">
          Anchored to: <code className="bg-gray-100 px-1 rounded">{step.target_selector}</code>
        </p>
      )}
      <div
        className="text-white px-5 py-4 max-w-xs"
        style={{ backgroundColor: tooltipBg, borderRadius: containerRadius, boxShadow: shadow }}
      >
        <p className="mb-3" style={{ color: "#e5e7eb", fontSize: bodyFontSize }}>
          {step.body}
        </p>
        <button
          className="px-3 py-1 text-xs font-semibold"
          style={{ backgroundColor: btnColor, color: btnTextColor, borderRadius: btnRadius }}
        >
          {step.cta_label}
        </button>
        <div className="absolute -bottom-2 left-6 w-3 h-3 rotate-45" style={{ backgroundColor: tooltipBg }} />
      </div>
    </div>
  );
}

function ContentPanel({
  step,
  onChange,
}: {
  step: Step;
  onChange: (patch: Partial<Step>) => void;
}) {
  const [aiLoading, setAiLoading] = useState(false);
  const [undoPrev, setUndoPrev] = useState<{ title?: string; body: string; cta_label: string } | null>(null);
  const [undoTimer, setUndoTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  async function handleImprove() {
    if (!step.body || aiLoading) return;
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/improve-step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: step.type,
          title: step.title,
          body: step.body,
          cta_label: step.cta_label,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const improved = await res.json();
      // Save previous for undo
      setUndoPrev({ title: step.title, body: step.body, cta_label: step.cta_label });
      // Apply improvements
      const patch: Partial<Step> = { body: improved.body, cta_label: improved.cta_label };
      if (step.type === "modal" && improved.title) patch.title = improved.title;
      onChange(patch);
      // Auto-clear undo after 5s
      if (undoTimer) clearTimeout(undoTimer);
      const t = setTimeout(() => setUndoPrev(null), 5000);
      setUndoTimer(t);
    } catch {
      // silently fail — user content unchanged
    } finally {
      setAiLoading(false);
    }
  }

  function handleUndo() {
    if (!undoPrev) return;
    onChange({ title: undoPrev.title, body: undoPrev.body, cta_label: undoPrev.cta_label });
    setUndoPrev(null);
    if (undoTimer) clearTimeout(undoTimer);
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
        <div className="text-sm text-gray-700 capitalize bg-gray-50 px-3 py-2 rounded-lg">
          <StepTypeIcon type={step.type} /> {step.type}
        </div>
      </div>

      {step.type === "modal" && (
        <Field label="Title">
          <input
            value={step.title ?? ""}
            onChange={(e) => onChange({ title: e.target.value })}
            className={inputCls}
            placeholder="Step title"
          />
        </Field>
      )}

      <Field label="Body">
        <textarea
          value={step.body}
          onChange={(e) => onChange({ body: e.target.value })}
          rows={3}
          className={inputCls}
          placeholder="Explain what the user should do or know"
        />
      </Field>

      {/* AI improve button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleImprove}
          disabled={aiLoading || !step.body.trim()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity cursor-pointer"
        >
          <Sparkles size={12} />
          {aiLoading ? "Improving…" : "Improve with AI"}
        </button>
        {undoPrev && (
          <button
            type="button"
            onClick={handleUndo}
            className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <Undo2 size={11} />
            Undo
          </button>
        )}
      </div>

      {step.type === "tooltip" && (
        <Field label="Target selector">
          <>
            <input
              value={step.target_selector ?? ""}
              onChange={(e) => onChange({ target_selector: e.target.value })}
              className={inputCls}
              placeholder="#element-id or .class-name"
            />
            <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
              Paste the CSS selector of the element to highlight. Right-click in Chrome → Inspect → copy the id or class.
            </p>
          </>
        </Field>
      )}

      <Field label="Button label">
        <input
          value={step.cta_label}
          onChange={(e) => onChange({ cta_label: e.target.value })}
          className={inputCls}
        />
      </Field>

      <Field label="Button action">
        <select
          value={step.cta_action}
          onChange={(e) => onChange({ cta_action: e.target.value as "next" | "complete" })}
          className={inputCls}
        >
          <option value="next">Next step</option>
          <option value="complete">Complete flow</option>
        </select>
      </Field>
    </div>
  );
}

function Collapsible({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide hover:bg-gray-100 transition-colors"
      >
        {title}
        <span className="text-gray-400 text-xs">{open ? "▲" : "▼"}</span>
      </button>
      {open && <div className="px-3 py-3 space-y-3">{children}</div>}
    </div>
  );
}

function DesignPanel({
  step,
  onChange,
}: {
  step: Step;
  onChange: (patch: Partial<Step>) => void;
}) {
  return (
    <div className="space-y-3">
      <Collapsible title="Typography">
        {step.type === "modal" && (
          <>
            <ColorField
              label="Title color"
              value={step.titleColor ?? "#111111"}
              onChange={(v) => onChange({ titleColor: v })}
            />
            <SliderField
              label="Title size"
              value={step.titleFontSize ?? 20}
              min={16} max={40} unit="px"
              onChange={(v) => onChange({ titleFontSize: v })}
            />
          </>
        )}
        <SliderField
          label="Body size"
          value={step.bodyFontSize ?? 15}
          min={11} max={24} unit="px"
          onChange={(v) => onChange({ bodyFontSize: v })}
        />
      </Collapsible>

      <Collapsible title="Button">
        <ColorField
          label="Button color"
          value={step.btnColor ?? "#4f6ef7"}
          onChange={(v) => onChange({ btnColor: v })}
        />
        <ColorField
          label="Text color"
          value={step.btnTextColor ?? "#ffffff"}
          onChange={(v) => onChange({ btnTextColor: v })}
        />
        <SliderField
          label="Corner radius"
          value={step.btnBorderRadius ?? 8}
          min={0} max={24} unit="px"
          onChange={(v) => onChange({ btnBorderRadius: v })}
        />
      </Collapsible>

      <Collapsible title="Container">
        <SliderField
          label="Corner radius"
          value={step.containerRadius ?? 16}
          min={0} max={24} unit="px"
          onChange={(v) => onChange({ containerRadius: v })}
        />
        <SliderField
          label="Shadow"
          value={step.shadowIntensity ?? 50}
          min={0} max={100} unit=""
          onChange={(v) => onChange({ shadowIntensity: v })}
        />
        <Field label="Animation">
          <select
            value={step.animation ?? "fade"}
            onChange={(e) =>
              onChange({ animation: e.target.value as "fade" | "slide" | "bounce" | "none" })
            }
            className={inputCls}
          >
            <option value="none">None</option>
            <option value="fade">Fade</option>
            <option value="slide">Slide up</option>
            <option value="bounce">Bounce</option>
          </select>
        </Field>

        {step.type === "modal" && (
          <>
            <ColorField
              label="Overlay color"
              value={step.overlayColor ?? "#000000"}
              onChange={(v) => onChange({ overlayColor: v })}
            />
            <SliderField
              label="Overlay opacity"
              value={step.overlayOpacity ?? 45}
              min={0} max={100} unit="%"
              onChange={(v) => onChange({ overlayOpacity: v })}
            />
          </>
        )}

        {step.type === "banner" && (
          <>
            <ColorField
              label="Background"
              value={step.bgColor ?? "#4f6ef7"}
              onChange={(v) => onChange({ bgColor: v })}
            />
            <SliderField
              label="Padding"
              value={step.bannerPadding ?? 12}
              min={8} max={40} unit="px"
              onChange={(v) => onChange({ bannerPadding: v })}
            />
            <Field label="Position">
              <select
                value={step.position ?? "top"}
                onChange={(e) =>
                  onChange({ position: e.target.value as "top" | "bottom" })
                }
                className={inputCls}
              >
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
              </select>
            </Field>
          </>
        )}
      </Collapsible>
    </div>
  );
}

function TargetingPanel({
  rules,
  onAddCondition,
  onUpdateCondition,
  onRemoveCondition,
  onIdleChange,
}: {
  rules: TargetingRules;
  onAddCondition: () => void;
  onUpdateCondition: (idx: number, patch: Partial<Condition>) => void;
  onRemoveCondition: (idx: number) => void;
  onIdleChange: (seconds: number | null) => void;
}) {
  const idleEnabled = rules.idle_seconds != null;

  return (
    <div>
      <p className="text-xs text-gray-500 mb-3">
        Show this flow only when these conditions match.
      </p>

      <div>
        {rules.conditions.map((cond, idx) => (
          <div key={idx}>
            <ConditionRow
              condition={cond}
              onChange={(patch) => onUpdateCondition(idx, patch)}
              onRemove={() => onRemoveCondition(idx)}
            />
            {idx < rules.conditions.length - 1 && (
              <div className="flex items-center justify-center my-2">
                <button
                  onClick={() =>
                    onUpdateCondition(idx, {
                      join_next: (cond.join_next ?? "AND") === "AND" ? "OR" : "AND",
                    })
                  }
                  title="Click to toggle AND / OR"
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full transition-colors ${
                    (cond.join_next ?? "AND") === "AND"
                      ? "bg-brand-100 text-brand-700 hover:bg-brand-200"
                      : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                  }`}
                >
                  {cond.join_next ?? "AND"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={onAddCondition}
        className="mt-4 w-full py-2 border border-dashed border-gray-300 rounded-lg text-xs text-gray-400 hover:border-brand-400 hover:text-brand-600 transition-colors"
      >
        + Add condition
      </button>

      {/* Idle Trigger */}
      <div className="mt-6 pt-5 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-700">Idle trigger</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Show when user stops interacting</p>
          </div>
          <button
            role="switch"
            aria-checked={idleEnabled}
            onClick={() => onIdleChange(idleEnabled ? null : 10)}
            className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${
              idleEnabled ? "bg-brand-600" : "bg-gray-200"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                idleEnabled ? "translate-x-4" : ""
              }`}
            />
          </button>
        </div>

        {idleEnabled && (
          <div className="mt-3">
            <label className="block text-xs text-gray-500 mb-1.5">Trigger after</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={300}
                value={rules.idle_seconds ?? 10}
                placeholder="10"
                onChange={(e) => {
                  const raw = e.target.value;
                  if (raw === "") { onIdleChange(10); return; }
                  const n = Number(raw);
                  const v = isNaN(n) ? 10 : Math.max(1, Math.min(300, n));
                  onIdleChange(v);
                }}
                onBlur={(e) => {
                  const n = Number(e.target.value);
                  if (!e.target.value || isNaN(n) || n < 1) onIdleChange(10);
                }}
                className="w-20 text-xs border border-gray-200 rounded-md px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <span className="text-xs text-gray-500">seconds of inactivity</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">1 sec – 5 min</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ConditionRow({
  condition,
  onChange,
  onRemove,
}: {
  condition: Condition;
  onChange: (patch: Partial<Condition>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between">
        <select
          value={condition.type}
          onChange={(e) => onChange({ type: e.target.value as ConditionType, value: "", operator: undefined })}
          className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="url_contains">URL contains</option>
          <option value="user_plan">User plan</option>
          <option value="session_count">Session count</option>
        </select>
        <button onClick={onRemove} className="text-gray-300 hover:text-red-400 text-xs">✕</button>
      </div>

      {condition.type === "session_count" && (
        <select
          value={condition.operator ?? "lte"}
          onChange={(e) => onChange({ operator: e.target.value as "lte" | "gte" | "eq" })}
          className="w-full text-xs border border-gray-200 rounded-md px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="lte">at most (≤)</option>
          <option value="gte">at least (≥)</option>
          <option value="eq">exactly (=)</option>
        </select>
      )}

      <input
        value={String(condition.value)}
        onChange={(e) =>
          onChange({
            value:
              condition.type === "session_count"
                ? Number(e.target.value) || 0
                : e.target.value,
          })
        }
        type={condition.type === "session_count" ? "number" : "text"}
        placeholder={
          condition.type === "url_contains"
            ? "/dashboard"
            : condition.type === "user_plan"
            ? "free"
            : "3"
        }
        className="w-full text-xs border border-gray-200 rounded-md px-2 py-1 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
      />
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-10 rounded border border-gray-200 cursor-pointer p-0.5 bg-white"
        />
        <span className="text-xs font-mono text-gray-400">{value}</span>
      </div>
    </Field>
  );
}

function SliderField({
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 accent-brand-600"
        />
        <span className="text-xs font-mono text-gray-400 w-10 text-right">
          {value}{unit}
        </span>
      </div>
    </Field>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white";
