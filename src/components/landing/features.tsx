"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  HelpCircle,
  Brain,
  Layers,
  FileSearch,
  CalendarCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

const FEATURES = [
  {
    icon: Brain,
    title: "Hinglish AI Tutor",
    description:
      "A patient 24/7 personal tutor that explains hard concepts in conversational Hinglish, Hindi, or English using everyday Indian examples.",
    badge: "Most Popular",
    color: "from-blue-500 to-indigo-500",
    href: "/dashboard/tutor",
  },
  {
    icon: FileText,
    title: "AI Notes Generator",
    description:
      "Turn any topic or syllabus into structured notes complete with definitions, formulas, bullet points, exam tips, and practice questions.",
    badge: "Gemini 1.5",
    color: "from-indigo-500 to-purple-500",
    href: "/dashboard/notes",
  },
  {
    icon: HelpCircle,
    title: "Adaptive AI Quizzes",
    description:
      "Generate multiple-choice quizzes with real-time scoring, detailed step-by-step answer explanations, and performance tracking.",
    badge: "Interactive",
    color: "from-purple-500 to-pink-500",
    href: "/dashboard/quiz",
  },
  {
    icon: Layers,
    title: "Smart Flashcards",
    description:
      "Flip cards with 3D animation, rate difficulty with spaced repetition, or auto-generate complete revision decks from your notes.",
    badge: "Spaced Repetition",
    color: "from-blue-500 to-cyan-500",
    href: "/dashboard/flashcards",
  },
  {
    icon: FileSearch,
    title: "PDF & Document Study Tools",
    description:
      "Upload lecture slides, question banks, or textbooks to extract key summaries, generate custom test questions, and chat directly with your document.",
    badge: "Document AI",
    color: "from-violet-500 to-indigo-500",
    href: "/dashboard/documents",
  },
  {
    icon: CalendarCheck,
    title: "AI Study Planner",
    description:
      "Input your exam date and daily study hours to receive an intelligent, editable revision sprint with completion tracking.",
    badge: "Goal Oriented",
    color: "from-emerald-500 to-teal-500",
    href: "/dashboard/planner",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-2">
            Powerful AI Study Toolkit
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Everything You Need to <span className="gradient-text">Top Your Exams</span>
          </p>
          <p className="mt-4 text-base sm:text-lg text-[#A5B4CF]">
            Engineered specifically for students who want deep conceptual understanding
            without getting lost in confusing textbook jargon.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <GlassCard
                key={idx}
                hoverEffect
                className="p-6 flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-200`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-sm text-[#A5B4CF] leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <Link
                    href={feature.href}
                    className="text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 flex items-center gap-1.5 transition"
                  >
                    <span>Launch Feature</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
