"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  Download,
  Share2,
  Bookmark,
  Trash2,
  RefreshCw,
  Edit3,
  Save,
  BookOpen,
  HelpCircle,
  AlertCircle,
  Lightbulb,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Storage } from "@/lib/storage";
import { NoteItem, Language, Difficulty, NoteLength } from "@/lib/types";

function NotesPageContent() {
  const searchParams = useSearchParams();

  // Form inputs
  const [subject, setSubject] = useState(searchParams.get("subject") || "Computer Science");
  const [topic, setTopic] = useState(
    searchParams.get("topic") || "Object-Oriented Programming (OOP)"
  );
  const [classLevel, setClassLevel] = useState("Undergraduate / B.Tech");
  const [language, setLanguage] = useState<Language>("hinglish");
  const [length, setLength] = useState<NoteLength>("medium");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  // State
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeNote, setActiveNote] = useState<NoteItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const noteId = searchParams.get("id");
    if (noteId) {
      const found = Storage.getNoteById(noteId);
      if (found) {
        setActiveNote(found);
        setSubject(found.subject);
        setTopic(found.title);
        setLanguage(found.language);
        setDifficulty(found.difficulty);
        return;
      }
    }

    // Default to the first note in storage or sample note
    const notes = Storage.getNotes();
    if (notes.length > 0) {
      setActiveNote(notes[0]);
    }
  }, [searchParams]);

  const handleGenerate = async () => {
    if (!subject.trim() || !topic.trim()) {
      setErrorMessage("Please enter both a Subject and Topic name.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const customKey = Storage.getCustomApiKey();
      const res = await fetch("/api/ai/generate-notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(customKey ? { "x-gemini-key": customKey } : {}),
        },
        body: JSON.stringify({
          subject,
          topic,
          classLevel,
          language,
          length,
          difficulty,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "GEMINI_API_KEY_MISSING") {
          setErrorMessage(
            "Gemini API key is not configured. Please add your key in Settings, or use our pre-built demo notes below for presentations!"
          );
        } else {
          setErrorMessage(data.message || "Failed to generate notes.");
        }
        setLoading(false);
        return;
      }

      if (data.note) {
        setActiveNote(data.note);
        Storage.saveNote(data.note);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err: any) {
      setErrorMessage("Network error: Could not reach the AI generation service.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEditedNote = () => {
    if (!activeNote) return;
    Storage.saveNote(activeNote);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCopyToClipboard = () => {
    if (!activeNote) return;
    const text = `# ${activeNote.title}\nSubject: ${activeNote.subject}\n\n## Introduction\n${activeNote.content.introduction}\n\n## Definitions\n${activeNote.content.definitions.map((d) => `- **${d.term}**: ${d.explanation}`).join("\n")}\n\n## Key Concepts\n${activeNote.content.keyConcepts.map((k) => `### ${k.heading}\n${k.points.map((p) => `- ${p}`).join("\n")}`).join("\n\n")}\n\n## Summary\n${activeNote.content.quickSummary}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportMarkdown = () => {
    if (!activeNote) return;
    const text = `# ${activeNote.title}\nSubject: ${activeNote.subject} | Difficulty: ${activeNote.difficulty}\n\n## Introduction\n${activeNote.content.introduction}\n\n## Definitions\n${activeNote.content.definitions.map((d) => `- **${d.term}**: ${d.explanation}`).join("\n")}\n\n## Key Points\n${activeNote.content.bulletPoints.map((b) => `- ${b}`).join("\n")}\n\n## Summary\n${activeNote.content.quickSummary}`;
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeNote.title.replace(/[^a-zA-Z0-9]/g, "_")}_Notes.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadSampleNote = (index: number) => {
    const notes = Storage.getNotes();
    if (notes[index]) {
      setActiveNote(notes[index]);
      setSubject(notes[index].subject);
      setTopic(notes[index].title);
      setErrorMessage("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <FileText className="w-7 h-7 text-indigo-400" />
          <span>AI Notes Generator</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#A5B4CF] mt-1">
          Generate structured, high-yield revision notes tailored for school, college, or competitive exams.
        </p>
      </div>

      {/* Main Grid: Form on Left, Output on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Configuration Card */}
        <div className="lg:col-span-4 space-y-4">
          <GlassCard className="p-5 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Notes Parameters</span>
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
                placeholder="e.g. Computer Science, Biology, Physics"
                className="w-full glass-input px-3 py-2 rounded-xl text-xs"
              />
            </div>

            {/* Topic */}
            <div>
              <label className="block text-xs font-semibold text-[#A5B4CF] mb-1">
                Topic or Chapter
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Object-Oriented Programming, Photosynthesis"
                className="w-full glass-input px-3 py-2 rounded-xl text-xs"
              />
            </div>

            {/* Education Level */}
            <div>
              <label className="block text-xs font-semibold text-[#A5B4CF] mb-1">
                Education Level
              </label>
              <select
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value)}
                className="w-full glass-input px-3 py-2 rounded-xl text-xs bg-[#10152B]"
              >
                <option value="Class 9 - 10 (Secondary)">Class 9 - 10 (Secondary)</option>
                <option value="Class 11 - 12 (Higher Secondary)">Class 11 - 12 (Higher Secondary)</option>
                <option value="Undergraduate / B.Tech / BCA">Undergraduate / B.Tech / BCA</option>
                <option value="Competitive Exam (JEE/NEET/GATE)">Competitive Exam (JEE/NEET/GATE)</option>
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="block text-xs font-semibold text-[#A5B4CF] mb-1">
                Explanation Language
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

            {/* Length & Difficulty */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#A5B4CF] mb-1">
                  Length
                </label>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value as NoteLength)}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs bg-[#10152B]"
                >
                  <option value="short">Short</option>
                  <option value="medium">Medium</option>
                  <option value="detailed">Detailed</option>
                </select>
              </div>

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
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <div>
                  <p>{errorMessage}</p>
                  <button
                    onClick={() => loadSampleNote(0)}
                    className="mt-2 inline-flex items-center gap-1 underline text-indigo-300 font-semibold"
                  >
                    Load Presentation Sample Note
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={loading}
                className="w-full gradient-primary gradient-primary-hover py-3 rounded-xl text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Gemini is generating notes...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Notes with AI</span>
                  </>
                )}
              </button>
            </div>
          </GlassCard>

          {/* Quick Preset Samples for Live Demo */}
          <GlassCard className="p-4">
            <h3 className="text-xs font-semibold text-white mb-2 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Demo Presets (Instant Load)</span>
            </h3>
            <div className="space-y-1.5">
              <button
                onClick={() => loadSampleNote(0)}
                className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#A5B4CF] hover:text-white transition flex items-center justify-between"
              >
                <span>OOP 4 Pillars (Computer Science)</span>
                <span className="text-[10px] text-indigo-400">Hinglish</span>
              </button>
              <button
                onClick={() => loadSampleNote(1)}
                className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#A5B4CF] hover:text-white transition flex items-center justify-between"
              >
                <span>Photosynthesis Cycle (Biology)</span>
                <span className="text-[10px] text-indigo-400">Hinglish</span>
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Notes Content Display on Right */}
        <div className="lg:col-span-8">
          {activeNote ? (
            <GlassCard className="p-6 relative">
              {/* Note Header & Actions Bar */}
              <div className="border-b border-white/10 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                      {activeNote.subject}
                    </span>
                    <span className="text-[11px] text-[#A5B4CF] capitalize">
                      • {activeNote.language} • {activeNote.difficulty}
                    </span>
                    {activeNote.isDemo && (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        Demo Data
                      </span>
                    )}
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={activeNote.title}
                      onChange={(e) =>
                        setActiveNote({ ...activeNote, title: e.target.value })
                      }
                      className="text-xl font-bold text-white glass-input px-2 py-1 rounded w-full"
                    />
                  ) : (
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      {activeNote.title}
                    </h2>
                  )}
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-2 shrink-0">
                  {isEditing ? (
                    <button
                      onClick={handleSaveEditedNote}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#A5B4CF] hover:text-white text-xs transition border border-white/10"
                      title="Edit Note"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={handleCopyToClipboard}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#A5B4CF] hover:text-white text-xs transition border border-white/10"
                    title="Copy Markdown"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={handleExportMarkdown}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#A5B4CF] hover:text-white text-xs transition border border-white/10"
                    title="Export .md"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-xs font-medium transition border border-indigo-500/30 hidden sm:inline-flex"
                  >
                    Export PDF
                  </button>
                </div>
              </div>

              {savedSuccess && (
                <div className="mb-4 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 text-xs text-center font-medium">
                  ✓ Notes successfully saved to your library!
                </div>
              )}

              {/* Note Content Sections */}
              <div className="space-y-6 text-sm text-[#F8FAFC]">
                {/* Introduction */}
                <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">
                    Introduction
                  </h3>
                  {isEditing ? (
                    <textarea
                      rows={3}
                      value={activeNote.content.introduction}
                      onChange={(e) =>
                        setActiveNote({
                          ...activeNote,
                          content: {
                            ...activeNote.content,
                            introduction: e.target.value,
                          },
                        })
                      }
                      className="w-full glass-input p-2 rounded text-xs text-white"
                    />
                  ) : (
                    <p className="leading-relaxed text-gray-200">
                      {activeNote.content.introduction}
                    </p>
                  )}
                </div>

                {/* Important Definitions */}
                {activeNote.content.definitions && activeNote.content.definitions.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Important Definitions</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeNote.content.definitions.map((def, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-white/5 border border-white/5"
                        >
                          <span className="font-bold text-indigo-300 text-xs block mb-1">
                            {def.term}
                          </span>
                          <p className="text-xs text-[#A5B4CF] leading-relaxed">
                            {def.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Concepts */}
                {activeNote.content.keyConcepts && activeNote.content.keyConcepts.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-3">
                      Key Concept Pillars
                    </h3>
                    <div className="space-y-3">
                      {activeNote.content.keyConcepts.map((concept, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2"
                        >
                          <h4 className="text-xs font-bold text-white">
                            {concept.heading}
                          </h4>
                          <ul className="list-disc pl-5 space-y-1 text-xs text-[#A5B4CF]">
                            {concept.points.map((pt, pIdx) => (
                              <li key={pIdx}>{pt}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Examples & Code */}
                {activeNote.content.examples && activeNote.content.examples.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                      Examples & Real-World Analogies
                    </h3>
                    <div className="space-y-2">
                      {activeNote.content.examples.map((ex, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-[#080B18]/60 border border-white/10 font-mono text-xs text-emerald-300 whitespace-pre-wrap"
                        >
                          {ex}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Formulas */}
                {activeNote.content.formulas && activeNote.content.formulas.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                      Formulas & Equations
                    </h3>
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-200 space-y-1">
                      {activeNote.content.formulas.map((f, idx) => (
                        <div key={idx}>• {f}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Exam Tips */}
                {activeNote.content.examTips && activeNote.content.examTips.length > 0 && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/30 to-indigo-950/30 border border-purple-500/20">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>Exam & Viva High-Scoring Tips</span>
                    </h3>
                    <ul className="list-disc pl-5 space-y-1.5 text-xs text-indigo-100">
                      {activeNote.content.examTips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Practice Questions */}
                {activeNote.content.practiceQuestions &&
                  activeNote.content.practiceQuestions.length > 0 && (
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Self-Test Practice Questions</span>
                      </h3>
                      <ol className="list-decimal pl-5 space-y-1 text-xs text-[#A5B4CF]">
                        {activeNote.content.practiceQuestions.map((q, idx) => (
                          <li key={idx}>{q}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                {/* Quick Revision Summary */}
                <div className="pt-4 border-t border-white/10 text-xs text-[#A5B4CF] italic">
                  <strong>Quick Revision Summary:</strong> {activeNote.content.quickSummary}
                </div>
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="p-12 text-center text-[#A5B4CF]">
              <FileText className="w-12 h-12 mx-auto text-indigo-400/50 mb-3" />
              <h3 className="text-base font-semibold text-white">No Notes Selected</h3>
              <p className="text-xs mt-1">
                Fill the parameters on the left and click &apos;Generate Notes with AI&apos; or load a demo preset.
              </p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NotesPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-[#A5B4CF]">
          Loading Notes Generator...
        </div>
      }
    >
      <NotesPageContent />
    </Suspense>
  );
}

