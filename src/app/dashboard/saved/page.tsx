"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bookmark,
  Search,
  FileText,
  Trash2,
  ExternalLink,
  Download,
  Calendar,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Storage } from "@/lib/storage";
import { NoteItem } from "@/lib/types";

export default function SavedNotesPage() {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");

  useEffect(() => {
    setNotes(Storage.getNotes());
  }, []);

  const subjects = ["all", ...Array.from(new Set(notes.map((n) => n.subject)))];

  const filtered = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.introduction.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === "all" || n.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = Storage.deleteNote(id);
    setNotes(updated);
  };

  const handleDownload = (note: NoteItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const text = `# ${note.title}\nSubject: ${note.subject}\n\n## Introduction\n${note.content.introduction}\n\n## Definitions\n${note.content.definitions.map((d) => `- **${d.term}**: ${d.explanation}`).join("\n")}\n\n## Summary\n${note.content.quickSummary}`;
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${note.title.replace(/[^a-zA-Z0-9]/g, "_")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Bookmark className="w-7 h-7 text-indigo-400" />
            <span>Saved Notes Library</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#A5B4CF] mt-1">
            Access, search, review, and export all your saved AI study guides and revision notes.
          </p>
        </div>

        <Link
          href="/dashboard/notes"
          className="gradient-primary gradient-primary-hover px-4 py-2 rounded-xl text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-indigo-500/25 transition self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Create New Note</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <GlassCard className="p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-indigo-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes by title, topic, or keyword..."
            className="w-full glass-input pl-10 pr-4 py-2 rounded-xl text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {subjects.map((subj) => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition border ${
                selectedSubject === subj
                  ? "gradient-primary text-white border-transparent"
                  : "bg-white/5 border-white/10 text-[#A5B4CF] hover:text-white"
              }`}
            >
              {subj === "all" ? "All Subjects" : subj}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Notes Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((note) => (
            <GlassCard
              key={note.id}
              hoverEffect
              className="p-5 flex flex-col justify-between group relative border-white/10 hover:border-indigo-500/30"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                    {note.subject}
                  </span>
                  {note.isDemo && (
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Demo
                    </span>
                  )}
                </div>

                <Link href={`/dashboard/notes?id=${note.id}`}>
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition line-clamp-1 mb-2">
                    {note.title}
                  </h3>
                </Link>

                <p className="text-xs text-[#A5B4CF] line-clamp-3 leading-relaxed">
                  {note.content.introduction}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#A5B4CF]">
                <span className="text-[10px] flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-indigo-400" />
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleDownload(note, e)}
                    className="p-1.5 rounded hover:bg-white/10 text-[#A5B4CF] hover:text-white transition"
                    title="Download Markdown"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(note.id, e)}
                    className="p-1.5 rounded hover:bg-rose-500/20 text-[#A5B4CF] hover:text-rose-400 transition"
                    title="Delete Note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <Link
                    href={`/dashboard/notes?id=${note.id}`}
                    className="p-1.5 rounded hover:bg-white/10 text-indigo-400 hover:text-indigo-300 transition ml-1"
                    title="Open Note"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <GlassCard className="p-12 text-center text-[#A5B4CF]">
          <BookOpen className="w-12 h-12 mx-auto text-indigo-400/40 mb-3" />
          <h3 className="text-base font-semibold text-white">No Notes Found</h3>
          <p className="text-xs mt-1">Try another search or subject filter.</p>
        </GlassCard>
      )}
    </div>
  );
}
