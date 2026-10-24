import {
  NoteItem,
  QuizAttempt,
  Flashcard,
  StudyPlan,
  StudyTask,
  UserStats,
  ChatMessage,
} from "./types";
import {
  SAMPLE_NOTES,
  SAMPLE_FLASHCARDS,
  SAMPLE_STUDY_PLAN,
  SAMPLE_USER_STATS,
  SAMPLE_QUIZ_QUESTIONS,
} from "./sample-data";

const STORAGE_KEYS = {
  NOTES: "ai_study_mate_notes",
  QUIZZES: "ai_study_mate_quizzes",
  FLASHCARDS: "ai_study_mate_flashcards",
  PLAN: "ai_study_mate_study_plan",
  STATS: "ai_study_mate_stats",
  CHAT: "ai_study_mate_chat_history",
  CUSTOM_API_KEY: "ai_study_mate_custom_gemini_key",
  DEMO_MODE: "ai_study_mate_demo_mode",
};

// Safe localStorage helper
function getStoredItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
    return defaultValue;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage:`, e);
  }
}

export const Storage = {
  // NOTES
  getNotes(): NoteItem[] {
    const notes = getStoredItem<NoteItem[]>(STORAGE_KEYS.NOTES, []);
    if (notes.length === 0) {
      this.seedInitialData();
      return getStoredItem<NoteItem[]>(STORAGE_KEYS.NOTES, SAMPLE_NOTES);
    }
    return notes;
  },

  getNoteById(id: string): NoteItem | undefined {
    const notes = this.getNotes();
    return notes.find((n) => n.id === id);
  },

  saveNote(note: NoteItem): NoteItem[] {
    const notes = this.getNotes();
    const existingIndex = notes.findIndex((n) => n.id === note.id);
    let updated: NoteItem[];
    if (existingIndex >= 0) {
      updated = [...notes];
      updated[existingIndex] = { ...note, updatedAt: new Date().toISOString() };
    } else {
      updated = [note, ...notes];
      // update stats
      this.incrementStat("totalNotes");
    }
    setStoredItem(STORAGE_KEYS.NOTES, updated);
    return updated;
  },

  deleteNote(id: string): NoteItem[] {
    const notes = this.getNotes();
    const updated = notes.filter((n) => n.id !== id);
    setStoredItem(STORAGE_KEYS.NOTES, updated);
    return updated;
  },

  // QUIZZES
  getQuizzes(): QuizAttempt[] {
    const quizzes = getStoredItem<QuizAttempt[]>(STORAGE_KEYS.QUIZZES, []);
    if (quizzes.length === 0) {
      // Seed a sample completed quiz
      const sampleAttempt: QuizAttempt = {
        id: "sample-attempt-1",
        title: "OOP & Computer Science Basics",
        subject: "Computer Science",
        difficulty: "medium",
        language: "hinglish",
        totalQuestions: 5,
        userAnswers: { 0: 1, 1: 1, 2: 2, 3: 1, 4: 1 },
        score: 4,
        percentage: 80,
        completedAt: new Date(Date.now() - 86400000).toISOString(),
        questions: SAMPLE_QUIZ_QUESTIONS,
        isDemo: true,
      };
      setStoredItem(STORAGE_KEYS.QUIZZES, [sampleAttempt]);
      return [sampleAttempt];
    }
    return quizzes;
  },

  saveQuizAttempt(attempt: QuizAttempt): QuizAttempt[] {
    const quizzes = this.getQuizzes();
    const updated = [attempt, ...quizzes];
    setStoredItem(STORAGE_KEYS.QUIZZES, updated);

    // Update global statistics
    const stats = this.getStats();
    const newTotalQuizzes = stats.quizzesCompleted + 1;
    const allPercentages = updated.map((q) => q.percentage);
    const newAvg = Math.round(
      allPercentages.reduce((a, b) => a + b, 0) / allPercentages.length
    );

    this.updateStats({
      quizzesCompleted: newTotalQuizzes,
      averageScore: newAvg,
    });

    return updated;
  },

  // FLASHCARDS
  getFlashcards(): Flashcard[] {
    const cards = getStoredItem<Flashcard[]>(STORAGE_KEYS.FLASHCARDS, []);
    if (cards.length === 0) {
      this.seedInitialData();
      return getStoredItem<Flashcard[]>(STORAGE_KEYS.FLASHCARDS, SAMPLE_FLASHCARDS);
    }
    return cards;
  },

  saveFlashcard(card: Flashcard): Flashcard[] {
    const cards = this.getFlashcards();
    const index = cards.findIndex((c) => c.id === card.id);
    let updated: Flashcard[];
    if (index >= 0) {
      updated = [...cards];
      updated[index] = card;
    } else {
      updated = [card, ...cards];
    }
    setStoredItem(STORAGE_KEYS.FLASHCARDS, updated);
    return updated;
  },

  saveMultipleFlashcards(newCards: Flashcard[]): Flashcard[] {
    const cards = this.getFlashcards();
    const updated = [...newCards, ...cards];
    setStoredItem(STORAGE_KEYS.FLASHCARDS, updated);
    return updated;
  },

  updateFlashcardStatus(id: string, status: Flashcard["status"]): Flashcard[] {
    const cards = this.getFlashcards();
    const updated = cards.map((c) =>
      c.id === id ? { ...c, status, lastReviewed: new Date().toISOString() } : c
    );
    setStoredItem(STORAGE_KEYS.FLASHCARDS, updated);
    return updated;
  },

  deleteFlashcard(id: string): Flashcard[] {
    const cards = this.getFlashcards();
    const updated = cards.filter((c) => c.id !== id);
    setStoredItem(STORAGE_KEYS.FLASHCARDS, updated);
    return updated;
  },

  // STUDY PLAN
  getStudyPlan(): StudyPlan {
    const plan = getStoredItem<StudyPlan>(STORAGE_KEYS.PLAN, SAMPLE_STUDY_PLAN);
    return plan;
  },

  saveStudyPlan(plan: StudyPlan): void {
    setStoredItem(STORAGE_KEYS.PLAN, plan);
  },

  toggleTaskCompleted(taskId: string): StudyPlan {
    const plan = this.getStudyPlan();
    const updatedTasks = plan.tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    const updatedPlan = { ...plan, tasks: updatedTasks };
    this.saveStudyPlan(updatedPlan);
    return updatedPlan;
  },

  addPlanTask(task: StudyTask): StudyPlan {
    const plan = this.getStudyPlan();
    const updatedPlan = {
      ...plan,
      tasks: [task, ...plan.tasks],
    };
    this.saveStudyPlan(updatedPlan);
    return updatedPlan;
  },

  // USER STATS
  getStats(): UserStats {
    const stats = getStoredItem<UserStats>(STORAGE_KEYS.STATS, SAMPLE_USER_STATS);
    return stats;
  },

  updateStats(partial: Partial<UserStats>): UserStats {
    const current = this.getStats();
    const updated = {
      ...current,
      ...partial,
      lastActiveDate: new Date().toISOString(),
    };
    setStoredItem(STORAGE_KEYS.STATS, updated);
    return updated;
  },

  incrementStat(field: "totalNotes" | "quizzesCompleted"): void {
    const current = this.getStats();
    current[field] = (current[field] || 0) + 1;
    this.updateStats(current);
  },

  // CHAT HISTORY
  getChatHistory(): ChatMessage[] {
    return getStoredItem<ChatMessage[]>(STORAGE_KEYS.CHAT, [
      {
        id: "welcome-msg",
        sender: "assistant",
        content:
          "Namaste! 🙏 Main hoon aapka **AI Study Mate**. Aap mujhse koi bhi academic concept pooch sakte hain — chahe Physics ke formulas hon, Coding ke algorithms, ya Biology ke complex pathways!\n\nMain aapko simple **Hinglish, Hindi ya English** me real-life examples ke saath samjhaunga. Agar kuch samajh na aaye toh bas bolo **'Samajh nahi aaya'**, main aur asaan kar dunga! 🚀",
        timestamp: new Date().toISOString(),
      },
    ]);
  },

  saveChatHistory(messages: ChatMessage[]): void {
    setStoredItem(STORAGE_KEYS.CHAT, messages);
  },

  clearChatHistory(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEYS.CHAT);
  },

  // CUSTOM GEMINI API KEY (Entered in Settings)
  getCustomApiKey(): string {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(STORAGE_KEYS.CUSTOM_API_KEY) || "";
  },

  setCustomApiKey(key: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.CUSTOM_API_KEY, key.trim());
  },

  clearCustomApiKey(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_API_KEY);
  },

  // SEED / RESET
  seedInitialData(): void {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(STORAGE_KEYS.NOTES)) {
      setStoredItem(STORAGE_KEYS.NOTES, SAMPLE_NOTES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.FLASHCARDS)) {
      setStoredItem(STORAGE_KEYS.FLASHCARDS, SAMPLE_FLASHCARDS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PLAN)) {
      setStoredItem(STORAGE_KEYS.PLAN, SAMPLE_STUDY_PLAN);
    }
    if (!localStorage.getItem(STORAGE_KEYS.STATS)) {
      setStoredItem(STORAGE_KEYS.STATS, SAMPLE_USER_STATS);
    }
  },

  resetAllData(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEYS.NOTES);
    localStorage.removeItem(STORAGE_KEYS.QUIZZES);
    localStorage.removeItem(STORAGE_KEYS.FLASHCARDS);
    localStorage.removeItem(STORAGE_KEYS.PLAN);
    localStorage.removeItem(STORAGE_KEYS.STATS);
    localStorage.removeItem(STORAGE_KEYS.CHAT);
    this.seedInitialData();
  },
};
