# 🚀 AI Study Mate
### Modern AI-Powered Personal Study Assistant
*A presentation-ready, full-stack Next.js web application built with Google Gemini, Tailwind CSS, TypeScript, and Glassmorphism design.*

---

## 🌟 Overview

**AI Study Mate** is an intelligent personal study companion designed to turn complex academic subjects into intuitive **Hinglish explanations**, structured **high-yield revision notes**, interactive **adaptive quizzes**, and **smart flashcards**. 

Whether preparing for high school boards, engineering semesters (B.Tech/BCA), medical exams, or competitive tests (JEE/NEET/GATE/UPSC), AI Study Mate helps students **Study Smarter, Learn Faster, and Achieve More**.

---

## ✨ Key Features

1. **🧑‍🏫 Hinglish AI Tutor**
   - Explains difficult concepts using relatable Indian daily-life analogies (like making chai, cricket, or city traffic).
   - Instant **"Samajh nahi aaya"** simplification mode that breaks ideas down for intuitive understanding without academic jargon.
   - Supports Hinglish, Hindi (Devanagari), and English.

2. **📝 AI Notes Generator**
   - Automatically generates structured study guides with Introduction, Definitions, Key Pillars, Formulas, Exam Tips, Bullet Points, and Practice Questions.
   - Inline editing, local persistence, copy-to-clipboard, and Markdown/PDF export.

3. **🎯 Interactive AI Quiz Generator**
   - Tests student mastery with one-question-at-a-time MCQ examination.
   - **100% Client-Side Score Calculation** with immediate feedback and celebratory confetti.
   - Detailed step-by-step explanations for every option.

4. **🎴 Smart Revision Flashcards**
   - Realistic 3D flip card animation for question/answer sides.
   - Spaced-repetition scheduling: mark cards as **Easy**, **Medium**, or **Hard**.
   - Auto-generate complete decks using Gemini AI or add custom cards.

5. **📄 PDF & Document Study Tools**
   - Upload text or lecture notes (TXT, MD) to extract executive summaries, structured notes, and customized test questions.
   - Interactive Q&A to ask direct questions about your document context.

6. **📅 AI Study Planner**
   - Generates daily and weekly revision sprints based on your exam date and daily available study hours.
   - Live checkbox milestone tracking and priority badges.

7. **📊 Progress Analytics**
   - Real-time visualization of quizzes completed, average score %, weekly study activity charts, and weak topic alerts.

8. **🛡️ Zero-Config Presentation Demo Mode**
   - Preloaded with curriculum notes, quizzes, and flashcards.
   - The application runs **100% out-of-the-box** without requiring an account or API key, making it ideal for classroom presentations.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Custom Glassmorphism tokens & deep navy palette)
- **Icons:** Lucide React
- **AI Engine:** Google Gemini API (`@google/generative-ai` - Gemini 3.8 Flash / Multi-Model Fallback)
- **Validation:** Zod (Request and Response schema verification)
- **Celebration:** Canvas-Confetti
- **Storage:** Unified LocalStorage layer with seamless optional Supabase cloud integration

---

## 📂 Project Structure

```
AI Study-Mate/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai/
│   │   │   │   ├── chat/route.ts              # Hinglish Tutor endpoint
│   │   │   │   ├── generate-notes/route.ts    # Notes generation endpoint
│   │   │   │   ├── generate-quiz/route.ts     # Quiz generation endpoint
│   │   │   │   ├── generate-flashcards/route.ts
│   │   │   │   ├── create-study-plan/route.ts
│   │   │   │   ├── summarize/route.ts
│   │   │   │   └── explain/route.ts
│   │   │   └── documents/
│   │   │       └── process/route.ts           # Document analysis & Q&A
│   │   ├── dashboard/
│   │   │   ├── notes/page.tsx                 # Notes Generator UI
│   │   │   ├── quiz/page.tsx                  # Interactive Quiz UI
│   │   │   ├── tutor/page.tsx                 # Glass Tutor Chat UI
│   │   │   ├── flashcards/page.tsx            # 3D Flip Flashcards UI
│   │   │   ├── documents/page.tsx             # Document Study Tools
│   │   │   ├── planner/page.tsx               # AI Study Planner
│   │   │   ├── analytics/page.tsx             # Performance Charts
│   │   │   ├── saved/page.tsx                 # Saved Notes Library
│   │   │   ├── settings/page.tsx              # Gemini API Key & Reset
│   │   │   ├── layout.tsx                     # Sidebar & Topbar Shell
│   │   │   └── page.tsx                       # Main Dashboard
│   │   ├── about/page.tsx                     # Project Academic Dossier
│   │   ├── auth/page.tsx                      # Login / Demo Fast-Track
│   │   ├── globals.css                        # Glassmorphism & Gradients
│   │   ├── layout.tsx                         # Root HTML Layout
│   │   └── page.tsx                           # Landing Page
│   ├── components/
│   │   ├── landing/                           # Hero, Features, How It Works, FAQ
│   │   ├── dashboard/                         # Sidebar, Topbar
│   │   └── ui/                                # GlassCard, StatusBanner
│   └── lib/
│       ├── gemini.ts                          # Server-side Gemini client
│       ├── storage.ts                         # Unified local persistence
│       ├── supabase.ts                        # Optional Supabase client
│       ├── types.ts                           # TypeScript models
│       ├── sample-data.ts                     # Pre-loaded Demo content
│       └── validation.ts                      # Zod schemas
├── .env.example
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## ⚡ Quick Start Guide (Beginner Friendly)

### 1. Prerequisites
Make sure you have **Node.js 18+** installed on your system.

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Your Gemini API Key (Optional for Demo Mode)
Copy the example environment configuration:
```bash
cp .env.example .env.local
```
Open `.env.local` and add your free Google Gemini API key:
```env
GEMINI_API_KEY=AIzaSyYourActualKeyHere
```
> **Tip:** You can obtain a free API key in 30 seconds from [Google AI Studio](https://aistudio.google.com/app/apikey).  
> *Alternatively, you can launch the app in Demo Mode and paste your key directly into the in-app Settings page without editing files!*

### 4. Run the Development Server
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🎤 3–5 Minute Presentation Walkthrough Script

When presenting this project to teachers or evaluators:

1. **Introduction (1 min):**
   - Start on the **Landing Page (`/`)**. Show the blue-purple gradient and glassmorphism interface.
   - Explain the core problem: *"Traditional textbooks and generic chatbots use formal jargon. AI Study Mate translates heavy topics into relatable Hinglish with everyday analogies."*

2. **The Dashboard & Demo Mode (1 min):**
   - Click **"Get Started"** or **"Demo Mode"** to navigate to `/dashboard`.
   - Point out the real-time statistics (Notes Created, Quizzes Completed, Average Score %, Study Streak) and Today's Study Goals.

3. **Live Feature Demo (2 mins):**
   - **Hinglish AI Tutor (`/dashboard/tutor`):** Click the suggested prompt *"Chai banane se Newton's Third Law samjhao!"*. Click *"Samajh nahi aaya"* to show how the AI automatically simplifies without frustration.
   - **AI Quiz Generator (`/dashboard/quiz`):** Launch the quiz, select an answer, and click Submit to show the mathematically verified score and celebration confetti.
   - **Flashcards (`/dashboard/flashcards`):** Click the card to flip between Question and Answer in 3D, and mark difficulty.

4. **Architecture & Future Scope (30 secs):**
   - Navigate to `/about` to show the full technical dossier detailing Next.js App Router, Zod validation, and Google Gemini integration.

---

## 🔒 Security & Best Practices

- **Server-Side API Keys:** Gemini credentials are processed strictly in Next.js Server Route Handlers and never leaked in client bundles.
- **Defensive Error Handling:** If an API key is missing or invalid, the app presents user-friendly diagnostics and falls back to presentation data without crashing.
- **Client-Side Score Computation:** Quiz results are computed strictly in code for mathematical reliability.

---

## 📄 License
This project is open-source under the MIT License. Built for students and educators worldwide.
