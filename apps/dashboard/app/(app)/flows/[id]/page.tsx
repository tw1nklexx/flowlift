import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import FlowBuilder from "../FlowBuilder";
import type { Flow } from "@/types";

export default async function EditFlowPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const { data: flow } = await supabase
    .from("flows")
    .select("*")
    .eq("id", params.id)
    .single<Flow>();

  if (!flow) notFound();

  return <FlowBuilder projectId={flow.project_id} initialFlow={flow} />;
}
