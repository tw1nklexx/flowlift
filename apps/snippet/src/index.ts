import { matchesRules, type UserProps } from "./engine";
import { initTracker, track } from "./tracker";
import { renderStep, cleanup } from "./renderer";

const DEFAULT_API_URL = "https://zesemjcbilrvtgucrazd.supabase.co/functions/v1";

interface InitOptions {
  apiUrl?: string;
}

interface FlowData {
  id: string;
  name: string;
  targeting_rules: Parameters<typeof matchesRules>[0];
  steps: Parameters<typeof renderStep>[0]["steps"];
}

let _apiKey = "";
let _apiUrl = DEFAULT_API_URL;
let _userProps: UserProps | null = null;
let _sessionId = "";
let _initialized = false;

function getSessionId(): string {
  const key = "fl_sid";
  let sid = localStorage.getItem(key);
  if (!sid) {
    sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(key, sid);
  }
  return sid;
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
  let flows: FlowData[];
  try {
    const res = await fetch(`${_apiUrl}/flows?api_key=${_apiKey}`);
    if (!res.ok) return;
    ({ flows } = await res.json());
  } catch {
    return;
  }

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
    });

    break; // show one flow at a time
  }
}

export function init(apiKey: string, options: InitOptions = {}): void {
  if (_initialized) return;
  _initialized = true;
  _apiKey = apiKey;
  _apiUrl = options.apiUrl ?? DEFAULT_API_URL;
  _sessionId = getSessionId();
  initTracker(apiKey, _apiUrl);

  if (_userProps) {
    fetchAndRun(_userProps);
  }
}

export function identify(userProps: UserProps): void {
  _userProps = userProps;
  if (_initialized) {
    fetchAndRun(userProps);
  }
}

export function reset(): void {
  cleanup();
  localStorage.removeItem("fl_shown");
  localStorage.removeItem("fl_sid");
}
