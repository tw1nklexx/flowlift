import type { Step, TargetingRules } from "@/types";

export interface FlowTemplate {
  id: string;
  name: string;
  description: string;
  stepCount: number;
  steps: Step[];
  targeting_rules: TargetingRules;
}

export const TEMPLATES: FlowTemplate[] = [
  {
    id: "welcome-new-users",
    name: "Welcome new users",
    description: "Greet first-time visitors and guide them to their first action",
    stepCount: 3,
    targeting_rules: {
      operator: "AND",
      conditions: [{ type: "session_count", operator: "lte", value: 1 }],
    },
    steps: [
      {
        type: "modal",
        title: "Welcome to [App]!",
        body: "We're excited to have you here. Let us show you around so you can hit the ground running.",
        cta_label: "Show me around",
        cta_action: "next",
      },
      {
        type: "tooltip",
        body: "This is where you'll spend most of your time. Click here to get started.",
        cta_label: "Got it",
        cta_action: "next",
        target_selector: "",
      },
      {
        type: "banner",
        body: "You're all set! 🎉 You're ready to get the most out of the app.",
        cta_label: "Dismiss",
        cta_action: "complete",
      },
    ],
  },
  {
    id: "announce-feature",
    name: "Announce new feature",
    description: "Let users know about a new feature when they visit the dashboard",
    stepCount: 2,
    targeting_rules: {
      operator: "AND",
      conditions: [{ type: "url_contains", value: "/dashboard" }],
    },
    steps: [
      {
        type: "banner",
        body: "🎉 New feature available! See what's changed.",
        cta_label: "Learn more",
        cta_action: "next",
      },
      {
        type: "modal",
        title: "Introducing our latest feature",
        body: "We've added something new to help you work faster. Here's everything you need to know to get started.",
        cta_label: "Got it",
        cta_action: "complete",
      },
    ],
  },
  {
    id: "upgrade-prompt",
    name: "Upgrade prompt",
    description: "Show free-plan users why upgrading unlocks more value",
    stepCount: 2,
    targeting_rules: {
      operator: "AND",
      conditions: [{ type: "user_plan", value: "free" }],
    },
    steps: [
      {
        type: "modal",
        title: "Unlock more with Pro",
        body: "You're on the free plan. Upgrade to Pro for unlimited flows, priority support, and 50K monthly active users.",
        cta_label: "See plans",
        cta_action: "next",
      },
      {
        type: "tooltip",
        body: "Click here to upgrade and unlock all features instantly.",
        cta_label: "Upgrade now",
        cta_action: "complete",
        target_selector: "",
      },
    ],
  },
  {
    id: "feature-discovery",
    name: "Feature discovery",
    description: "Guide power users to advanced features after a few sessions",
    stepCount: 3,
    targeting_rules: {
      operator: "AND",
      conditions: [{ type: "session_count", operator: "gte", value: 3 }],
    },
    steps: [
      {
        type: "tooltip",
        body: "Have you tried this feature yet? It can save you hours every week.",
        cta_label: "Show me",
        cta_action: "next",
        target_selector: "",
      },
      {
        type: "tooltip",
        body: "And here's another feature that power users love.",
        cta_label: "Nice!",
        cta_action: "next",
        target_selector: "",
      },
      {
        type: "modal",
        title: "You're a power user! 🚀",
        body: "You've been using the app like a pro. Here are some advanced tips to get even more out of it.",
        cta_label: "Let's go",
        cta_action: "complete",
      },
    ],
  },
];
