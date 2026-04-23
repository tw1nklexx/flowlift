export type StepType = "modal" | "tooltip" | "banner";
export type CtaAction = "next" | "complete";

export interface Step {
  type: StepType;
  title?: string;
  body: string;
  cta_label: string;
  cta_action: CtaAction;
  target_selector?: string | null;
  // Design
  primaryColor?: string;    // button background, default #4f6ef7
  textColor?: string;       // body text color
  borderRadius?: number;    // 0-24 px
  fontSize?: number;        // 13 | 15 | 17
  overlayColor?: string;    // modal only — overlay bg hex
  overlayOpacity?: number;  // modal only — 0-100
  bgColor?: string;         // banner only — banner background
  position?: "top" | "bottom"; // banner only
}

export type ConditionType = "user_plan" | "url_contains" | "session_count";
export type ConditionOperator = "eq" | "lte" | "gte";

export interface Condition {
  type: ConditionType;
  value: string | number;
  operator?: ConditionOperator;
}

export interface TargetingRules {
  operator: "AND" | "OR";
  conditions: Condition[];
}

export interface Flow {
  id: string;
  project_id: string;
  name: string;
  is_active: boolean;
  targeting_rules: TargetingRules;
  steps: Step[];
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  api_key: string;
  plan: string;
  created_at: string;
}

export interface FlowEvent {
  id: string;
  flow_id: string;
  project_id: string;
  session_id: string;
  event_type: "flow_shown" | "step_advanced" | "flow_completed" | "flow_dismissed";
  step_index: number | null;
  created_at: string;
}

export interface FlowAnalytics {
  flow_id: string;
  flow_name: string;
  shown: number;
  completed: number;
  completion_rate: number;
}
