"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Key,
  Shield,
  Database,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Storage } from "@/lib/storage";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [serverConfig, setServerConfig] = useState<{
    isConfigured: boolean;
    maskedKey?: string | null;
    model?: string;
  }>({ isConfigured: false });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [testMessage, setTestMessage] = useState("");

  const loadServerConfig = async () => {
    try {
      const res = await fetch("/api/settings/api-key");
      if (res.ok) {
        const data = await res.json();
        setServerConfig(data);
      }
    } catch (e) {
      console.error("Failed to fetch server config:", e);
    }
  };

  useEffect(() => {
    loadServerConfig();
    // Also clean up obsolete localStorage keys if migrated
    const legacyKey = Storage.getCustomApiKey();
    if (legacyKey) {
      // Auto-migrate or clean client storage
      Storage.clearCustomApiKey();
    }
  }, []);

  const handleSaveApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError("");
    setSaveMessage("");

    const trimmed = apiKey.trim();
    if (!trimmed) {
      setSaveError("Please enter an API key.");
      return;
    }

    if (trimmed.length < 20) {
      setSaveError("API key is too short. Google AI Studio keys are typically 39 characters.");
      return;
    }

    if (/\s/.test(trimmed)) {
      setSaveError("API key must not contain any spaces.");
      return;
    }

    try {
      const res = await fetch("/api/settings/api-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: trimmed }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSavedSuccess(true);
        setSaveMessage(data.message || "Key saved securely to server configuration (.env.local)!");
        setApiKey("");
        await loadServerConfig();
        setTimeout(() => setSavedSuccess(false), 4000);
      } else {
        setSaveError(data.message || "Failed to save API key to server.");
      }
    } catch (err: any) {
      setSaveError("Network error: Could not reach the server settings endpoint.");
    }
  };

  const handleClearApiKey = async () => {
    if (!confirm("Are you sure you want to remove the Gemini API key from the server?")) return;
    try {
      const res = await fetch("/api/settings/api-key", { method: "DELETE" });
      if (res.ok) {
        Storage.clearCustomApiKey();
        setApiKey("");
        setSavedSuccess(true);
        setSaveMessage("API key removed from server configuration.");
        await loadServerConfig();
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (e) {
      console.error("Failed to delete key:", e);
    }
  };

  const handleResetData = () => {
    if (confirm("Reset all notes, quizzes, flashcards, and plans back to the default presentation demo data?")) {
      Storage.resetAllData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  const handleTestApiKey = async () => {
    setTestStatus("testing");
    setTestMessage("");

    try {
      const trimmed = apiKey.trim();
      const res = await fetch("/api/settings/test-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trimmed ? { apiKey: trimmed } : {}),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTestStatus("success");
        setTestMessage(
          `Connected successfully! Active model: ${data.model || "Gemini Flash"} (Response: "${data.replyPreview}")`
        );
      } else {
        setTestStatus("error");
        setTestMessage(data.message || "Failed to connect to Gemini API.");
      }
    } catch (err: any) {
      setTestStatus("error");
      setTestMessage("Network error: Could not connect to API verification endpoint.");
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-7 h-7 text-indigo-400" />
          <span>System Settings & API Configuration</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#A5B4CF] mt-1">
          Manage your AI model access, Google Gemini credentials, and local presentation storage.
        </p>
      </div>

      {/* Gemini AI Configuration */}
      <GlassCard className="p-6 space-y-5 border-indigo-500/30">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Google Gemini API Configuration</h2>
                {serverConfig.isConfigured ? (
                  <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Configured on Server</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    Demo Mode Active
                  </span>
                )}
              </div>
              <p className="text-xs text-[#A5B4CF] mt-0.5">
                Saved securely in <code className="text-indigo-300">.env.local</code> on the server (never exposed to client browser bundles).
              </p>
            </div>
          </div>

          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20 transition"
          >
            <span>Get Free Gemini Key</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Current Active Server Configuration Summary */}
        {serverConfig.isConfigured && (
          <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-white font-semibold">Active Server Key: </span>
                <span className="font-mono text-emerald-300">{serverConfig.maskedKey}</span>
              </div>
            </div>
            <div className="text-[11px] text-[#A5B4CF]">
              Active Model: <span className="text-indigo-300 font-mono">{serverConfig.model || "gemini-2.5-flash"}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSaveApiKey} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#A5B4CF] mb-1.5">
              {serverConfig.isConfigured ? "Update Server API Key" : "Enter Gemini API Key"}
            </label>
            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={serverConfig.isConfigured ? "Enter new key to update..." : "AIzaSy..."}
                className="w-full glass-input px-4 py-2.5 rounded-xl text-xs font-mono text-white"
              />
            </div>
            <p className="text-[11px] text-[#A5B4CF] mt-1.5">
              Your key is written to the ignored server file <code className="text-indigo-300">.env.local</code> and kept strictly server-side.
            </p>
          </div>

          {savedSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{saveMessage || "Settings updated successfully!"}</span>
            </div>
          )}

          {saveError && (
            <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-200 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{saveError}</span>
            </div>
          )}

          {testStatus === "success" && (
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{testMessage}</span>
            </div>
          )}

          {testStatus === "error" && (
            <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-200 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{testMessage}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              className="gradient-primary gradient-primary-hover px-5 py-2.5 rounded-xl text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-500/25 transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{serverConfig.isConfigured ? "Update Key" : "Save Key"}</span>
            </button>

            <button
              type="button"
              onClick={handleTestApiKey}
              disabled={testStatus === "testing"}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>{testStatus === "testing" ? "Testing Connection..." : "Test Connection"}</span>
            </button>

            {serverConfig.isConfigured && (
              <button
                type="button"
                onClick={handleClearApiKey}
                className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/20 transition flex items-center gap-1.5 ml-auto"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Key</span>
              </button>
            )}
          </div>
        </form>
      </GlassCard>

      {/* Cloud & Persistence Status */}
      <GlassCard className="p-6 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
          <Database className="w-5 h-5 text-purple-400" />
          <span>Storage & Cloud Infrastructure</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Browser Local Storage</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono">
                Active & Persistent
              </span>
            </div>
            <p className="text-[11px] text-[#A5B4CF] leading-relaxed">
              Notes, quiz results, flashcard ratings, and study plans are safely persisted on your device.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Supabase Cloud Sync</span>
              <span className="text-[10px] text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded font-mono">
                Optional
              </span>
            </div>
            <p className="text-[11px] text-[#A5B4CF] leading-relaxed">
              To enable multi-device sync, add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`.
            </p>
          </div>
        </div>

        {/* Reset Demo Data button */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-white block">Reset Presentation Demo Data</span>
            <span className="text-[11px] text-[#A5B4CF]">
              Re-populate with realistic sample notes, OOP quizzes, and biology flashcards.
            </span>
          </div>

          <button
            onClick={handleResetData}
            className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset Demo Data</span>
          </button>
        </div>

        {resetSuccess && (
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 text-xs font-medium">
            ✓ Demo data has been restored to presentation defaults!
          </div>
        )}
      </GlassCard>
    </div>
  );
}
