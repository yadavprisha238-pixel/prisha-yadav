import React from "react";
import Link from "next/link";
import {
  BookOpen,
  ArrowLeft,
  CheckCircle2,
  Code2,
  Cpu,
  Layers,
  Sparkles,
  Database,
  Compass,
  GraduationCap,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export default function AboutProjectPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb / Back Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>

          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-semibold text-indigo-300 mb-4">
              <GraduationCap className="w-4 h-4" />
              Academic Project Presentation Dossier
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              About <span className="gradient-text">AI Study Mate</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[#A5B4CF] max-w-3xl leading-relaxed">
              A comprehensive technical overview of the problem, architectural design, engineering decisions, and impact of the AI Study Mate personal study assistant.
            </p>
          </div>

          <div className="space-y-8">
            {/* 1. Problem Statement */}
            <GlassCard className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <span className="font-bold text-lg">01</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">The Problem Statement</h2>
              </div>
              <div className="text-sm sm:text-base text-[#A5B4CF] space-y-3 leading-relaxed">
                <p>
                  Modern students face information overload. While textbooks and lecture materials are abundant, they are often dense, overly formal, and written in complex academic English that creates an unnecessary cognitive barrier.
                </p>
                <p>
                  Most existing AI chatbots (like generic GPT interfaces) fail to act as effective study partners because:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-gray-300">
                  <li>They provide dry, formal answers rather than interactive, pedagogically sound explanations.</li>
                  <li>They lack language localization—students in multilingual environments (such as India) understand best when concepts are broken down in intuitive <strong className="text-white">Hinglish</strong> with relatable everyday analogies.</li>
                  <li>They lack integrated study workflows like instant self-grading quizzes, spaced-repetition flashcards, and personalized study schedules.</li>
                </ul>
              </div>
            </GlassCard>

            {/* 2. Proposed Solution */}
            <GlassCard className="p-6 sm:p-8 border-indigo-500/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl gradient-primary text-white flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">The Proposed Solution</h2>
              </div>
              <p className="text-sm sm:text-base text-[#A5B4CF] leading-relaxed mb-4">
                <strong className="text-white">AI Study Mate</strong> is a unified, presentation-ready web application engineered to transform passive reading into active, high-retention learning.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <h3 className="font-semibold text-white text-sm mb-1">Localized Hinglish AI Tutor</h3>
                  <p className="text-xs text-[#A5B4CF]">
                    Explains topics using everyday analogies (e.g. chai brewing for chemical reactions, car blueprints for classes/objects). Features a zero-judgment &quot;Samajh nahi aaya&quot; simplification mode.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <h3 className="font-semibold text-white text-sm mb-1">Structured High-Yield Notes</h3>
                  <p className="text-xs text-[#A5B4CF]">
                    Produces notes structured for exam success: definitions, key concept pillars, bullet points, formulas, exam tips, and self-test questions.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <h3 className="font-semibold text-white text-sm mb-1">Verified Client-Side Quiz Engine</h3>
                  <p className="text-xs text-[#A5B4CF]">
                    Interactive test mode with mathematically calculated scores, immediate explanation of mistakes, and celebration feedback.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <h3 className="font-semibold text-white text-sm mb-1">Zero-Friction Demo Mode</h3>
                  <p className="text-xs text-[#A5B4CF]">
                    Runs smoothly on any device without requiring mandatory login or API configuration, while seamlessly supporting Supabase and Gemini when credentials are provided.
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* 3. Technology Stack & Architecture */}
            <GlassCard className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Code2 className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Technology Stack</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <span className="font-semibold text-white block mb-1">Frontend Framework</span>
                  <span className="text-indigo-300">Next.js 14 (App Router) + TypeScript</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <span className="font-semibold text-white block mb-1">Styling & Design</span>
                  <span className="text-indigo-300">Tailwind CSS + Glassmorphism UI tokens</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <span className="font-semibold text-white block mb-1">Artificial Intelligence</span>
                  <span className="text-indigo-300">Google Gemini API (1.5 Flash)</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <span className="font-semibold text-white block mb-1">Cloud Database & Auth</span>
                  <span className="text-indigo-300">Supabase (PostgreSQL + RLS)</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <span className="font-semibold text-white block mb-1">Validation & Safety</span>
                  <span className="text-indigo-300">Zod schema validation on all endpoints</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                  <span className="font-semibold text-white block mb-1">Local Persistence</span>
                  <span className="text-indigo-300">Unified Storage Layer (localStorage + cloud sync)</span>
                </div>
              </div>
            </GlassCard>

            {/* 4. Future Scope */}
            <GlassCard className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Compass className="w-5 h-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Future Scope & Roadmap</h2>
              </div>
              <div className="space-y-3 text-sm text-[#A5B4CF]">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <p>
                    <strong className="text-white">Real-Time Voice Tutor:</strong> Enable speech-to-speech interaction using Gemini Live API for hands-free study sessions.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <p>
                    <strong className="text-white">Collaborative Study Rooms:</strong> Peer-to-peer revision sessions with live synchronized quiz competitions.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <p>
                    <strong className="text-white">Handwritten Formula OCR:</strong> Photo-based diagram and mathematical equation solver with step-by-step calculus proofs.
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* CTA to launch */}
            <div className="text-center pt-6">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 gradient-primary gradient-primary-hover text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-500/30 transition"
              >
                <span>Launch Interactive Demo</span>
                <Sparkles className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
