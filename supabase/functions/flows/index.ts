import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const DEMO_FLOW = {
  id: "demo_flow",
  name: "Demo Flow",
  is_demo: true,
  targeting_rules: { operator: "AND", conditions: [] },
  steps: [
    {
      type: "banner",
      body: "👋 Nudgify is working! This is a demo flow — create your own in the dashboard.",
      cta_label: "Open dashboard",
      cta_action: "link",
      cta_url: "https://nudgify-dashboard.vercel.app/",
      bgColor: "#4f6ef7",
      btnColor: "#ffffff",
      btnTextColor: "#4f6ef7",
      position: "top",
    },
  ],
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const apiKey = url.searchParams.get("api_key");

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "api_key required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SERVICE_ROLE_KEY")!,
    );

    // Resolve project by api_key
    const { data: project, error: projErr } = await supabase
      .from("projects")
      .select("id")
      .eq("api_key", apiKey)
      .single();

    if (projErr || !project) {
      return new Response(JSON.stringify({ error: "Invalid api_key" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Return only active flows — steps + targeting_rules (no sensitive data)
    const { data: flows, error: flowsErr } = await supabase
      .from("flows")
      .select("id, name, targeting_rules, steps")
      .eq("project_id", project.id)
      .eq("is_active", true);

    if (flowsErr) throw flowsErr;

    // Return the demo flow when the project has no published flows yet —
    // gives new users an instant "it works" moment after pasting the snippet.
    const result = flows && flows.length > 0 ? flows : [DEMO_FLOW];

    return new Response(JSON.stringify({ flows: result }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
