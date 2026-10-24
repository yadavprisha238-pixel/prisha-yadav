"use client";

import React from "react";
import { Sparkles, FileText, CheckCircle2, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

const STEPS = [
  {
    step: "01",
    title: "Pick Any Topic or Upload Notes",
    description:
      "Type any subject concept (e.g. 'Photosynthesis', 'Binary Search', 'Electromagnetic Induction') or drop your lecture notes/PDF.",
    icon: FileText,
  },
  {
    step: "02",
    title: "AI Crafts Hinglish Notes & Tests",
    description:
      "Gemini generates simple, structured notes with real-world analogies, bullet points, formulas, and an instant interactive 5-question test.",
    icon: Sparkles,
  },
  {
    step: "03",
    title: "Master Concepts & Ace Exams",
    description:
      "Ask the Hinglish Tutor if you ever get stuck, flip smart revision flashcards, and track your streaks and scores on the live dashboard.",
    icon: TrendingUp,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 relative z-10 border-t border-white/5 bg-[#10152B]/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-2">
            Simple 3-Step Workflow
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How <span className="gradient-text">AI Study Mate</span> Works
          </p>
          <p className="mt-4 text-base text-[#A5B4CF]">
            No complex setup or overwhelming menus. From prompt to deep conceptual mastery in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {STEPS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <GlassCard key={idx} className="p-8 relative group overflow-hidden">
                <div className="text-5xl font-extrabold text-indigo-500/20 mb-4 font-mono">
                  {item.step}
                </div>
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white mb-6 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-sm text-[#A5B4CF] leading-relaxed">{item.description}</p>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
