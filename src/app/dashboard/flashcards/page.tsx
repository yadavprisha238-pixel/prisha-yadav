"use client";

import React, { useState, useEffect } from "react";
import {
  Layers,
  Sparkles,
  RotateCw,
  Plus,
  Trash2,
  CheckCircle2,
  Filter,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Storage } from "@/lib/storage";
import { Flashcard, Difficulty } from "@/lib/types";

export default function FlashcardsPage() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // AI Generator Modal
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [genSubject, setGenSubject] = useState("Computer Science");
  const [genTopic, setGenTopic] = useState("Data Structures & Algorithms");
  const [genCount, setGenCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [genError, setGenError] = useState("");

  // Add Custom Card Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [customSubject, setCustomSubject] = useState("Physics");
  const [customQuestion, setCustomQuestion] = useState("");
  const [customAnswer, setCustomAnswer] = useState("");
  const [customDifficulty, setCustomDifficulty] = useState<Difficulty>("medium");

  useEffect(() => {
    setCards(Storage.getFlashcards());
  }, []);

  const subjects = ["all", ...Array.from(new Set(cards.map((c) => c.subject)))];

  const filteredCards =
    selectedSubject === "all"
      ? cards
      : cards.filter((c) => c.subject === selectedSubject);

  const currentCard = filteredCards[activeCardIndex] || null;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setActiveCardIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setActiveCardIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleMarkDifficulty = (id: string, difficulty: Flashcard["difficulty"]) => {
    const status: Flashcard["status"] =
      difficulty === "easy" ? "mastered" : difficulty === "medium" ? "learning" : "new";
    const updated = Storage.updateFlashcardStatus(id, status);
    setCards(updated);
    handleNext();
  };

  const handleDeleteCard = (id: string) => {
    const updated = Storage.deleteFlashcard(id);
    setCards(updated);
    if (activeCardIndex >= updated.length) {
      setActiveCardIndex(Math.max(0, updated.length - 1));
    }
    setIsFlipped(false);
  };

  const handleGenerateCards = async () => {
    if (!genSubject.trim() || !genTopic.trim()) return;
    setLoading(true);
    setGenError("");

    try {
      const customKey = Storage.getCustomApiKey();
      const res = await fetch("/api/ai/generate-flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(customKey ? { "x-gemini-key": customKey } : {}),
        },
        body: JSON.stringify({
          subject: genSubject,
          topic: genTopic,
          numCards: Number(genCount),
          language: "hinglish",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setGenError(data.message || "Failed to generate cards. Check Gemini API key in Settings.");
        setLoading(false);
        return;
      }

      if (data.flashcards && data.flashcards.length > 0) {
        const updated = Storage.saveMultipleFlashcards(data.flashcards);
        setCards(updated);
        setShowGenerateModal(false);
        setSelectedSubject("all");
        setActiveCardIndex(0);
        setIsFlipped(false);
      }
    } catch (err: any) {
      setGenError("Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim() || !customAnswer.trim()) return;

    const newCard: Flashcard = {
      id: "fc-" + Date.now(),
      subject: customSubject,
      topic: "Custom Card",
      question: customQuestion,
      answer: customAnswer,
      difficulty: customDifficulty,
      status: "new",
      isDemo: false,
    };

    const updated = Storage.saveFlashcard(newCard);
    setCards(updated);
    setShowAddModal(false);
    setCustomQuestion("");
    setCustomAnswer("");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-7 h-7 text-emerald-400" />
            <span>Smart Revision Flashcards</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#A5B4CF] mt-1">
            Active recall and spaced-repetition cards with interactive 3D flip animation.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Add Card</span>
          </button>
          <button
            onClick={() => setShowGenerateModal(true)}
            className="gradient-primary gradient-primary-hover px-4 py-2 rounded-xl text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-500/25 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Generator</span>
          </button>
        </div>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <Filter className="w-3.5 h-3.5 text-[#A5B4CF] shrink-0" />
        {subjects.map((subj) => (
          <button
            key={subj}
            onClick={() => {
              setSelectedSubject(subj);
              setActiveCardIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1 rounded-full capitalize whitespace-nowrap transition border ${
              selectedSubject === subj
                ? "gradient-primary text-white border-transparent shadow-md shadow-indigo-500/20 font-semibold"
                : "bg-white/5 border-white/10 text-[#A5B4CF] hover:text-white"
            }`}
          >
            {subj === "all" ? "All Subjects" : subj}
          </button>
        ))}
      </div>

      {/* Flashcard Presentation Area */}
      {filteredCards.length > 0 && currentCard ? (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Card Meta Bar */}
          <div className="flex items-center justify-between text-xs text-[#A5B4CF]">
            <span>
              Card {activeCardIndex + 1} of {filteredCards.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="capitalize px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px]">
                {currentCard.subject}
              </span>
              {currentCard.isDemo && (
                <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded font-mono">
                  Demo
                </span>
              )}
              <button
                onClick={() => handleDeleteCard(currentCard.id)}
                className="text-rose-400 hover:text-rose-300 p-1"
                title="Delete this card"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3D Flip Card */}
          <div
            onClick={handleFlip}
            className="w-full h-80 sm:h-96 cursor-pointer select-none perspective-1000"
          >
            <div
              className={`relative w-full h-full rounded-3xl transition-transform duration-500 shadow-2xl ${
                isFlipped ? "rotate-y-180" : ""
              }`}
              style={{
                transformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* FRONT (QUESTION) */}
              <div
                className="absolute inset-0 w-full h-full rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-[#10152B]/95 to-[#161D3A]/95 backdrop-blur-2xl p-8 flex flex-col justify-between text-center"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                    Question
                  </span>
                  <span className="text-[#A5B4CF] flex items-center gap-1 text-[11px]">
                    <RotateCw className="w-3 h-3 text-indigo-400" />
                    Click to flip
                  </span>
                </div>

                <div className="my-auto px-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                    {currentCard.question}
                  </h3>
                </div>

                <div className="text-[11px] text-[#A5B4CF]">
                  Tap anywhere on the card to reveal answer
                </div>
              </div>

              {/* BACK (ANSWER) */}
              <div
                className="absolute inset-0 w-full h-full rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-[#10152B]/95 to-[#12242F]/95 backdrop-blur-2xl p-8 flex flex-col justify-between text-center"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    Answer
                  </span>
                  <span className="text-[#A5B4CF] flex items-center gap-1 text-[11px]">
                    <RotateCw className="w-3 h-3 text-emerald-400" />
                    Click to flip back
                  </span>
                </div>

                <div className="my-auto px-4">
                  <p className="text-base sm:text-lg font-medium text-white leading-relaxed">
                    {currentCard.answer}
                  </p>
                </div>

                {/* Spaced Repetition Buttons */}
                <div
                  className="flex items-center justify-center gap-2 pt-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => handleMarkDifficulty(currentCard.id, "easy")}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition"
                  >
                    Easy (Mastered)
                  </button>
                  <button
                    onClick={() => handleMarkDifficulty(currentCard.id, "medium")}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/30 transition"
                  >
                    Medium (Review Soon)
                  </button>
                  <button
                    onClick={() => handleMarkDifficulty(currentCard.id, "hard")}
                    className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold border border-rose-500/30 transition"
                  >
                    Hard (Repeat)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-1.5 transition border border-white/10"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleFlip}
              className="px-4 py-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Flip Card</span>
            </button>

            <button
              onClick={handleNext}
              className="px-4 py-2 rounded-xl gradient-primary gradient-primary-hover text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <GlassCard className="p-12 text-center text-[#A5B4CF]">
          <Layers className="w-12 h-12 mx-auto text-emerald-400/50 mb-3" />
          <h3 className="text-base font-semibold text-white">No Flashcards Available</h3>
          <p className="text-xs mt-1">
            Click &apos;AI Generator&apos; to create cards or add custom questions above.
          </p>
        </GlassCard>
      )}

      {/* AI Generator Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#10152B] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Generate Flashcards with AI</span>
              </h3>
              <button
                onClick={() => setShowGenerateModal(false)}
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
                value={genSubject}
                onChange={(e) => setGenSubject(e.target.value)}
                className="w-full glass-input px-3 py-2 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A5B4CF] mb-1">
                Topic
              </label>
              <input
                type="text"
                value={genTopic}
                onChange={(e) => setGenTopic(e.target.value)}
                className="w-full glass-input px-3 py-2 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A5B4CF] mb-1">
                Number of Cards
              </label>
              <select
                value={genCount}
                onChange={(e) => setGenCount(Number(e.target.value))}
                className="w-full glass-input px-3 py-2 rounded-xl text-xs bg-[#10152B]"
              >
                <option value={4}>4 Cards</option>
                <option value={6}>6 Cards</option>
                <option value={8}>8 Cards</option>
              </select>
            </div>

            {genError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs">
                {genError}
              </div>
            )}

            <button
              onClick={handleGenerateCards}
              disabled={loading}
              className="w-full gradient-primary gradient-primary-hover py-2.5 rounded-xl text-white text-xs font-bold transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating Deck...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Flashcard Deck</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Add Custom Card Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <form
            onSubmit={handleAddCustomCard}
            className="w-full max-w-md rounded-2xl border border-white/15 bg-[#10152B] p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Add Custom Flashcard</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
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
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                className="w-full glass-input px-3 py-2 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A5B4CF] mb-1">
                Question (Front)
              </label>
              <textarea
                rows={2}
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="e.g. What is the unit of electric capacitance?"
                className="w-full glass-input px-3 py-2 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A5B4CF] mb-1">
                Answer (Back)
              </label>
              <textarea
                rows={3}
                value={customAnswer}
                onChange={(e) => setCustomAnswer(e.target.value)}
                placeholder="e.g. Farad (F), named after Michael Faraday."
                className="w-full glass-input px-3 py-2 rounded-xl text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full gradient-primary gradient-primary-hover py-2.5 rounded-xl text-white text-xs font-bold transition"
            >
              Save Card
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
