import { track, type EventType } from "./tracker";

export interface Step {
  type: "modal" | "tooltip" | "banner";
  title?: string;
  body: string;
  cta_label: string;
  cta_action: "next" | "complete";
  target_selector?: string | null;
}

interface RenderContext {
  flowId: string;
  sessionId: string;
  steps: Step[];
  currentIndex: number;
  onComplete: () => void;
  onDismiss: () => void;
}

let overlay: HTMLElement | null = null;

const STYLES = `
  .fl-reset { all: initial; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; box-sizing: border-box; }
  .fl-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 2147483646; display: flex; align-items: center; justify-content: center; }
  .fl-modal { background: #fff; border-radius: 16px; padding: 32px; max-width: 480px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
  .fl-modal-title { font-size: 20px; font-weight: 700; color: #111; margin: 0 0 12px; }
  .fl-modal-body { font-size: 15px; color: #555; line-height: 1.6; margin: 0 0 24px; }
  .fl-btn { display: inline-flex; align-items: center; padding: 10px 20px; border-radius: 8px; background: #4f6ef7; color: #fff; font-size: 14px; font-weight: 600; border: none; cursor: pointer; }
  .fl-btn:hover { background: #3b5af5; }
  .fl-dismiss { float: right; background: none; border: none; cursor: pointer; color: #aaa; font-size: 18px; line-height: 1; padding: 0; margin: -4px -4px 0 0; }
  .fl-dismiss:hover { color: #555; }
  .fl-banner { position: fixed; top: 0; left: 0; right: 0; background: #4f6ef7; color: #fff; display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; z-index: 2147483647; }
  .fl-banner-body { font-size: 14px; flex: 1; }
  .fl-banner-btn { background: #fff; color: #4f6ef7; border: none; border-radius: 6px; padding: 6px 14px; font-size: 13px; font-weight: 600; cursor: pointer; margin-left: 16px; }
  .fl-banner-dismiss { background: none; border: none; color: rgba(255,255,255,0.7); cursor: pointer; font-size: 18px; margin-left: 8px; }
  .fl-tooltip { position: absolute; background: #1a1a2e; color: #fff; border-radius: 10px; padding: 14px 16px; max-width: 280px; z-index: 2147483647; box-shadow: 0 8px 32px rgba(0,0,0,0.25); }
  .fl-tooltip-body { font-size: 14px; line-height: 1.5; margin: 0 0 12px; }
  .fl-tooltip-arrow { position: absolute; width: 10px; height: 10px; background: #1a1a2e; transform: rotate(45deg); bottom: -5px; left: 16px; }
  .fl-progress { font-size: 12px; color: #aaa; margin-top: 12px; }
`;

function injectStyles(): void {
  if (document.getElementById("fl-styles")) return;
  const style = document.createElement("style");
  style.id = "fl-styles";
  style.textContent = STYLES;
  document.head.appendChild(style);
}

function makeEl<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  cls: string,
  extra?: Partial<HTMLElementTagNameMap[K]>,
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  el.className = `fl-reset ${cls}`;
  if (extra) Object.assign(el, extra);
  return el;
}

export function renderStep(ctx: RenderContext): void {
  cleanup();
  injectStyles();

  const { steps, currentIndex, flowId, sessionId } = ctx;
  const step = steps[currentIndex];
  const isLast = currentIndex === steps.length - 1;

  function advance() {
    track({
      flow_id: flowId,
      session_id: sessionId,
      event_type: "step_advanced",
      step_index: currentIndex,
    });
    if (isLast || step.cta_action === "complete") {
      complete();
    } else {
      cleanup();
      renderStep({ ...ctx, currentIndex: currentIndex + 1 });
    }
  }

  function complete() {
    track({ flow_id: flowId, session_id: sessionId, event_type: "flow_completed" });
    cleanup();
    ctx.onComplete();
  }

  function dismiss() {
    track({ flow_id: flowId, session_id: sessionId, event_type: "flow_dismissed" });
    cleanup();
    ctx.onDismiss();
  }

  if (step.type === "modal") {
    renderModal(step, advance, dismiss, currentIndex, steps.length);
  } else if (step.type === "banner") {
    renderBanner(step, advance, dismiss);
  } else {
    renderTooltip(step, advance, dismiss);
  }
}

function renderModal(
  step: Step,
  onNext: () => void,
  onDismiss: () => void,
  idx: number,
  total: number,
): void {
  const ov = makeEl("div", "fl-overlay");
  const box = makeEl("div", "fl-modal");

  const dismiss = makeEl("button", "fl-dismiss", { textContent: "✕" });
  dismiss.onclick = onDismiss;
  box.appendChild(dismiss);

  if (step.title) {
    const title = makeEl("p", "fl-modal-title", { textContent: step.title });
    box.appendChild(title);
  }

  const body = makeEl("p", "fl-modal-body", { textContent: step.body });
  box.appendChild(body);

  const btn = makeEl("button", "fl-btn", { textContent: step.cta_label });
  btn.onclick = onNext;
  box.appendChild(btn);

  if (total > 1) {
    const prog = makeEl("p", "fl-progress", { textContent: `${idx + 1} of ${total}` });
    box.appendChild(prog);
  }

  ov.appendChild(box);
  ov.onclick = (e) => { if (e.target === ov) onDismiss(); };
  document.body.appendChild(ov);
  overlay = ov;
}

function renderBanner(step: Step, onNext: () => void, onDismiss: () => void): void {
  const banner = makeEl("div", "fl-banner");

  const body = makeEl("span", "fl-banner-body", { textContent: step.body });
  banner.appendChild(body);

  const btn = makeEl("button", "fl-banner-btn", { textContent: step.cta_label });
  btn.onclick = onNext;
  banner.appendChild(btn);

  const dismiss = makeEl("button", "fl-banner-dismiss", { textContent: "✕" });
  dismiss.onclick = onDismiss;
  banner.appendChild(dismiss);

  document.body.appendChild(banner);
  overlay = banner;
}

function renderTooltip(step: Step, onNext: () => void, onDismiss: () => void): void {
  let anchor: Element | null = null;
  if (step.target_selector) {
    anchor = document.querySelector(step.target_selector);
  }

  const tooltip = makeEl("div", "fl-tooltip");

  const body = makeEl("p", "fl-tooltip-body", { textContent: step.body });
  tooltip.appendChild(body);

  const btn = makeEl("button", "fl-btn", { textContent: step.cta_label });
  btn.style.cssText = "font-size:13px;padding:6px 14px;";
  btn.onclick = onNext;
  tooltip.appendChild(btn);

  const arrow = makeEl("div", "fl-tooltip-arrow");
  tooltip.appendChild(arrow);

  document.body.appendChild(tooltip);
  overlay = tooltip;

  if (anchor) {
    const rect = anchor.getBoundingClientRect();
    tooltip.style.position = "fixed";
    tooltip.style.top = `${rect.bottom + 10}px`;
    tooltip.style.left = `${Math.max(8, rect.left)}px`;
  } else {
    tooltip.style.position = "fixed";
    tooltip.style.bottom = "24px";
    tooltip.style.right = "24px";
  }
}

export function cleanup(): void {
  if (overlay) {
    overlay.remove();
    overlay = null;
  }
}
