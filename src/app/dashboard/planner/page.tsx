"use client";

import React, { useState, useEffect } from "react";
import {
  CalendarCheck,
  Sparkles,
  Plus,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  RefreshCw,
  Trash2,
  Flame,
  BookOpen,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Storage } from "@/lib/storage";
import { StudyPlan, StudyTask, Difficulty } from "@/lib/types";

export default function StudyPlannerPage() {
  const [plan, setPlan] = useState<StudyPlan | null>(null);

  // Form states for creating new AI plan
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [examDate, setExamDate] = useState(
    new Date(Date.now() + 86400000 * 14).toISOString().split("T")[0]
  );
  const [subjectsInput, setSubjectsInput] = useState("Computer Science, Mathematics, Physics");
  const [topicsInput, setTopicsInput] = useState("OOP, Integration, Electromagnetism");
  const [dailyHours, setDailyHours] = useState(3.5);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Quick manual task addition
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [taskSubject, setTaskSubject] = useState("Computer Science");
  const [taskTopic, setTaskTopic] = useState("");
  const [taskMinutes, setTaskMinutes] = useState(45);
  const [taskPriority, setTaskPriority] = useState<"high" | "medium" | "low">("medium");

  useEffect(() => {
    setPlan(Storage.getStudyPlan());
  }, []);

  const handleToggleTask = (taskId: string) => {
    const updated = Storage.toggleTaskCompleted(taskId);
    setPlan(updated);
  };

  const handleCreateAIPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const subjects = subjectsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const customKey = Storage.getCustomApiKey();
      const res = await fetch("/api/ai/create-study-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(customKey ? { "x-gemini-key": customKey } : {}),
        },
        body: JSON.stringify({
          examDate,
          subjects,
          topics: topicsInput,
          dailyHours: Number(dailyHours),
          difficulty,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(
          data.message || "Failed to create AI study plan. Check your Gemini API key in Settings."
        );
        setLoading(false);
        return;
      }

      if (data.plan) {
        Storage.saveStudyPlan(data.plan);
        setPlan(data.plan);
        setShowGenerateModal(false);
      }
    } catch (err: any) {
      setErrorMessage("Network error: Could not reach the study planner service.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddManualTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTopic.trim()) return;

    const newTask: StudyTask = {
      id: "task-" + Date.now(),
      subject: taskSubject,
      topic: taskTopic,
      durationMinutes: Number(taskMinutes),
      dueDate: new Date().toISOString().split("T")[0],
      completed: false,
      priority: taskPriority,
    };

    const updated = Storage.addPlanTask(newTask);
    setPlan(updated);
    setShowAddTaskModal(false);
    setTaskTopic("");
  };

  const completedCount = plan?.tasks.filter((t) => t.completed).length || 0;
  const totalCount = plan?.tasks.length || 0;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CalendarCheck className="w-7 h-7 text-indigo-400" />
            <span>AI Study Planner</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#A5B4CF] mt-1">
            Personalized exam preparation sprints tailored to your target exam date and daily available hours.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddTaskModal(true)}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Add Task</span>
          </button>
          <button
            onClick={() => setShowGenerateModal(true)}
            className="gradient-primary gradient-primary-hover px-4 py-2 rounded-xl text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-500/25 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create AI Sprint</span>
          </button>
        </div>
      </div>

      {/* Plan Overview & Progress Bar */}
      {plan && (
        <GlassCard className="p-6 border-indigo-500/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Active Study Plan
                </span>
                {plan.isDemo && (
                  <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded">
                    Demo Sprint
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-white">{plan.title}</h2>
              <p className="text-xs text-[#A5B4CF] mt-1 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Target Exam Date: {plan.examDate}</span>
                <span>•</span>
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                <span>{plan.targetDailyHours} Hours / Day</span>
              </p>
            </div>

            <div className="text-right sm:border-l sm:border-white/10 sm:pl-6">
              <span className="text-3xl font-extrabold text-emerald-400">
                {progressPercent}%
              </span>
              <p className="text-xs text-[#A5B4CF]">
                {completedCount} of {totalCount} Tasks Finished
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
            <div
              style={{ width: `${progressPercent}%` }}
              className="h-full gradient-primary transition-all duration-500"
            />
          </div>
        </GlassCard>
      )}

      {/* Tasks List */}
      <GlassCard className="p-6">
        <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Sprint Tasks & Milestones</span>
        </h2>

        {plan && plan.tasks.length > 0 ? (
          <div className="space-y-3">
            {plan.tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => handleToggleTask(task.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  task.completed
                    ? "bg-emerald-950/20 border-emerald-500/30 text-gray-400"
                    : "bg-white/5 border-white/10 hover:border-indigo-500/30 text-white"
                }`}
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 transition ${
                      task.completed
                        ? "bg-emerald-500 border-emerald-500 text-black"
                        : "border-white/30"
                    }`}
                  >
                    {task.completed && <CheckCircle2 className="w-4 h-4 text-black" />}
                  </div>

                  <div>
                    <h3
                      className={`text-sm font-semibold ${
                        task.completed ? "line-through text-gray-400" : "text-white"
                      }`}
                    >
                      {task.topic}
                    </h3>
                    <p className="text-xs text-[#A5B4CF] mt-0.5 flex items-center gap-2">
                      <span className="text-indigo-300 font-medium">{task.subject}</span>
                      <span>•</span>
                      <span>{task.durationMinutes} mins</span>
                      <span>•</span>
                      <span>Due: {task.dueDate}</span>
                    </p>
                    {task.notes && (
                      <p className="text-[11px] text-[#A5B4CF]/80 italic mt-1">
                        Tip: {task.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      task.priority === "high"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : task.priority === "medium"
                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                        : "bg-white/10 text-gray-300 border border-white/10"
                    }`}
                  >
                    {task.priority} Priority
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-[#A5B4CF] text-xs">
            No study tasks in your plan. Click &apos;Create AI Sprint&apos; above!
          </div>
        )}
      </GlassCard>

      {/* AI Sprint Generator Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <form
            onSubmit={handleCreateAIPlan}
            className="w-full max-w-lg rounded-2xl border border-white/15 bg-[#10152B] p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Create Personalized AI Study Sprint</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowGenerateModal(false)}
                className="text-[#A5B4CF] hover:text-white text-xs"
              >
                Close
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A5B4CF] mb-1">
                Target Exam Date
              </label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full glass-input px-3 py-2 rounded-xl text-xs bg-[#10152B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A5B4CF] mb-1">
                Subjects (Comma-separated)
              </label>
              <input
                type="text"
                value={subjectsInput}
                onChange={(e) => setSubjectsInput(e.target.value)}
                placeholder="e.g. Physics, Chemistry, Math"
                className="w-full glass-input px-3 py-2 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A5B4CF] mb-1">
                Weak Topics / Focus Chapters
              </label>
              <input
                type="text"
                value={topicsInput}
                onChange={(e) => setTopicsInput(e.target.value)}
                placeholder="e.g. Integration, Thermodynamics, Organic Reactions"
                className="w-full glass-input px-3 py-2 rounded-xl text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#A5B4CF] mb-1">
                  Daily Available Hours
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="14"
                  value={dailyHours}
                  onChange={(e) => setDailyHours(Number(e.target.value))}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A5B4CF] mb-1">
                  Intensity / Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs bg-[#10152B]"
                >
                  <option value="easy">Gentle Pace</option>
                  <option value="medium">Standard Sprint</option>
                  <option value="hard">Intensive Bootcamp</option>
                </select>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <p>{errorMessage}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-primary gradient-primary-hover py-3 rounded-xl text-white text-xs font-bold transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Structuring Study Schedule...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Schedule</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Add Manual Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <form
            onSubmit={handleAddManualTask}
            className="w-full max-w-md rounded-2xl border border-white/15 bg-[#10152B] p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Add Custom Study Task</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddTaskModal(false)}
                className="text-[#A5B4CF] hover:text-white text-xs"
              >
                Close
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A5B4CF] mb-1">
                Subject
              </label>
              <input
                type="text"
                value={taskSubject}
                onChange={(e) => setTaskSubject(e.target.value)}
                className="w-full glass-input px-3 py-2 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A5B4CF] mb-1">
                Topic / Task Description
              </label>
              <input
                type="text"
                value={taskTopic}
                onChange={(e) => setTaskTopic(e.target.value)}
                placeholder="e.g. Solve 15 numerical problems from Chapter 4"
                className="w-full glass-input px-3 py-2 rounded-xl text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#A5B4CF] mb-1">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  value={taskMinutes}
                  onChange={(e) => setTaskMinutes(Number(e.target.value))}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A5B4CF] mb-1">
                  Priority
                </label>
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value as any)}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs bg-[#10152B]"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full gradient-primary gradient-primary-hover py-2.5 rounded-xl text-white text-xs font-bold transition"
            >
              Add Task
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
