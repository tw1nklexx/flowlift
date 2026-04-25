export interface Condition {
  type: "user_plan" | "url_contains" | "session_count" | "idle_seconds";
  value: string | number;
  operator?: "eq" | "lte" | "gte";
}

let _lastActivity = Date.now();

export function trackActivity(): void {
  _lastActivity = Date.now();
}

function idleSeconds(): number {
  return (Date.now() - _lastActivity) / 1000;
}

export interface TargetingRules {
  operator: "AND" | "OR";
  conditions: Condition[];
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

    case "idle_seconds":
      return idleSeconds() >= Number(cond.value);

    default:
      return false;
  }
}

export function matchesRules(rules: TargetingRules, user: UserProps): boolean {
  if (rules.conditions.length === 0) return true;

  if (rules.operator === "AND") {
    return rules.conditions.every((c) => evalCondition(c, user));
  }
  return rules.conditions.some((c) => evalCondition(c, user));
}
