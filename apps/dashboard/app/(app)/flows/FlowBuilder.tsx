"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Flow, Step, StepType, TargetingRules, Condition, ConditionType } from "@/types";

interface Props {
  projectId: string;
  initialFlow?: Flow;
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

export default function FlowBuilder({ projectId, initialFlow }: Props) {
  const router = useRouter();
  const [name, setName] = useState(initialFlow?.name ?? "Untitled Flow");
  const [steps, setSteps] = useState<Step[]>(initialFlow?.steps ?? []);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(steps.length > 0 ? 0 : null);
  const [targeting, setTargeting] = useState<TargetingRules>(
    initialFlow?.targeting_rules ?? { operator: "AND", conditions: [] },
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<"step" | "targeting">("step");

  const selectedStep = selectedIdx !== null ? steps[selectedIdx] : null;

  function addStep(type: StepType) {
    const newStep = { ...DEFAULT_STEP[type] };
    const newSteps = [...steps, newStep];
    setSteps(newSteps);
    setSelectedIdx(newSteps.length - 1);
    setActiveTab("step");
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
    router.push("/flows");
    router.refresh();
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
            onClick={() => save(false)}
            disabled={saving || deleting}
            className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            Save draft
          </button>
          <button
            onClick={() => save(true)}
            disabled={saving || deleting || steps.length === 0}
            className="px-4 py-1.5 text-sm bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving…" : "Publish"}
          </button>
        </div>
      </div>

      {/* 3-column body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Step list */}
        <div className="w-56 bg-white border-r border-gray-200 flex flex-col">
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
        <div className="flex-1 flex items-center justify-center bg-gray-100 p-8">
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
            <button
              onClick={() => setActiveTab("step")}
              className={`flex-1 py-3 text-xs font-medium transition-colors ${
                activeTab === "step"
                  ? "text-brand-600 border-b-2 border-brand-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Step properties
            </button>
            <button
              onClick={() => setActiveTab("targeting")}
              className={`flex-1 py-3 text-xs font-medium transition-colors ${
                activeTab === "targeting"
                  ? "text-brand-600 border-b-2 border-brand-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              Targeting
              {targeting.conditions.length > 0 && (
                <span className="ml-1 bg-brand-100 text-brand-600 text-xs px-1.5 py-0.5 rounded-full">
                  {targeting.conditions.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            {activeTab === "step" && selectedStep !== null && selectedIdx !== null ? (
              <StepPropertiesPanel
                step={selectedStep}
                onChange={(patch) => updateStep(selectedIdx, patch)}
              />
            ) : activeTab === "step" ? (
              <p className="text-sm text-gray-400 text-center mt-8">
                Select a step on the left
              </p>
            ) : (
              <TargetingPanel
                rules={targeting}
                onOperatorChange={(op) => setTargeting({ ...targeting, operator: op })}
                onAddCondition={addCondition}
                onUpdateCondition={updateCondition}
                onRemoveCondition={removeCondition}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
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
  if (step.type === "modal") {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {step.title && <h2 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h2>}
        <p className="text-gray-600 mb-6">{step.body}</p>
        <button className="bg-brand-600 text-white px-5 py-2 rounded-lg text-sm font-medium">
          {step.cta_label}
        </button>
      </div>
    );
  }

  if (step.type === "banner") {
    return (
      <div className="w-full max-w-2xl bg-brand-600 text-white px-6 py-4 rounded-xl flex items-center justify-between shadow-lg">
        <p className="text-sm">{step.body}</p>
        <button className="ml-6 bg-white text-brand-700 px-4 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap">
          {step.cta_label}
        </button>
      </div>
    );
  }

  // tooltip
  return (
    <div className="relative">
      {step.target_selector && (
        <div className="mb-2 text-xs text-gray-400 text-center">
          Anchored to: <code className="bg-gray-100 px-1 rounded">{step.target_selector}</code>
        </div>
      )}
      <div className="bg-gray-900 text-white rounded-xl px-5 py-4 max-w-xs shadow-xl">
        <p className="text-sm mb-3">{step.body}</p>
        <button className="bg-white text-gray-900 px-3 py-1 rounded-lg text-xs font-medium">
          {step.cta_label}
        </button>
        <div className="absolute -bottom-2 left-6 w-3 h-3 bg-gray-900 rotate-45" />
      </div>
    </div>
  );
}

function StepPropertiesPanel({
  step,
  onChange,
}: {
  step: Step;
  onChange: (patch: Partial<Step>) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
        <div className="text-sm text-gray-700 capitalize bg-gray-50 px-3 py-2 rounded-lg">
          <StepTypeIcon type={step.type} /> {step.type}
        </div>
      </div>

      {(step.type === "modal" || step.type === "banner") && step.type === "modal" && (
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

      {step.type === "tooltip" && (
        <Field label="Target selector">
          <input
            value={step.target_selector ?? ""}
            onChange={(e) => onChange({ target_selector: e.target.value })}
            className={inputCls}
            placeholder="#element-id or .class-name"
          />
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

function TargetingPanel({
  rules,
  onOperatorChange,
  onAddCondition,
  onUpdateCondition,
  onRemoveCondition,
}: {
  rules: TargetingRules;
  onOperatorChange: (op: "AND" | "OR") => void;
  onAddCondition: () => void;
  onUpdateCondition: (idx: number, patch: Partial<Condition>) => void;
  onRemoveCondition: (idx: number) => void;
}) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-3">
        Show this flow only when these conditions match.
      </p>

      {rules.conditions.length > 1 && (
        <div className="flex gap-2 mb-4">
          {(["AND", "OR"] as const).map((op) => (
            <button
              key={op}
              onClick={() => onOperatorChange(op)}
              className={`flex-1 py-1.5 text-xs rounded-lg border font-medium transition-colors ${
                rules.operator === op
                  ? "bg-brand-50 border-brand-400 text-brand-700"
                  : "border-gray-200 text-gray-400 hover:border-gray-300"
              }`}
            >
              {op}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {rules.conditions.map((cond, idx) => (
          <ConditionRow
            key={idx}
            condition={cond}
            onChange={(patch) => onUpdateCondition(idx, patch)}
            onRemove={() => onRemoveCondition(idx)}
          />
        ))}
      </div>

      <button
        onClick={onAddCondition}
        className="mt-4 w-full py-2 border border-dashed border-gray-300 rounded-lg text-xs text-gray-400 hover:border-brand-400 hover:text-brand-600 transition-colors"
      >
        + Add condition
      </button>
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
