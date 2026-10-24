"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Info, Key, CheckCircle, ShieldCheck } from "lucide-react";
import { Storage } from "@/lib/storage";

export function ApiStatusBanner() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [model, setModel] = useState("gemini-2.5-flash");
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch("/api/settings/api-key")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.isConfigured) {
          setIsConfigured(true);
          if (data.model) setModel(data.model);
        }
      })
      .catch(() => {
        // Fallback to client storage check
        setIsConfigured(Boolean(Storage.getCustomApiKey()));
      });
  }, []);

  if (dismissed) return null;

  return (
    <div className="mb-6 rounded-xl border border-indigo-500/20 bg-indigo-950/30 backdrop-blur-md px-4 py-3 text-sm text-[#A5B4CF] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
          {isConfigured ? (
            <Sparkles className="w-4 h-4 text-emerald-400" />
          ) : (
            <Info className="w-4 h-4 text-indigo-300" />
          )}
        </div>
        <div>
          <span className="font-semibold text-white">
            {isConfigured ? "Live AI Active" : "Demo Mode Active"}
          </span>
          <span className="ml-2 text-xs text-[#A5B4CF]">
            {isConfigured
              ? `Connected to Google Gemini (${model}) on server. Live study generation ready.`
              : "Pre-loaded with sample notes, quizzes, and flashcards. Add your Gemini API key in Settings for live AI generation."}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs shrink-0">
        <Link
          href="/dashboard/settings"
          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white transition flex items-center gap-1.5 border border-white/10"
        >
          <Key className="w-3.5 h-3.5 text-indigo-400" />
          <span>{isConfigured ? "API Settings" : "Configure Key"}</span>
        </Link>
        <button
          onClick={() => setDismissed(true)}
          className="text-[#A5B4CF] hover:text-white px-2 py-1 text-xs"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
