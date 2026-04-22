import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./LogoutButton";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-5 py-5 border-b border-gray-200">
          <span className="text-lg font-bold text-brand-600">FlowLift</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <NavItem href="/flows" label="Flows" icon="⚡" />
          <NavItem href="/analytics" label="Analytics" icon="📊" />
          <NavItem href="/settings" label="Settings" icon="⚙️" />
        </nav>
        <div className="px-4 py-4 border-t border-gray-200">
          <p className="text-xs text-gray-400 truncate mb-2">{user.email}</p>
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}

function NavItem({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
    >
      <span className="text-base">{icon}</span>
      {label}
    </Link>
  );
}
