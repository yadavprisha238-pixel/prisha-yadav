"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  HelpCircle,
  Brain,
  Layers,
  FileSearch,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Flame,
  CheckCircle2,
  Clock,
  BookOpen,
  Calendar,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { ApiStatusBanner } from "@/components/ui/api-status-banner";
import { Storage } from "@/lib/storage";
import { NoteItem, QuizAttempt, StudyPlan, UserStats } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentNotes, setRecentNotes] = useState<NoteItem[]>([]);
  const [recentQuizzes, setRecentQuizzes] = useState<QuizAttempt[]>([]);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [promptInput, setPromptInput] = useState("");

  useEffect(() => {
    // Load from storage
    const loadedStats = Storage.getStats();
    const loadedNotes = Storage.getNotes();
    const loadedQuizzes = Storage.getQuizzes();
    const loadedPlan = Storage.getStudyPlan();

    setStats(loadedStats);
    setRecentNotes(loadedNotes.slice(0, 3));
    setRecentQuizzes(loadedQuizzes.slice(0, 2));
    setStudyPlan(loadedPlan);
  }, []);

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    router.push(`/dashboard/tutor?q=${encodeURIComponent(promptInput.trim())}`);
  };

  const handleToggleTask = (taskId: string) => {
    const updated = Storage.toggleTaskCompleted(taskId);
    setStudyPlan(updated);
  };

  return (
    <div className="space-y-8">
      {/* Presentation/Demo Status Banner */}
      <ApiStatusBanner />

      {/* Hero Greeting & Quick AI Prompt */}
      <div className="relative rounded-3xl border border-white/10 bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-purple-950/40 p-6 sm:p-8 backdrop-blur-xl overflow-hidden shadow-glass">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Personal Study Space
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Hey Student, <span className="gradient-text">Ready to Learn?</span>
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#A5B4CF]">
            Your personal AI study space. What would you like to master today?
          </p>

          {/* Large Prompt Bar */}
          <form onSubmit={handlePromptSubmit} className="mt-6 flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="Ask any concept in Hinglish (e.g. 'Polymorphism with chai analogy' or 'Newton 3rd Law')..."
                className="w-full glass-input px-4 py-3.5 rounded-2xl text-sm placeholder-[#A5B4CF]/60 text-white shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="gradient-primary gradient-primary-hover px-6 py-3.5 rounded-2xl text-white text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-500/25 transition shrink-0"
            >
              <span>Ask Tutor</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <GlassCard className="p-5 border-blue-500/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#A5B4CF]">Total Notes Created</span>
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {stats ? stats.totalNotes : 0}
          </div>
          <p className="text-[11px] text-blue-300 mt-1 flex items-center gap-1">
            <span>Saved in library</span>
          </p>
        </GlassCard>

        <GlassCard className="p-5 border-purple-500/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#A5B4CF]">Quizzes Completed</span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {stats ? stats.quizzesCompleted : 0}
          </div>
          <p className="text-[11px] text-purple-300 mt-1 flex items-center gap-1">
            <span>Verified scores</span>
          </p>
        </GlassCard>

        <GlassCard className="p-5 border-emerald-500/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#A5B4CF]">Average Quiz Score</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {stats ? stats.averageScore : 0}%
          </div>
          <p className="text-[11px] text-emerald-300 mt-1 flex items-center gap-1">
            <span>High performance</span>
          </p>
        </GlassCard>

        <GlassCard className="p-5 border-amber-500/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[#A5B4CF]">Study Streak</span>
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {stats ? stats.studyStreakDays : 0} <span className="text-sm font-normal text-[#A5B4CF]">Days</span>
          </div>
          <p className="text-[11px] text-amber-300 mt-1 flex items-center gap-1">
            <span>Keep the streak going!</span>
          </p>
        </GlassCard>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <span>Quick Launch Study Tools</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <Link href="/dashboard/notes" className="group">
            <GlassCard hoverEffect className="p-4 text-center h-full flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-white">Generate Notes</span>
              <span className="text-[10px] text-[#A5B4CF] mt-0.5">High-Yield Summaries</span>
            </GlassCard>
          </Link>

          <Link href="/dashboard/quiz" className="group">
            <GlassCard hoverEffect className="p-4 text-center h-full flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                <HelpCircle className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-white">Take Quiz</span>
              <span className="text-[10px] text-[#A5B4CF] mt-0.5">Instant MCQs & scoring</span>
            </GlassCard>
          </Link>

          <Link href="/dashboard/tutor" className="group">
            <GlassCard hoverEffect className="p-4 text-center h-full flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                <Brain className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-white">Hinglish Tutor</span>
              <span className="text-[10px] text-[#A5B4CF] mt-0.5">Chai-level analogies</span>
            </GlassCard>
          </Link>

          <Link href="/dashboard/flashcards" className="group">
            <GlassCard hoverEffect className="p-4 text-center h-full flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-white">Flashcards</span>
              <span className="text-[10px] text-[#A5B4CF] mt-0.5">Smart Spaced Recall</span>
            </GlassCard>
          </Link>

          <Link href="/dashboard/documents" className="group col-span-2 sm:col-span-1">
            <GlassCard hoverEffect className="p-4 text-center h-full flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                <FileSearch className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-white">PDF Tools</span>
              <span className="text-[10px] text-[#A5B4CF] mt-0.5">Summarize & Ask</span>
            </GlassCard>
          </Link>
        </div>
      </div>

      {/* Main 2-Column Section: Today's Goals & Weekly Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Goals (2 Columns on large screen) */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <h2 className="text-base font-bold text-white">Today&apos;s Study Goals</h2>
              </div>
              <Link
                href="/dashboard/planner"
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                <span>Manage Planner</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {studyPlan && studyPlan.tasks.length > 0 ? (
              <div className="space-y-2.5">
                {studyPlan.tasks.slice(0, 4).map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      task.completed
                        ? "bg-emerald-950/20 border-emerald-500/30 text-[#A5B4CF]"
                        : "bg-white/5 border-white/10 hover:border-indigo-500/30 text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                          task.completed
                            ? "bg-emerald-500 border-emerald-500 text-black"
                            : "border-white/30"
                        }`}
                      >
                        {task.completed && <CheckCircle2 className="w-4 h-4 text-black" />}
                      </div>
                      <div>
                        <p
                          className={`text-xs font-semibold ${
                            task.completed ? "line-through text-gray-400" : "text-white"
                          }`}
                        >
                          {task.topic}
                        </p>
                        <p className="text-[11px] text-[#A5B4CF]">
                          {task.subject} • {task.durationMinutes} mins
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        task.priority === "high"
                          ? "bg-rose-500/20 text-rose-300"
                          : "bg-indigo-500/20 text-indigo-300"
                      }`}
                    >
                      {task.priority.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-[#A5B4CF]">
                No study tasks for today. Visit the Study Planner to generate an AI sprint!
              </div>
            )}
          </GlassCard>

          {/* Recent Notes Created */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <h2 className="text-base font-bold text-white">Saved Notes</h2>
              </div>
              <Link
                href="/dashboard/saved"
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentNotes.map((note) => (
                <Link
                  key={note.id}
                  href={`/dashboard/notes?id=${note.id}`}
                  className="block p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition">
                      {note.title}
                    </span>
                    {note.isDemo && (
                      <span className="text-[9px] font-semibold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        Demo Note
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#A5B4CF] line-clamp-1">
                    {note.content.introduction}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-[10px] text-indigo-400">
                    <span>{note.subject}</span>
                    <span>•</span>
                    <span className="capitalize">{note.language}</span>
                  </div>
                </Link>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Weekly Activity & Recommended Topics */}
        <div className="space-y-6">
          {/* Weekly Activity Progress */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Weekly Activity</span>
              </h2>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono">
                +12% this week
              </span>
            </div>

            {/* Custom SVG / Bar Visualizer */}
            <div className="h-32 flex items-end justify-between gap-2 pt-4 px-2 border-b border-white/10 pb-2">
              {[
                { day: "Mon", height: "45%", val: "30m" },
                { day: "Tue", height: "70%", val: "45m" },
                { day: "Wed", height: "60%", val: "40m" },
                { day: "Thu", height: "85%", val: "60m" },
                { day: "Fri", height: "100%", val: "75m" },
                { day: "Sat", height: "50%", val: "35m" },
                { day: "Sun", height: "90%", val: "65m" },
              ].map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div className="w-full bg-white/5 rounded-t-md relative flex items-end h-24">
                    <div
                      style={{ height: bar.height }}
                      className="w-full rounded-t-md gradient-primary transition-all duration-300 group-hover:brightness-125"
                    />
                  </div>
                  <span className="text-[10px] text-[#A5B4CF] font-mono">{bar.day}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-[#A5B4CF] mt-3 text-center">
              Daily goal: 45 mins • Keep going to maintain your streak!
            </p>
          </GlassCard>

          {/* Recommended Topics */}
          <GlassCard className="p-6">
            <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Recommended Topics</span>
            </h2>
            <div className="space-y-2">
              {[
                { name: "Object-Oriented Programming (OOP)", subject: "Computer Science" },
                { name: "Photosynthesis & Light Reactions", subject: "Biology" },
                { name: "Newton's Laws with Real Life Analogy", subject: "Physics" },
                { name: "Integration by Substitution", subject: "Mathematics" },
              ].map((topic, idx) => (
                <Link
                  key={idx}
                  href={`/dashboard/notes?topic=${encodeURIComponent(
                    topic.name
                  )}&subject=${encodeURIComponent(topic.subject)}`}
                  className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between text-xs text-white transition group"
                >
                  <div>
                    <span className="font-semibold block group-hover:text-indigo-300 transition">
                      {topic.name}
                    </span>
                    <span className="text-[10px] text-[#A5B4CF]">{topic.subject}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400 group-hover:translate-x-0.5 transition" />
                </Link>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
