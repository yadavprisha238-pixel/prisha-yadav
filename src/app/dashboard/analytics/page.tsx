"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Award,
  Flame,
  FileText,
  HelpCircle,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Storage } from "@/lib/storage";
import { UserStats, QuizAttempt, NoteItem } from "@/lib/types";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [quizzes, setQuizzes] = useState<QuizAttempt[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);

  useEffect(() => {
    setStats(Storage.getStats());
    setQuizzes(Storage.getQuizzes());
    setNotes(Storage.getNotes());
  }, []);

  // Compute subject performance
  const subjectScores: { [key: string]: { total: number; sum: number } } = {};
  quizzes.forEach((q) => {
    if (!subjectScores[q.subject]) {
      subjectScores[q.subject] = { total: 0, sum: 0 };
    }
    subjectScores[q.subject].total += 1;
    subjectScores[q.subject].sum += q.percentage;
  });

  const subjectBreakdown = Object.keys(subjectScores).map((s) => ({
    subject: s,
    avg: Math.round(subjectScores[s].sum / subjectScores[s].total),
    attempts: subjectScores[s].total,
  }));

  // Identify weak topics (quizzes with percentage < 70)
  const weakTopics = quizzes
    .filter((q) => q.percentage < 70)
    .map((q) => ({ title: q.title, subject: q.subject, score: q.percentage }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-indigo-400" />
          <span>Progress Analytics & Performance</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#A5B4CF] mt-1">
          Detailed metrics tracked across all your notes, interactive quiz attempts, and revision streaks.
        </p>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <GlassCard className="p-5 border-blue-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#A5B4CF]">Notes Created</span>
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-3xl font-extrabold text-white">
            {stats ? stats.totalNotes : 0}
          </span>
          <p className="text-[11px] text-blue-300 mt-1">Saved in personal library</p>
        </GlassCard>

        <GlassCard className="p-5 border-purple-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#A5B4CF]">Quizzes Completed</span>
            <HelpCircle className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-3xl font-extrabold text-white">
            {stats ? stats.quizzesCompleted : 0}
          </span>
          <p className="text-[11px] text-purple-300 mt-1">Verified quiz tests</p>
        </GlassCard>

        <GlassCard className="p-5 border-emerald-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#A5B4CF]">Overall Average</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-3xl font-extrabold text-emerald-400">
            {stats ? stats.averageScore : 0}%
          </span>
          <p className="text-[11px] text-emerald-300 mt-1">Mastery level: Excellent</p>
        </GlassCard>

        <GlassCard className="p-5 border-amber-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#A5B4CF]">Study Streak</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-3xl font-extrabold text-amber-400">
            {stats ? stats.studyStreakDays : 0} Days
          </span>
          <p className="text-[11px] text-amber-300 mt-1">Consistent learner</p>
        </GlassCard>
      </div>

      {/* Subject-Wise Performance Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <GlassCard className="p-6">
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span>Subject-Wise Performance</span>
            </h2>

            {subjectBreakdown.length > 0 ? (
              <div className="space-y-4">
                {subjectBreakdown.map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">{item.subject}</span>
                      <span className="text-indigo-300 font-mono">
                        {item.avg}% ({item.attempts} attempts)
                      </span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        style={{ width: `${item.avg}%` }}
                        className={`h-full rounded-full ${
                          item.avg >= 80
                            ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                            : item.avg >= 60
                            ? "gradient-primary"
                            : "bg-gradient-to-r from-rose-500 to-amber-500"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#A5B4CF] text-center py-6">
                Take quizzes to see your subject-by-subject breakdown.
              </p>
            )}
          </GlassCard>
        </div>

        {/* Weak Topics & Recommended Revisions */}
        <div className="lg:col-span-5">
          <GlassCard className="p-6">
            <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Areas for Revision</span>
            </h2>

            {weakTopics.length > 0 ? (
              <div className="space-y-2.5">
                {weakTopics.map((topic, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-white block">{topic.title}</span>
                      <span className="text-[10px] text-amber-300">
                        Recent Score: {topic.score}%
                      </span>
                    </div>
                    <Link
                      href={`/dashboard/tutor?q=${encodeURIComponent(
                        `Samajh nahi aaya: ${topic.title} ko simple Hinglish me samjhao`
                      )}`}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium transition"
                    >
                      Revise with AI
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                <span className="font-bold text-emerald-300 block">All Topics in Strong Range!</span>
                <p className="text-[#A5B4CF] text-[11px]">
                  All your quiz attempts scored above 70%. Keep up the phenomenal work!
                </p>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-white/10 text-center">
              <Link
                href="/dashboard/quiz"
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-1"
              >
                <span>Take a new diagnostic quiz</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
