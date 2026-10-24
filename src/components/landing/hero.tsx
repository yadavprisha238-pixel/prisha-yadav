"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Play,
  Brain,
  FileText,
  HelpCircle,
  Clock,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

export function Hero() {
  return (
    <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Top Announcement Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-xs sm:text-sm font-medium text-indigo-200">
            Next-Gen AI Learning Powered by Google Gemini
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
          Study Smarter. <br />
          <span className="gradient-text">Learn Faster.</span> Achieve More.
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-[#A5B4CF] max-w-2xl mx-auto leading-relaxed">
          Your personal AI study companion that turns complex topics into simple{" "}
          <span className="text-indigo-300 font-medium">Hinglish explanations</span>,{" "}
          smart notes, and interactive quizzes.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto gradient-primary gradient-primary-hover text-white text-base font-semibold px-8 py-3.5 rounded-xl shadow-xl shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-[#F8FAFC] text-base font-medium transition backdrop-blur-md flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 text-indigo-400 fill-indigo-400" />
            <span>Explore Features</span>
          </a>
        </div>

        {/* Interactive Glass Dashboard Mockup Preview */}
        <div className="mt-16 sm:mt-20 max-w-5xl mx-auto relative group">
          {/* Subtle Glow behind frame */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl blur-2xl opacity-30 group-hover:opacity-40 transition duration-500"></div>

          <div className="relative rounded-2xl md:rounded-3xl border border-white/15 bg-[#10152B]/80 backdrop-blur-2xl shadow-2xl p-4 sm:p-6 overflow-hidden text-left">
            {/* Window Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs text-[#A5B4CF] font-mono">
                  ai-study-mate.app/dashboard
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                AI Online & Ready
              </div>
            </div>

            {/* Dashboard Mockup Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Hinglish Tutor Sample */}
              <GlassCard className="p-4 border-indigo-500/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Hinglish AI Tutor</h3>
                    <p className="text-xs text-[#A5B4CF]">Real-world analogies</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-white/5 text-gray-300 border border-white/5">
                    <p className="text-[11px] text-indigo-300 font-semibold mb-0.5">Student:</p>
                    <p>&quot;Bhai, Recursion ko chai banane ke example se samjhao na!&quot;</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-indigo-100">
                    <p className="text-[11px] text-purple-300 font-semibold mb-0.5">AI Tutor:</p>
                    <p>
                      &quot;Arre dekho, jab tak chai me boil nahi aata, aap baar-baar check karte ho. Wahi base condition hai!&quot;
                    </p>
                  </div>
                </div>
              </GlassCard>

              {/* Card 2: AI Quiz Progress */}
              <GlassCard className="p-4 border-purple-500/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Interactive Quizzes</h3>
                    <p className="text-xs text-[#A5B4CF]">Instant scoring & feedback</p>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-[#A5B4CF]">Question 4 of 5</span>
                    <span className="text-emerald-400 font-semibold">Score: 80%</span>
                  </div>
                  <p className="text-xs font-medium text-white mb-3">
                    Which OOP pillar is responsible for data hiding?
                  </p>
                  <div className="space-y-1.5">
                    <div className="p-2 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between">
                      <span>✓ Encapsulation</span>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="p-2 rounded-md bg-white/5 text-xs text-[#A5B4CF]">
                      Inheritance
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Card 3: Notes Generator */}
              <GlassCard className="p-4 border-blue-500/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Smart Revision Notes</h3>
                    <p className="text-xs text-[#A5B4CF]">Formatted for exam success</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block mb-1">
                      Key Exam Takeaway
                    </span>
                    <p className="text-[#F8FAFC] line-clamp-3">
                      Photosynthesis has 2 phases: Light reactions in Thylakoids and Dark reactions in the Stroma.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 text-[10px]">
                      Markdown Export
                    </span>
                    <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-300 text-[10px]">
                      PDF Export
                    </span>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
