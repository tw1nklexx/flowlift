import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TrackEvent {
  flow_id: string;
  session_id: string;
  event_type: "flow_shown" | "step_advanced" | "flow_completed" | "flow_dismissed";
  step_index?: number;
}

interface TrackBody {
  api_key: string;
  events: TrackEvent[];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body: TrackBody = await req.json();
    const { api_key, events } = body;

    if (!api_key || !Array.isArray(events) || events.length === 0) {
      return new Response(JSON.stringify({ error: "api_key and events required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SERVICE_ROLE_KEY")!,
    );

    const { data: project, error: projErr } = await supabase
      .from("projects")
      .select("id")
      .eq("api_key", api_key)
      .single();

    if (projErr || !project) {
      return new Response(JSON.stringify({ error: "Invalid api_key" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rows = events.map((e) => ({
      flow_id: e.flow_id,
      project_id: project.id,
      session_id: e.session_id,
      event_type: e.event_type,
      step_index: e.step_index ?? null,
    }));

    const { error: insertErr } = await supabase.from("flow_events").insert(rows);
    if (insertErr) throw insertErr;

    return new Response(JSON.stringify({ ok: true }), {
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
