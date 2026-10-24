import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Study Mate | Modern AI Personal Study Assistant",
  description:
    "Your personal AI study companion that turns complex topics into simple Hinglish explanations, smart notes, interactive quizzes, and flashcards.",
  keywords: [
    "AI Study Assistant",
    "Hinglish AI Tutor",
    "Notes Generator",
    "Quiz Generator",
    "Flashcards",
    "Next.js AI",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#080B18] text-[#F8FAFC] antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        {/* Soft background ambient gradient orbs */}
        <div className="ambient-glow-top" aria-hidden="true" />
        <div className="ambient-glow-bottom" aria-hidden="true" />

        <div className="relative z-10 min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
