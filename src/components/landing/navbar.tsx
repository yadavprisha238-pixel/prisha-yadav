"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Menu, X, ArrowRight, BookOpen } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#080B18]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight text-white group-hover:text-indigo-300 transition">
              AI Study <span className="gradient-text">Mate</span>
            </span>
            <span className="block text-[10px] text-[#A5B4CF] font-medium tracking-wide uppercase">
              Personal Learning Companion
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#A5B4CF]">
          <Link href="#features" className="hover:text-white transition">
            Features
          </Link>
          <Link href="#how-it-works" className="hover:text-white transition">
            How It Works
          </Link>
          <Link href="/about" className="hover:text-white transition">
            About Project
          </Link>
          <Link href="#faq" className="hover:text-white transition">
            FAQ
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-[#A5B4CF] hover:text-white transition px-3 py-2"
          >
            Demo Mode
          </Link>
          <Link
            href="/dashboard"
            className="gradient-primary gradient-primary-hover text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2 group"
          >
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-[#A5B4CF] hover:text-white hover:bg-white/5 transition"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile drop-down */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#080B18]/95 backdrop-blur-2xl px-6 py-6 space-y-4">
          <Link
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#A5B4CF] hover:text-white text-base py-1"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#A5B4CF] hover:text-white text-base py-1"
          >
            How It Works
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#A5B4CF] hover:text-white text-base py-1"
          >
            About Project
          </Link>
          <Link
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#A5B4CF] hover:text-white text-base py-1"
          >
            FAQ
          </Link>
          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl border border-white/10 text-white font-medium text-sm"
            >
              Enter Demo Mode
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl gradient-primary text-white font-medium text-sm shadow-lg shadow-indigo-500/25"
            >
              Open Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
