"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Zap, BarChart2, Settings, Rocket, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
  "data-tour"?: string;
}

function NavItem({ href, label, icon, badge, "data-tour": dataTour }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      data-tour={dataTour}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
        isActive
          ? "bg-brand-50 text-brand-700"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <span className={`shrink-0 ${isActive ? "text-brand-600" : "text-gray-400"}`}>
        {icon}
      </span>
      {label}
      {badge}
    </Link>
  );
}

function GettingStartedNavItem() {
  const pathname = usePathname();
  const isActive = pathname === "/welcome" || pathname.startsWith("/welcome/");
  const [done, setDone] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ng_onboarding");
      const { step2Done } = saved ? JSON.parse(saved) : {};
      setDone(!!step2Done);
    } catch {
      setDone(false);
    }
  }, []);

  return (
    <Link
      href="/welcome"
      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
        isActive
          ? "bg-brand-50 text-brand-700"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <span className={`shrink-0 ${isActive ? "text-brand-600" : "text-gray-400"}`}>
        <Rocket size={16} />
      </span>
      Getting started
      {!done && (
        <span className="ml-auto w-2 h-2 rounded-full bg-green-400 shrink-0 animate-pulse" />
      )}
    </Link>
  );
}

interface SidebarProps {
  logoutButton: React.ReactNode;
}

export default function Sidebar({ logoutButton }: SidebarProps) {
  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col shrink-0">
      <div className="px-5 py-5 border-b border-gray-200">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/nudgify-logo.svg" alt="Nudgify" width={20} height={20} />
          <span className="text-lg font-bold text-brand-600">Nudgify</span>
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5" aria-label="Main navigation">
        <GettingStartedNavItem />
        <NavItem href="/flows" label="Flows" icon={<Zap size={16} />} />
        <NavItem href="/stats" label="Stats" icon={<BarChart2 size={16} />} data-tour="stats-link" />
        <NavItem href="/settings" label="Settings" icon={<Settings size={16} />} />
      </nav>
      <div className="px-3 py-4 border-t border-gray-200 space-y-1">
        <NavItem href="/profile" label="Profile" icon={<UserCircle size={16} />} />
        {logoutButton}
      </div>
    </aside>
  );
}
