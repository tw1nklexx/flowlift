import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import FlowBuilder from "../FlowBuilder";

export default async function NewFlowPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: project } = await supabase
    .from("projects")
    .select("id, api_key")
    .eq("user_id", user!.id)
    .single();

  if (!project) redirect("/settings");

  return <FlowBuilder projectId={project.id} apiKey={project.api_key} />;
}
