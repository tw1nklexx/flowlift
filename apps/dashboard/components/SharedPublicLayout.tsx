"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

/* ── Shared header ───────────────────────────────────────────────────────── */

export function SharedHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/nudgify-logo.svg" alt="Nudgify" width={22} height={22} priority />
          <span className="text-xl font-bold text-[#4f6ef7]">Nudgify</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          <Link href="/#features" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50">
            Features
          </Link>
          <Link href="/#how-it-works" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50">
            How it works
          </Link>
          <Link href="/#pricing" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50">
            Pricing
          </Link>
          <Link href="/compare" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50">
            Compare
          </Link>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 cursor-pointer"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold bg-[#4f6ef7] text-white px-5 py-2 rounded-full hover:bg-[#3b5af5] hover:scale-105 transition-all shadow-sm shadow-blue-200 cursor-pointer"
          >
            Start free
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-gray-500 hover:text-gray-900 transition-colors rounded-lg cursor-pointer"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-0.5">
          {[
            { label: "Features", href: "/#features" },
            { label: "How it works", href: "/#how-it-works" },
            { label: "Pricing", href: "/#pricing" },
            { label: "Compare", href: "/compare" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="block text-sm font-medium text-gray-700 hover:text-gray-900 py-2.5 border-b border-gray-50"
            >
              {label}
            </Link>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            <Link
              href="/login"
              className="text-center text-sm font-medium text-gray-700 border border-gray-200 py-2.5 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-center text-sm font-semibold bg-[#4f6ef7] text-white py-2.5 rounded-full hover:bg-[#3b5af5] transition-colors cursor-pointer"
            >
              Start free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

/* ── Shared footer ───────────────────────────────────────────────────────── */

const FOOTER_COLS = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Compare", href: "/compare" },
    ],
  },
  {
    heading: "Developers",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Snippet reference", href: "/docs/snippet" },
      { label: "API reference", href: "/docs/api" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Sign in", href: "/login" },
      { label: "Sign up free", href: "/signup" },
      { label: "Dashboard", href: "/flows" },
      { label: "Settings", href: "/settings" },
    ],
  },
];

export function SharedFooter() {
  return (
    <footer className="bg-[#0f0f13] px-6 pt-16 pb-8">
      <div className="max-w-6xl mx-auto">
        {/* Top: logo + columns */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <Image src="/nudgify-logo.svg" alt="" width={18} height={18} />
              <span className="text-lg font-bold text-white">Nudgify</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Lightweight onboarding for SaaS founders who move fast.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.heading}>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                {col.heading}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-gray-200 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">© 2026 Nudgify. Built for SaaS founders.</p>
          <p className="text-xs text-gray-600">Lighter than Appcues. Cheaper than Pendo. Ships today.</p>
        </div>
      </div>
    </footer>
  );
}

/* ── Layout wrapper ──────────────────────────────────────────────────────── */

export default function SharedPublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-[#111827] antialiased">
      <SharedHeader />
      {children}
      <SharedFooter />
    </div>
  );
}
