import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/types";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: project } = await supabase
    .from("projects")
    .select("plan")
    .eq("user_id", user.id)
    .single<Pick<Project, "plan">>();

  const joinedDate = new Date(user.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const meta = user.user_metadata ?? {};
  const notifications = {
    productUpdates: meta.notifications?.productUpdates ?? true,
    tips: meta.notifications?.tips ?? true,
  };

  return (
    <ProfileClient
      email={user.email ?? ""}
      plan={project?.plan ?? "free"}
      joinedDate={joinedDate}
      initialDisplayName={meta.display_name ?? ""}
      initialTimezone={meta.timezone ?? ""}
      initialNotifications={notifications}
    />
  );
}
