import { track, type EventType } from "./tracker";

export interface Step {
  type: "modal" | "tooltip" | "banner";
  title?: string;
  body: string;
  cta_label: string;
  cta_action: "next" | "complete" | "link";
  cta_url?: string;
  target_selector?: string | null;
  // Typography
  titleColor?: string;
  titleFontSize?: number;
  bodyFontSize?: number;
  // Button
  btnColor?: string;
  btnTextColor?: string;
  btnBorderRadius?: number;
  // Container
  containerRadius?: number;
  shadowIntensity?: number;
  animation?: "fade" | "slide" | "bounce" | "none";
  // Modal only
  overlayColor?: string;
  overlayOpacity?: number;
  // Banner only
  bgColor?: string;
  bannerPadding?: number;
  position?: "top" | "bottom";
}

function hexToRgba(hex: string, opacity: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity / 100})`;
}

function makeShadow(intensity: number): string {
  return `0 ${intensity * 0.2}px ${intensity * 0.6}px rgba(0,0,0,${intensity / 250})`;
}

function animClass(anim?: "fade" | "slide" | "bounce" | "none"): string {
  if (!anim || anim === "none") return "";
  return `fl-anim-${anim}`;
}

interface RenderContext {
  flowId: string;
  sessionId: string;
  steps: Step[];
  currentIndex: number;
  onComplete: () => void;
  onDismiss: () => void;
  hideWatermark?: boolean;
}

let overlay: HTMLElement | null = null;
let _hideWatermark = false;

const STYLES = `
  .fl-reset { all: initial; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; box-sizing: border-box; }
  .fl-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 2147483646; display: flex; align-items: center; justify-content: center; }
  .fl-modal { background: #fff; border-radius: 16px; padding: 32px; max-width: 480px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
  .fl-modal-title { font-size: 20px; font-weight: 700; color: #111; margin: 0 0 12px; }
  .fl-modal-body { font-size: 15px; color: #555; line-height: 1.6; margin: 0 0 24px; }
  .fl-btn { display: inline-flex; align-items: center; padding: 10px 20px; border-radius: 8px; background: #4f6ef7; color: #fff; font-size: 14px; font-weight: 600; border: none; cursor: pointer; }
  .fl-btn:hover { opacity: 0.88; }
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
  @keyframes fl-fade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes fl-slide { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fl-bounce { 0% { opacity: 0; transform: scale(0.8); } 70% { transform: scale(1.05); } 100% { opacity: 1; transform: scale(1); } }
  .fl-anim-fade { animation: fl-fade 300ms ease forwards; }
  .fl-anim-slide { animation: fl-slide 300ms ease forwards; }
  .fl-anim-bounce { animation: fl-bounce 400ms ease forwards; }
`;

function injectStyles(): void {
  if (document.getElementById("fl-styles")) return;
  const style = document.createElement("style");
  style.id = "fl-styles";
  style.textContent = STYLES;
  document.head.appendChild(style);
}

function isColorDark(hex: string): boolean {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return (Math.max(r, g, b) + Math.min(r, g, b)) / 2 < 0.5;
}

function makeEl<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  cls: string,
  extra?: Partial<HTMLElementTagNameMap[K]>,
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  el.className = `fl-reset ${cls}`.trimEnd();
  if (extra) Object.assign(el, extra);
  return el;
}

export function renderStep(ctx: RenderContext): void {
  cleanup();
  injectStyles();
  _hideWatermark = ctx.hideWatermark ?? false;

  const { steps, currentIndex, flowId, sessionId } = ctx;
  const step = steps[currentIndex];
  const isLast = currentIndex === steps.length - 1;

  function advance() {
    if (step.cta_action === "link") {
      if (step.cta_url) window.open(step.cta_url, "_blank");
      return;
    }
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
  const btnColor   = step.btnColor        ?? "#4f6ef7";
  const btnText    = step.btnTextColor    ?? "#ffffff";
  const btnRadius  = step.btnBorderRadius ?? 8;
  const titleColor = step.titleColor      ?? "#111111";
  const titleSize  = step.titleFontSize   ?? 20;
  const bodySize   = step.bodyFontSize    ?? 15;
  const radius     = step.containerRadius ?? 16;
  const shadow     = makeShadow(step.shadowIntensity ?? 50);
  const overlayBg  = hexToRgba(step.overlayColor ?? "#000000", step.overlayOpacity ?? 45);
  const anim       = animClass(step.animation ?? "fade");

  const ov = makeEl("div", "fl-overlay");
  ov.style.background = overlayBg;

  const box = makeEl("div", `fl-modal ${anim}`);
  box.style.borderRadius = `${radius}px`;
  box.style.boxShadow = shadow;

  const dismiss = makeEl("button", "fl-dismiss", { textContent: "✕" });
  dismiss.onclick = onDismiss;
  box.appendChild(dismiss);

  if (step.title) {
    const title = makeEl("p", "fl-modal-title", { textContent: step.title });
    title.style.color = titleColor;
    title.style.fontSize = `${titleSize}px`;
    box.appendChild(title);
  }

  const body = makeEl("p", "fl-modal-body", { textContent: step.body });
  body.style.fontSize = `${bodySize}px`;
  box.appendChild(body);

  const btn = makeEl("button", "fl-btn", { textContent: step.cta_label });
  btn.style.backgroundColor = btnColor;
  btn.style.color = btnText;
  btn.style.borderRadius = `${btnRadius}px`;
  btn.onclick = onNext;
  box.appendChild(btn);

  if (total > 1) {
    const prog = makeEl("p", "fl-progress", { textContent: `${idx + 1} of ${total}` });
    box.appendChild(prog);
  }

  if (!_hideWatermark) {
    const wm = document.createElement("a");
    wm.href = "https://nudgify.io";
    wm.target = "_blank";
    wm.rel = "noopener noreferrer";
    wm.textContent = "✨ Add onboarding like this →";
    wm.style.cssText = "position:absolute;bottom:10px;right:14px;font-size:12px;color:rgba(107,114,128,0.9);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;text-decoration:none;cursor:pointer;";
    wm.addEventListener("mouseenter", () => { wm.style.textDecoration = "underline"; wm.style.color = "rgba(107,114,128,1)"; });
    wm.addEventListener("mouseleave", () => { wm.style.textDecoration = "none"; wm.style.color = "rgba(107,114,128,0.9)"; });
    box.appendChild(wm);
  }

  ov.appendChild(box);
  ov.onclick = (e) => { if (e.target === ov) onDismiss(); };
  document.body.appendChild(ov);
  overlay = ov;
}

function renderBanner(step: Step, onNext: () => void, onDismiss: () => void): void {
  const bgColor   = step.bgColor        ?? "#4f6ef7";
  const bodySize  = step.bodyFontSize   ?? 14;
  const padding   = step.bannerPadding  ?? 12;
  const btnRadius = step.btnBorderRadius ?? 6;
  const anim      = animClass(step.animation ?? "slide");

  const banner = makeEl("div", `fl-banner ${anim}`);
  banner.style.backgroundColor = bgColor;
  banner.style.padding = `${padding}px 20px`;
  if (step.position === "bottom") {
    banner.style.top = "auto";
    banner.style.bottom = "0";
  }

  const body = makeEl("span", "fl-banner-body", { textContent: step.body });
  body.style.fontSize = `${bodySize}px`;
  banner.appendChild(body);

  const btn = makeEl("button", "fl-banner-btn", { textContent: step.cta_label });
  btn.style.color = bgColor;
  btn.style.borderRadius = `${btnRadius}px`;
  btn.onclick = onNext;
  banner.appendChild(btn);

  if (!_hideWatermark) {
    const wmColor = isColorDark(bgColor) ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.5)";
    const wmHover = isColorDark(bgColor) ? "rgba(255,255,255,1)" : "rgba(0,0,0,0.7)";
    const wm = document.createElement("a");
    wm.href = "https://nudgify.io";
    wm.target = "_blank";
    wm.rel = "noopener noreferrer";
    wm.textContent = "✨ Add onboarding like this →";
    wm.style.cssText = `font-size:12px;color:${wmColor};margin-left:12px;white-space:nowrap;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;flex-shrink:0;text-decoration:none;cursor:pointer;`;
    wm.addEventListener("mouseenter", () => { wm.style.textDecoration = "underline"; wm.style.color = wmHover; });
    wm.addEventListener("mouseleave", () => { wm.style.textDecoration = "none"; wm.style.color = wmColor; });
    banner.appendChild(wm);
  }

  const dismiss = makeEl("button", "fl-banner-dismiss", { textContent: "✕" });
  dismiss.onclick = onDismiss;
  banner.appendChild(dismiss);

  document.body.appendChild(banner);
  overlay = banner;
}

function renderTooltip(step: Step, onNext: () => void, onDismiss: () => void): void {
  const btnColor  = step.btnColor        ?? "#4f6ef7";
  const btnText   = step.btnTextColor    ?? "#ffffff";
  const btnRadius = step.btnBorderRadius ?? 8;
  const bodySize  = step.bodyFontSize    ?? 14;
  const radius    = step.containerRadius ?? 10;
  const shadow    = makeShadow(step.shadowIntensity ?? 50);
  const anim      = animClass(step.animation ?? "fade");
  const tooltipBg = "#1a1a2e";

  let anchor: Element | null = null;
  if (step.target_selector) {
    anchor = document.querySelector(step.target_selector);
  }

  const tooltip = makeEl("div", `fl-tooltip ${anim}`);
  tooltip.style.borderRadius = `${radius}px`;
  tooltip.style.boxShadow = shadow;

  const body = makeEl("p", "fl-tooltip-body", { textContent: step.body });
  body.style.fontSize = `${bodySize}px`;
  tooltip.appendChild(body);

  const btn = makeEl("button", "fl-btn", { textContent: step.cta_label });
  btn.style.cssText = `font-size:13px;padding:6px 14px;background:${btnColor};color:${btnText};border-radius:${btnRadius}px;`;
  btn.onclick = onNext;
  tooltip.appendChild(btn);

  if (!_hideWatermark) {
    const wm = document.createElement("a");
    wm.href = "https://nudgify.io";
    wm.target = "_blank";
    wm.rel = "noopener noreferrer";
    wm.textContent = "✨ Add onboarding like this →";
    wm.style.cssText = "display:block;font-size:12px;color:rgba(255,255,255,0.75);margin-top:10px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;text-decoration:none;cursor:pointer;";
    wm.addEventListener("mouseenter", () => { wm.style.textDecoration = "underline"; wm.style.color = "rgba(255,255,255,1)"; });
    wm.addEventListener("mouseleave", () => { wm.style.textDecoration = "none"; wm.style.color = "rgba(255,255,255,0.75)"; });
    tooltip.appendChild(wm);
  }

  const arrow = makeEl("div", "fl-tooltip-arrow");
  arrow.style.background = tooltipBg;
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
