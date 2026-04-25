import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a UX copywriter specializing in SaaS onboarding. Improve the given onboarding step text to be more engaging, clear, and action-oriented. Keep it concise. Return ONLY a JSON object: { "title": string, "body": string, "cta_label": string }. Do not wrap in markdown. Max body length: 120 chars.`;

export async function POST(req: Request) {
  try {
    const { type, title, body, cta_label } = await req.json();

    if (!body) {
      return NextResponse.json({ error: "Missing body" }, { status: 400 });
    }

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 256,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: JSON.stringify({ type, title, body, cta_label }),
        },
      ],
    });

    const raw = (message.content[0] as { type: string; text: string }).text.trim();
    // Strip markdown fences if present
    const json = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    const result = JSON.parse(json);

    return NextResponse.json(result);
  } catch (err) {
    console.error("improve-step error:", err);
    return NextResponse.json({ error: "Failed to improve step" }, { status: 500 });
  }
}
