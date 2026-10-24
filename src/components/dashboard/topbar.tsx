"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  Search,
  Sparkles,
  Key,
  GraduationCap,
  Bell,
  ArrowRight,
} from "lucide-react";

interface TopbarProps {
  onToggleMobileSidebar: () => void;
}

export function Topbar({ onToggleMobileSidebar }: TopbarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to AI Tutor with question or Notes Generator
      router.push(`/dashboard/tutor?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-white/10 bg-[#080B18]/80 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-xl text-[#A5B4CF] hover:text-white hover:bg-white/5 transition"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Prompt/Search bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-xs text-[#A5B4CF] focus-within:border-indigo-500/50 focus-within:text-white w-64 md:w-80 transition"
        >
          <Search className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ask AI Tutor anything (e.g., Photosynthesis)..."
            className="bg-transparent border-none outline-none text-xs text-white placeholder-[#A5B4CF]/60 w-full"
          />
          <button
            type="submit"
            className="p-1 rounded hover:bg-white/10 text-indigo-400 hover:text-white transition"
            title="Ask AI"
          >
            <ArrowRight className="w-3 h-3" />
          </button>
        </form>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Presentation Demo Mode Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="hidden sm:inline">Presentation</span> Demo Mode
        </div>

        {/* API Settings Quick Link */}
        <Link
          href="/dashboard/settings"
          className="p-2 rounded-xl text-[#A5B4CF] hover:text-white hover:bg-white/5 transition flex items-center gap-1.5 text-xs border border-transparent hover:border-white/10"
          title="Configure Gemini API Key"
        >
          <Key className="w-4 h-4 text-indigo-400" />
          <span className="hidden lg:inline text-xs">API Key</span>
        </Link>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/10">
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-500/20">
            S
          </div>
          <div className="hidden sm:block text-left text-xs leading-tight">
            <span className="font-semibold text-white block">Student</span>
            <span className="text-[10px] text-indigo-300">Classroom Demo</span>
          </div>
        </div>
      </div>
    </header>
  );
}
