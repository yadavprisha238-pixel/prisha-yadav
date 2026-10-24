"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

const FAQS = [
  {
    q: "Do I need a paid account or API key to try AI Study Mate?",
    a: "Not at all! AI Study Mate comes with a built-in Demo Mode preloaded with realistic curriculum notes, quizzes, and flashcards so you can explore all features immediately. To unlock unlimited real-time AI generation, you can supply a 100% free Google Gemini API key from Google AI Studio.",
  },
  {
    q: "What makes the Hinglish AI Tutor different from ChatGPT or other chatbots?",
    a: "Traditional AI responds in academic English full of convoluted jargon. Our Hinglish AI Tutor uses natural conversational Hinglish, step-by-step thinking, and everyday Indian analogies (like making chai, cricket, or local traffic) to explain difficult physics, math, and coding concepts. If you ever say 'Samajh nahi aaya', it simplifies even further without judgment!",
  },
  {
    q: "How does the AI Quiz Generator score my answers?",
    a: "Scoring is calculated client-side with 100% mathematical precision based on verified answers—not by trusting an AI to estimate your marks. You see your live progress, instant answer feedback, in-depth explanations, and final percentage.",
  },
  {
    q: "Can I save my generated notes and study plans?",
    a: "Yes! Everything is saved automatically in your browser's local storage so it persists even if you refresh or reopen the app. When Supabase is configured with your project URL, cloud synchronization and multi-device accounts become active automatically.",
  },
  {
    q: "Is AI Study Mate suitable for college, school, and competitive exams?",
    a: "Yes, it is designed for students across high school (Class 9-12), university/engineering (B.Tech, BCA, BSc), and competitive test preparation (JEE, NEET, GATE, UPSC) who need high-yield revision and active recall.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 relative z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Got Questions? <span className="gradient-text">We&apos;ve Got Answers</span>
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <GlassCard
                key={idx}
                className="p-5 cursor-pointer transition-all border-white/10 hover:border-indigo-500/30"
                onClick={() => toggle(idx)}
              >
                <div className="flex justify-between items-center gap-4">
                  <h3 className="text-base sm:text-lg font-semibold text-white">{faq.q}</h3>
                  <ChevronDown
                    className={`w-5 h-5 text-indigo-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {isOpen && (
                  <p className="mt-3 text-sm text-[#A5B4CF] leading-relaxed pt-2 border-t border-white/5">
                    {faq.a}
                  </p>
                )}
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
