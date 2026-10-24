"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  HelpCircle,
  Brain,
  Layers,
  FileSearch,
  CalendarCheck,
  BarChart3,
  Bookmark,
  Settings,
  Sparkles,
  X,
  BookOpen,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "AI Notes Generator", href: "/dashboard/notes", icon: FileText },
  { label: "Quiz Generator", href: "/dashboard/quiz", icon: HelpCircle },
  { label: "AI Tutor (Hinglish)", href: "/dashboard/tutor", icon: Brain },
  { label: "Flashcards", href: "/dashboard/flashcards", icon: Layers },
  { label: "PDF Study Tools", href: "/dashboard/documents", icon: FileSearch },
  { label: "Study Planner", href: "/dashboard/planner", icon: CalendarCheck },
  { label: "Progress Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Saved Notes", href: "/dashboard/saved", icon: Bookmark },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ mobileOpen = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  const content = (
    <div className="flex flex-col h-full bg-[#10152B]/90 backdrop-blur-2xl border-r border-white/10 w-64 p-4 text-[#A5B4CF]">
      {/* Brand */}
      <div className="flex items-center justify-between pb-6 mb-2 border-b border-white/10 px-2">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base text-white group-hover:text-indigo-300 transition block">
              AI Study <span className="gradient-text">Mate</span>
            </span>
            <span className="text-[10px] text-indigo-400 font-medium">Smart Assistant</span>
          </div>
        </Link>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1 overflow-y-auto py-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "gradient-primary text-white shadow-lg shadow-indigo-500/25 font-semibold"
                  : "text-[#A5B4CF] hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-indigo-400"}`} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Demo mode indicator */}
      <div className="pt-4 border-t border-white/10 px-2">
        <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs">
          <div className="flex items-center gap-1.5 text-indigo-300 font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Ready</span>
          </div>
          <p className="text-[11px] text-[#A5B4CF] leading-tight">
            Next.js App Router + Google Gemini API.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block shrink-0 sticky top-0 h-screen z-30">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative z-10">{content}</div>
        </div>
      )}
    </>
  );
}
