import React from "react";
import Link from "next/link";
import { BookOpen, Heart, Sparkles, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#080B18]/90 backdrop-blur-xl py-12 relative z-10 text-sm text-[#A5B4CF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1 */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-white">
                AI Study <span className="gradient-text">Mate</span>
              </span>
            </Link>
            <p className="text-xs text-[#A5B4CF] leading-relaxed mb-4">
              A modern, presentation-ready personal AI learning assistant designed to help students study smarter and achieve more.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Presentation Ready v1.0
            </div>
          </div>

          {/* Col 2: Features */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider">
              Core Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dashboard/notes" className="hover:text-white transition">
                  AI Notes Generator
                </Link>
              </li>
              <li>
                <Link href="/dashboard/quiz" className="hover:text-white transition">
                  Interactive Quiz Engine
                </Link>
              </li>
              <li>
                <Link href="/dashboard/tutor" className="hover:text-white transition">
                  Hinglish AI Tutor
                </Link>
              </li>
              <li>
                <Link href="/dashboard/flashcards" className="hover:text-white transition">
                  Flashcard Revisions
                </Link>
              </li>
              <li>
                <Link href="/dashboard/documents" className="hover:text-white transition">
                  PDF Study Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider">
              Application
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dashboard" className="hover:text-white transition">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/planner" className="hover:text-white transition">
                  Study Planner
                </Link>
              </li>
              <li>
                <Link href="/dashboard/analytics" className="hover:text-white transition">
                  Progress Analytics
                </Link>
              </li>
              <li>
                <Link href="/dashboard/settings" className="hover:text-white transition">
                  API & Settings
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition">
                  Project Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Project Info */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider">
              About Project
            </h4>
            <p className="text-xs text-[#A5B4CF] leading-relaxed mb-3">
              Built with Next.js App Router, TypeScript, Tailwind CSS, shadcn design patterns, and Google Gemini API.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition"
            >
              <span>View full architectural report</span>
              <Sparkles className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A5B4CF]">
          <p>© {new Date().getFullYear()} AI Study Mate. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for curious students everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
