"use client";

import React, { useState } from "react";
import {
  FileSearch,
  Upload,
  FileText,
  Sparkles,
  HelpCircle,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Storage } from "@/lib/storage";

const SAMPLE_DOCUMENT_TEXT = `CHAPTER 7: CELLULAR RESPIRATION AND ENERGY METABOLISM

Cellular respiration is the metabolic process by which cells convert biochemical energy from nutrients (primarily glucose, C6H12O6) into adenosine triphosphate (ATP), and then release waste products like carbon dioxide and water.

The overall chemical equation is:
C6H12O6 + 6 O2 ----> 6 CO2 + 6 H2O + ~30-32 ATP molecules

There are three major stages of cellular respiration:
1. Glycolysis:
   - Takes place in the cytoplasm of the cell.
   - Anaerobic process (does not require oxygen).
   - Breaks 1 molecule of 6-carbon Glucose into 2 molecules of 3-carbon Pyruvate.
   - Net yield: 2 ATP (via substrate-level phosphorylation) and 2 NADH.

2. Krebs Cycle (Citric Acid Cycle):
   - Takes place in the mitochondrial matrix.
   - Pyruvate is converted to Acetyl-CoA before entering the cycle.
   - Generates high-energy electron carriers: NADH and FADH2, plus 2 ATP and releases CO2.

3. Oxidative Phosphorylation & Electron Transport Chain (ETC):
   - Located on the inner mitochondrial cristae membrane.
   - Electrons from NADH and FADH2 flow through protein complexes (Complex I-IV).
   - Protons (H+) are pumped across the inner membrane into the intermembrane space, creating a proton gradient.
   - ATP Synthase uses chemiosmosis to phosphorylate ADP into ATP (~26-28 ATP).
   - Oxygen is the terminal electron acceptor and combines with protons to form water.

Key Clinical & Exam Note: Cyanide is a deadly poison because it binds irreversibly to Complex IV (Cytochrome c oxidase) in the ETC, stopping ATP synthesis completely.`;

export default function DocumentStudyPage() {
  const [docText, setDocText] = useState(SAMPLE_DOCUMENT_TEXT);
  const [fileName, setFileName] = useState("Chapter7_Cellular_Respiration.txt (Sample)");
  const [activeAction, setActiveAction] = useState<"summarize" | "notes" | "quiz" | "qa">("summarize");
  const [userQuery, setUserQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resultText, setResultText] = useState("");
  const [quizResult, setQuizResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("File exceeds 5MB size limit. Please upload a smaller document.");
      return;
    }

    setFileName(file.name);
    setErrorMessage("");

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setDocText(text);
      }
    };
    reader.onerror = () => {
      setErrorMessage("Failed to read the file. Ensure it is a valid text or markdown document.");
    };

    reader.readAsText(file);
  };

  const handleProcessDocument = async (action = activeAction) => {
    if (!docText.trim() || docText.length < 20) {
      setErrorMessage("Please upload a document or paste study text first.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setResultText("");
    setQuizResult(null);

    try {
      const customKey = Storage.getCustomApiKey();
      const res = await fetch("/api/documents/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(customKey ? { "x-gemini-key": customKey } : {}),
        },
        body: JSON.stringify({
          text: docText,
          action,
          query: action === "qa" ? userQuery : undefined,
          language: "hinglish",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "GEMINI_API_KEY_MISSING") {
          setErrorMessage(
            "Google Gemini API key is required to analyze custom documents with live AI. Configure your key in Settings!"
          );
        } else {
          setErrorMessage(data.message || "Failed to process document.");
        }
        setLoading(false);
        return;
      }

      if (action === "quiz" && data.quiz) {
        setQuizResult(data.quiz);
      } else {
        setResultText(data.result || "No response received.");
      }
    } catch (err: any) {
      setErrorMessage("Network error: Could not reach the document AI engine.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!resultText) return;
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <FileSearch className="w-7 h-7 text-indigo-400" />
          <span>PDF & Document Study Tools</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#A5B4CF] mt-1">
          Upload textbook chapters, lecture notes, or syllabus docs to extract summaries, notes, or test questions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Document Upload & Input Area */}
        <div className="lg:col-span-5 space-y-4">
          <GlassCard className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-indigo-400" />
                <span>Upload Study Document</span>
              </h2>
              <span className="text-[10px] text-[#A5B4CF]">TXT / MD / DOC (up to 5MB)</span>
            </div>

            {/* File Upload Box */}
            <label className="border-2 border-dashed border-white/15 hover:border-indigo-500/50 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition bg-white/5 hover:bg-white/10 text-center">
              <Upload className="w-8 h-8 text-indigo-400 mb-2" />
              <span className="text-xs font-semibold text-white">Click to upload document</span>
              <span className="text-[11px] text-[#A5B4CF] mt-1">or paste textbook text below</span>
              <input
                type="file"
                accept=".txt,.md,.text"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Active Document Status */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate">
                <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-white truncate font-medium">{fileName}</span>
              </div>
              <span className="text-[10px] text-[#A5B4CF] shrink-0 font-mono">
                {docText.length} chars
              </span>
            </div>

            {/* Document Text Box */}
            <div>
              <label className="block text-xs font-semibold text-[#A5B4CF] mb-1">
                Extracted Document Content
              </label>
              <textarea
                rows={9}
                value={docText}
                onChange={(e) => setDocText(e.target.value)}
                placeholder="Paste or edit lecture notes here..."
                className="w-full glass-input p-3 rounded-xl text-xs font-mono text-gray-200"
              />
            </div>

            {/* Action Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#A5B4CF]">
                Choose AI Action
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "summarize", label: "Summarize", icon: Sparkles },
                  { id: "notes", label: "Generate Notes", icon: FileText },
                  { id: "quiz", label: "Create Quiz", icon: HelpCircle },
                  { id: "qa", label: "Ask Question", icon: MessageSquare },
                ].map((act) => {
                  const Icon = act.icon;
                  return (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => setActiveAction(act.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition ${
                        activeAction === act.id
                          ? "gradient-primary text-white border-transparent shadow-md shadow-indigo-500/20"
                          : "bg-white/5 border-white/10 text-[#A5B4CF] hover:text-white"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{act.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Q&A Query input if qa action active */}
            {activeAction === "qa" && (
              <div>
                <label className="block text-xs font-semibold text-[#A5B4CF] mb-1">
                  Ask a question about this document
                </label>
                <input
                  type="text"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="e.g. Why is cyanide lethal according to this text?"
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                />
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <p>{errorMessage}</p>
              </div>
            )}

            <button
              onClick={() => handleProcessDocument()}
              disabled={loading}
              className="w-full gradient-primary gradient-primary-hover py-3 rounded-xl text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>AI is processing document...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span className="capitalize">Run {activeAction} with Gemini AI</span>
                </>
              )}
            </button>
          </GlassCard>
        </div>

        {/* AI Output Results Area */}
        <div className="lg:col-span-7">
          <GlassCard className="p-6 min-h-[480px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Document Analysis Output</span>
                </h3>
                {resultText && (
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#A5B4CF] hover:text-white transition flex items-center gap-1"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                )}
              </div>

              {/* Display Result Text */}
              {resultText ? (
                <div className="text-xs sm:text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
                  {resultText}
                </div>
              ) : quizResult && quizResult.questions ? (
                /* Generated Quiz from Document */
                <div className="space-y-4">
                  <span className="text-xs font-semibold text-emerald-400">
                    Generated 5 Questions from your Document:
                  </span>
                  {quizResult.questions.map((q: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                      <p className="text-xs font-bold text-white">
                        {idx + 1}. {q.question}
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {q.options?.map((opt: string, oIdx: number) => (
                          <div
                            key={oIdx}
                            className={`p-2 rounded-lg border text-[11px] ${
                              oIdx === q.correctAnswerIndex
                                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-200 font-semibold"
                                : "bg-white/5 border-white/5 text-[#A5B4CF]"
                            }`}
                          >
                            {opt} {oIdx === q.correctAnswerIndex && "✓"}
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-indigo-300 italic">
                        Explanation: {q.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-24 text-center text-[#A5B4CF]">
                  <FileSearch className="w-12 h-12 mx-auto text-indigo-400/40 mb-3" />
                  <h4 className="text-sm font-semibold text-white">Awaiting Document Analysis</h4>
                  <p className="text-xs mt-1 max-w-sm mx-auto">
                    Select an action on the left and click &apos;Run with Gemini AI&apos; to extract summaries, study notes, or questions from this text.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 text-[11px] text-[#A5B4CF] flex items-center justify-between">
              <span>Context Size: Up to 12,000 characters per request</span>
              <span>Gemini 2.5 Flash</span>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
