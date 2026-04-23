import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/types";
import WelcomeClient from "./WelcomeClient";

export default async function WelcomePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: project } = await supabase
    .from("projects")
    .select("api_key")
    .eq("user_id", user.id)
    .single<Project>();

  return <WelcomeClient apiKey={project?.api_key ?? "proj_loading"} />;
}
