"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  HelpCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Award,
  AlertCircle,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Storage } from "@/lib/storage";
import { SAMPLE_QUIZ_QUESTIONS } from "@/lib/sample-data";
import { QuizQuestion, QuizAttempt, Difficulty, Language } from "@/lib/types";

export default function QuizPage() {
  // Setup form states
  const [subject, setSubject] = useState("Computer Science");
  const [topic, setTopic] = useState("Object-Oriented Programming (OOP)");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [numQuestions, setNumQuestions] = useState(5);
  const [language, setLanguage] = useState<Language>("hinglish");

  // Quiz running states
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [quizActive, setQuizActive] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  // Active quiz data
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qIdx: number]: number }>({});
  const [finalScore, setFinalScore] = useState({ correct: 0, total: 0, percentage: 0 });

  // Quiz History
  const [history, setHistory] = useState<QuizAttempt[]>([]);

  useEffect(() => {
    setHistory(Storage.getQuizzes());
  }, []);

  const handleGenerateQuiz = async () => {
    if (!subject.trim() || !topic.trim()) {
      setErrorMessage("Please enter both Subject and Topic.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const customKey = Storage.getCustomApiKey();
      const res = await fetch("/api/ai/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(customKey ? { "x-gemini-key": customKey } : {}),
        },
        body: JSON.stringify({
          subject,
          topic,
          difficulty,
          numQuestions: Number(numQuestions),
          language,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "GEMINI_API_KEY_MISSING") {
          setErrorMessage(
            "Gemini API key is not configured. Add your key in Settings, or click below to launch the pre-loaded Presentation Demo Quiz!"
          );
        } else {
          setErrorMessage(data.message || "Failed to generate quiz.");
        }
        setLoading(false);
        return;
      }

      if (data.questions && data.questions.length > 0) {
        startQuizSession(data.questions);
      } else {
        setErrorMessage("No valid questions returned. Please retry.");
      }
    } catch (err: any) {
      setErrorMessage("Network error: Could not reach the quiz generator.");
    } finally {
      setLoading(false);
    }
  };

  const startDemoQuiz = () => {
    startQuizSession(SAMPLE_QUIZ_QUESTIONS);
    setErrorMessage("");
  };

  const startQuizSession = (quizQuestions: QuizQuestion[]) => {
    setQuestions(quizQuestions);
    setSelectedAnswers({});
    setCurrentIdx(0);
    setQuizActive(true);
    setQuizFinished(false);
  };

  const handleSelectOption = (optIdx: number) => {
    if (quizFinished) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentIdx]: optIdx,
    });
  };

  const handleSubmitQuiz = () => {
    // Mathematically calculate score client-side with 100% precision
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIndex) {
        correctCount += 1;
      }
    });

    const total = questions.length;
    const percentage = Math.round((correctCount / total) * 100);

    setFinalScore({ correct: correctCount, total, percentage });
    setQuizFinished(true);

    // Save attempt to local storage
    const newAttempt: QuizAttempt = {
      id: `quiz-attempt-${Date.now()}`,
      title: `${topic} (${difficulty.toUpperCase()})`,
      subject,
      difficulty,
      language,
      totalQuestions: total,
      userAnswers: selectedAnswers,
      score: correctCount,
      percentage,
      completedAt: new Date().toISOString(),
      questions,
      isDemo: questions === SAMPLE_QUIZ_QUESTIONS,
    };

    const updated = Storage.saveQuizAttempt(newAttempt);
    setHistory(updated);

    // Fire celebration confetti if score >= 60%
    if (percentage >= 60) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B"],
      });
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setCurrentIdx(0);
    setQuizFinished(false);
  };

  const currentQuestion = questions[currentIdx];
  const progressPercent =
    questions.length > 0 ? Math.round(((currentIdx + 1) / questions.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <HelpCircle className="w-7 h-7 text-purple-400" />
          <span>AI Quiz Generator</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#A5B4CF] mt-1">
          Adaptive multiple-choice quizzes with client-calculated scoring, instant explanations, and performance history.
        </p>
      </div>

      {!quizActive ? (
        /* Quiz Configuration Screen */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-4">
            <GlassCard className="p-6 space-y-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Configure Your Quiz</span>
              </h2>

              {/* Subject */}
              <div>
                <label className="block text-xs font-semibold text-[#A5B4CF] mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Computer Science, Biology"
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                />
              </div>

              {/* Topic */}
              <div>
                <label className="block text-xs font-semibold text-[#A5B4CF] mb-1">
                  Topic
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. OOP Concepts, Plant Respiration"
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                />
              </div>

              {/* Difficulty & Number of Questions */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#A5B4CF] mb-1">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs bg-[#10152B]"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#A5B4CF] mb-1">
                    Questions
                  </label>
                  <select
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Number(e.target.value))}
                    className="w-full glass-input px-3 py-2 rounded-xl text-xs bg-[#10152B]"
                  >
                    <option value={3}>3 Questions</option>
                    <option value={5}>5 Questions</option>
                    <option value={10}>10 Questions</option>
                  </select>
                </div>
              </div>

              {/* Language */}
              <div>
                <label className="block text-xs font-semibold text-[#A5B4CF] mb-1">
                  Language
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["hinglish", "hindi", "english"] as Language[]).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setLanguage(lang)}
                      className={`py-1.5 rounded-lg text-xs font-medium capitalize border transition ${
                        language === lang
                          ? "gradient-primary text-white border-transparent shadow-md shadow-indigo-500/20"
                          : "bg-white/5 border-white/10 text-[#A5B4CF] hover:text-white"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <div>
                    <p>{errorMessage}</p>
                    <button
                      onClick={startDemoQuiz}
                      className="mt-2 inline-flex items-center gap-1 underline text-purple-300 font-semibold"
                    >
                      Launch Presentation Demo Quiz
                    </button>
                  </div>
                </div>
              )}

              {/* Start Quiz CTA */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={handleGenerateQuiz}
                  disabled={loading}
                  className="w-full gradient-primary gradient-primary-hover py-3 rounded-xl text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Generating with Gemini AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate & Start Quiz</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={startDemoQuiz}
                  className="w-full py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-medium text-purple-300 transition"
                >
                  Launch Instant Demo Quiz (No API key needed)
                </button>
              </div>
            </GlassCard>
          </div>

          {/* Past Attempts History */}
          <div className="lg:col-span-7">
            <GlassCard className="p-6">
              <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Quiz Performance History</span>
              </h2>

              {history.length > 0 ? (
                <div className="space-y-3">
                  {history.map((att) => (
                    <div
                      key={att.id}
                      className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-white">{att.title}</span>
                          {att.isDemo && (
                            <span className="text-[9px] font-mono uppercase bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded">
                              Demo
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#A5B4CF]">
                          {att.subject} • {att.totalQuestions} Questions • Completed on{" "}
                          {new Date(att.completedAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="text-right">
                        <div
                          className={`text-lg font-extrabold ${
                            att.percentage >= 70
                              ? "text-emerald-400"
                              : att.percentage >= 50
                              ? "text-amber-400"
                              : "text-rose-400"
                          }`}
                        >
                          {att.percentage}%
                        </div>
                        <span className="text-[10px] text-[#A5B4CF]">
                          {att.score} / {att.totalQuestions} Correct
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#A5B4CF] text-center py-8">
                  No completed quizzes yet. Take your first quiz to track your mastery!
                </p>
              )}
            </GlassCard>
          </div>
        </div>
      ) : (
        /* Active Quiz Screen (One Question at a time or Result Screen) */
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Progress Header */}
          <GlassCard className="p-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-white font-semibold">
                Question {currentIdx + 1} of {questions.length}
              </span>
              <span className="text-indigo-400 font-mono">{progressPercent}% Completed</span>
            </div>
            {/* Visual Progress Bar */}
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                style={{ width: `${progressPercent}%` }}
                className="h-full gradient-primary transition-all duration-300"
              />
            </div>
          </GlassCard>

          {/* Question Card */}
          {currentQuestion && (
            <GlassCard className="p-6 sm:p-8 space-y-6">
              <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
                {currentQuestion.question}
              </h2>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentIdx] === optIdx;
                  const isSubmitted = quizFinished;
                  const isCorrect = optIdx === currentQuestion.correctAnswerIndex;

                  let borderClass = "border-white/10 hover:border-indigo-500/40 bg-white/5";
                  if (isSelected && !isSubmitted) {
                    borderClass = "border-indigo-500 bg-indigo-500/20 text-white shadow-md shadow-indigo-500/20";
                  } else if (isSubmitted) {
                    if (isCorrect) {
                      borderClass = "border-emerald-500 bg-emerald-500/20 text-emerald-100";
                    } else if (isSelected && !isCorrect) {
                      borderClass = "border-rose-500 bg-rose-500/20 text-rose-100";
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={quizFinished}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition flex items-center justify-between ${borderClass}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold text-[#A5B4CF]">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {isSubmitted && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                      {isSubmitted && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Detailed Explanation revealed after submission */}
              {quizFinished && (
                <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs space-y-1">
                  <span className="font-bold text-indigo-300 block uppercase tracking-wider text-[10px]">
                    Explanation:
                  </span>
                  <p className="text-gray-200 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  type="button"
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx(currentIdx - 1)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-30"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                {currentIdx < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIdx(currentIdx + 1)}
                    className="gradient-primary gradient-primary-hover px-5 py-2 rounded-xl text-white text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : !quizFinished ? (
                  <button
                    type="button"
                    onClick={handleSubmitQuiz}
                    className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/25 transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Quiz</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setQuizActive(false)}
                    className="gradient-primary px-5 py-2 rounded-xl text-white text-xs font-semibold"
                  >
                    Back to Setup
                  </button>
                )}
              </div>
            </GlassCard>
          )}

          {/* Results Summary Modal / Card */}
          {quizFinished && (
            <GlassCard className="p-6 border-emerald-500/30 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl gradient-primary mx-auto flex items-center justify-center text-white shadow-xl shadow-indigo-500/30">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">Quiz Completed!</h3>
              <p className="text-sm text-[#A5B4CF]">
                You scored{" "}
                <span className="text-emerald-400 font-bold text-lg">
                  {finalScore.correct} / {finalScore.total}
                </span>{" "}
                ({finalScore.percentage}%)
              </p>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleRetry}
                  className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Same Quiz</span>
                </button>
                <button
                  type="button"
                  onClick={() => setQuizActive(false)}
                  className="gradient-primary px-5 py-2 rounded-xl text-white text-xs font-semibold"
                >
                  Create New Quiz
                </button>
              </div>
            </GlassCard>
          )}
        </div>
      )}
    </div>
  );
}
