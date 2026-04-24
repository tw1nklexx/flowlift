import { matchesRules, type UserProps } from "./engine";
import { initTracker, track } from "./tracker";
import { renderStep, cleanup } from "./renderer";

interface InitOptions {
  apiUrl?: string;
  hideWatermark?: boolean;
}

interface FlowData {
  id: string;
  name: string;
  targeting_rules: Parameters<typeof matchesRules>[0];
  steps: Parameters<typeof renderStep>[0]["steps"];
}

let _apiKey = "";
let _apiUrl = "https://zesemjcbilrvtgucrazd.supabase.co/functions/v1";
let _userProps: UserProps | null = null;
let _sessionId = "";
let _initialized = false;
let _runId = 0; // incremented on each fetchAndRun call to cancel stale fetches
let _hideWatermark = false;

function getSessionId(): string {
  const key = "fl_sid";
  let sid = localStorage.getItem(key);
  if (!sid) {
    sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(key, sid);
  }
  return sid;
}

function getAndIncrementVisitCount(): number {
  const count = parseInt(localStorage.getItem("fl_visit_count") ?? "0", 10) + 1;
  localStorage.setItem("fl_visit_count", String(count));
  return count;
}

function hasShown(flowId: string): boolean {
  const shown = JSON.parse(localStorage.getItem("fl_shown") ?? "{}");
  return !!shown[flowId];
}

function markShown(flowId: string): void {
  const shown = JSON.parse(localStorage.getItem("fl_shown") ?? "{}");
  shown[flowId] = Date.now();
  localStorage.setItem("fl_shown", JSON.stringify(shown));
}

async function fetchAndRun(userProps: UserProps): Promise<void> {
  const runId = ++_runId;

  let flows: FlowData[];
  try {
    const res = await fetch(`${_apiUrl}/flows?api_key=${_apiKey}`);
    if (!res.ok) return;
    ({ flows } = await res.json());
  } catch {
    return;
  }

  // A newer call (e.g. from identify()) superseded this one — bail out
  if (runId !== _runId) return;

  for (const flow of flows) {
    if (hasShown(flow.id)) continue;
    if (!matchesRules(flow.targeting_rules, userProps)) continue;

    markShown(flow.id);

    track({
      flow_id: flow.id,
      session_id: _sessionId,
      event_type: "flow_shown",
    });

    renderStep({
      flowId: flow.id,
      sessionId: _sessionId,
      steps: flow.steps,
      currentIndex: 0,
      onComplete: () => {},
      onDismiss: () => {},
      hideWatermark: _hideWatermark,
    });

    break; // show one flow at a time
  }
}

export function init(apiKey: string, options: InitOptions = {}): void {
  if (_initialized) return;
  _initialized = true;
  _apiKey = apiKey;
  _apiUrl = options.apiUrl ?? "https://zesemjcbilrvtgucrazd.supabase.co/functions/v1";
  _hideWatermark = options.hideWatermark ?? false;
  _sessionId = getSessionId();
  initTracker(apiKey, _apiUrl);

  const visitCount = getAndIncrementVisitCount();

  // Build anonymous profile — used when identify() hasn't been called yet
  const anonProfile: UserProps = {
    id: `anon_${_sessionId}`,
    plan: "free",
    session_count: visitCount,
  };

  // If identify() was already called before init(), merge with real visit count
  const profile = _userProps
    ? { session_count: visitCount, ..._userProps }
    : anonProfile;

  fetchAndRun(profile);
}

export function identify(userProps: UserProps): void {
  _userProps = userProps;

  if (_initialized) {
    // Merge: auto-detected visit count is the default; caller can override
    const visitCount = parseInt(localStorage.getItem("fl_visit_count") ?? "1", 10);
    const merged: UserProps = { session_count: visitCount, ...userProps };

    // Cancel any currently showing flow, then re-evaluate with real identity
    cleanup();
    fetchAndRun(merged);
  }
}

export function reset(): void {
  cleanup();
  localStorage.removeItem("fl_shown");
  localStorage.removeItem("fl_sid");
  localStorage.removeItem("fl_visit_count");
}
