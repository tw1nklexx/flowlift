import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
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

    return new Response(JSON.stringify({ flows: flows ?? [] }), {
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
