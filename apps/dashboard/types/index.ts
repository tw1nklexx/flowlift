export type StepType = "modal" | "tooltip" | "banner";
export type CtaAction = "next" | "complete";

export interface Step {
  type: StepType;
  title?: string;
  body: string;
  cta_label: string;
  cta_action: CtaAction;
  target_selector?: string | null;
  // Typography
  titleColor?: string;        // modal only, default #111111
  titleFontSize?: number;     // modal only, 16-40, default 20
  bodyFontSize?: number;      // 11-24, default 15
  // Button
  btnColor?: string;          // default #4f6ef7
  btnTextColor?: string;      // default #ffffff
  btnBorderRadius?: number;   // 0-24, default 8
  // Container
  containerRadius?: number;   // 0-24, default 16
  shadowIntensity?: number;   // 0-100, default 50
  animation?: "fade" | "slide" | "bounce" | "none";
  // Modal only
  overlayColor?: string;
  overlayOpacity?: number;
  // Banner only
  bgColor?: string;
  bannerPadding?: number;     // 8-40, default 12
  position?: "top" | "bottom";
}

export type ConditionType = "user_plan" | "url_contains" | "session_count" | "idle_seconds";
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
