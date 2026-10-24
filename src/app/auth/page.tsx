"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  User,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export default function AuthPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage("");

    if (isSupabaseConfigured && supabase) {
      try {
        if (isSignUp) {
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName } },
          });
          if (error) throw error;
          setStatusMessage("Account created! Check your email to verify.");
        } else {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
          router.push("/dashboard");
        }
      } catch (err: any) {
        setStatusMessage(err.message || "Authentication error.");
      } finally {
        setLoading(false);
      }
    } else {
      // Demo Mode Fallback
      setTimeout(() => {
        setLoading(false);
        router.push("/dashboard");
      }, 500);
    }
  };

  const handleDemoAccess = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-bold text-2xl text-white">
              AI Study <span className="gradient-text">Mate</span>
            </span>
          </Link>
          <p className="text-xs text-[#A5B4CF]">
            {isSignUp ? "Create your personal AI study space" : "Welcome back to your learning dashboard"}
          </p>
        </div>

        {/* Card */}
        <GlassCard className="p-8 border-indigo-500/30 shadow-2xl space-y-6">
          <div className="flex border-b border-white/10 pb-3 justify-around text-xs font-semibold">
            <button
              onClick={() => setIsSignUp(false)}
              className={`pb-2 border-b-2 transition ${
                !isSignUp
                  ? "border-indigo-400 text-white"
                  : "border-transparent text-[#A5B4CF] hover:text-white"
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`pb-2 border-b-2 transition ${
                isSignUp
                  ? "border-indigo-400 text-white"
                  : "border-transparent text-[#A5B4CF] hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-[#A5B4CF] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-indigo-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Student Name"
                    className="w-full glass-input pl-9 pr-3 py-2 rounded-xl text-xs"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#A5B4CF] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-indigo-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu"
                  className="w-full glass-input pl-9 pr-3 py-2 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A5B4CF] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-indigo-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full glass-input pl-9 pr-3 py-2 rounded-xl text-xs"
                />
              </div>
            </div>

            {statusMessage && (
              <p className="text-xs text-indigo-300 bg-indigo-500/10 p-2 rounded-lg border border-indigo-500/20">
                {statusMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-primary gradient-primary-hover py-3 rounded-xl text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition"
            >
              <span>{isSignUp ? "Create Free Account" : "Sign In"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Access Button */}
          <div className="pt-2 border-t border-white/10 space-y-2 text-center">
            <span className="text-[11px] text-[#A5B4CF] block">Presentation Mode Fast-Track</span>
            <button
              type="button"
              onClick={handleDemoAccess}
              className="w-full py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold transition flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Launch Demo Mode (No Signup Required)</span>
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
