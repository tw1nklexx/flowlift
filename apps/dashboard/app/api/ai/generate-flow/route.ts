import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an expert UX designer specializing in SaaS onboarding flows.
Generate a FlowLift onboarding flow based on the user's description.
Respond with ONLY valid JSON, no markdown, no explanation.

The JSON must follow this exact schema:
{
  "name": "flow name (short, descriptive)",
  "targeting_rules": { "operator": "AND", "conditions": [] },
  "steps": [{
    "type": "modal" | "banner" | "tooltip",
    "title": "string (modal only, max 60 chars)",
    "body": "string (max 120 chars)",
    "cta_label": "string (max 20 chars)",
    "cta_action": "next" | "complete",
    "target_selector": null
  }]
}

Rules:
- Generate 2-4 steps maximum
- First step is usually a modal (welcome)
- Last step cta_action must be "complete"
- Keep body text concise and friendly
- Use banners for announcements, modals for important messages, tooltips sparingly
- targeting_rules conditions array can be empty (show to everyone)`;

export async function POST(req: Request) {
  try {
    const { prompt, projectId } = await req.json();

    if (!prompt || !projectId) {
      return NextResponse.json({ error: "Missing prompt or projectId" }, { status: 400 });
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: project } = await supabase
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single();

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content.find((b) => b.type === "text")?.text ?? "";

    let flow: { name: string; targeting_rules: object; steps: object[] };
    try {
      flow = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: "AI returned invalid JSON" }, { status: 500 });
    }

    const { data: saved, error: insertError } = await supabase
      .from("flows")
      .insert({
        project_id: projectId,
        name: flow.name,
        steps: flow.steps,
        targeting_rules: flow.targeting_rules,
        is_active: false,
      })
      .select("id")
      .single();

    if (insertError || !saved) {
      return NextResponse.json({ error: "Failed to save flow" }, { status: 500 });
    }

    return NextResponse.json({ flowId: saved.id });
  } catch (err) {
    console.error("AI generate-flow error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
