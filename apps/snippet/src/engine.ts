export interface Condition {
  type: "user_plan" | "url_contains" | "session_count";
  value: string | number;
  operator?: "eq" | "lte" | "gte";
  join_next?: "AND" | "OR";
}

let _lastActivity = Date.now();

export function trackActivity(): void {
  _lastActivity = Date.now();
}

function idleSeconds(): number {
  return (Date.now() - _lastActivity) / 1000;
}

export interface TargetingRules {
  operator?: "AND" | "OR"; // legacy, kept for backward compat
  conditions: Condition[];
  idle_seconds?: number;
}

export interface UserProps {
  id?: string;
  plan?: string;
  role?: string;
  session_count?: number;
  [key: string]: unknown;
}

function evalCondition(cond: Condition, user: UserProps): boolean {
  switch (cond.type) {
    case "url_contains":
      return window.location.href.includes(String(cond.value));

    case "user_plan":
      return user.plan === String(cond.value);

    case "session_count": {
      const count = user.session_count ?? 0;
      const target = Number(cond.value);
      const op = cond.operator ?? "lte";
      if (op === "lte") return count <= target;
      if (op === "gte") return count >= target;
      return count === target;
    }

    default:
      return false;
  }
}

export function matchesRules(rules: TargetingRules, user: UserProps): boolean {
  // Idle trigger: if set, user must have been inactive long enough
  if (rules.idle_seconds != null && idleSeconds() < rules.idle_seconds) {
    return false;
  }

  if (rules.conditions.length === 0) return true;

  // Evaluate left-to-right using each condition's join_next operator
  let result = evalCondition(rules.conditions[0], user);
  for (let i = 1; i < rules.conditions.length; i++) {
    const op = rules.conditions[i - 1].join_next ?? "AND";
    const next = evalCondition(rules.conditions[i], user);
    result = op === "AND" ? result && next : result || next;
  }
  return result;
}
