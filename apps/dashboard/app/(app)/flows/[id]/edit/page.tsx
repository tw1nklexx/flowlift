import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import FlowBuilder from "../../FlowBuilder";
import type { Flow } from "@/types";

export default async function EditFlowPageAlt({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: flow } = await supabase
    .from("flows")
    .select("*")
    .eq("id", params.id)
    .single<Flow>();

  if (!flow) notFound();

  const { data: project } = await supabase
    .from("projects")
    .select("api_key")
    .eq("id", flow.project_id)
    .single();

  return <FlowBuilder projectId={flow.project_id} initialFlow={flow} apiKey={project?.api_key} />;
}
