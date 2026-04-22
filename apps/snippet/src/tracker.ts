export type EventType = "flow_shown" | "step_advanced" | "flow_completed" | "flow_dismissed";

interface PendingEvent {
  flow_id: string;
  session_id: string;
  event_type: EventType;
  step_index?: number;
}

let apiKey = "";
let baseUrl = "";
const queue: PendingEvent[] = [];
let flushTimer: ReturnType<typeof setInterval> | null = null;

export function initTracker(key: string, url: string): void {
  apiKey = key;
  baseUrl = url;

  flushTimer = setInterval(flush, 5000);

  window.addEventListener("beforeunload", () => {
    if (queue.length > 0) flush(true);
  });
}

export function track(event: PendingEvent): void {
  queue.push(event);
}

function flush(sync = false): void {
  if (queue.length === 0 || !apiKey) return;

  const batch = queue.splice(0, queue.length);
  const body = JSON.stringify({ api_key: apiKey, events: batch });

  if (sync && typeof navigator.sendBeacon === "function") {
    // sendBeacon works on page unload without blocking
    navigator.sendBeacon(`${baseUrl}/track`, new Blob([body], { type: "application/json" }));
    return;
  }

  fetch(`${baseUrl}/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    // silently swallow — analytics loss is acceptable
  });
}

export function destroyTracker(): void {
  if (flushTimer) clearInterval(flushTimer);
}
