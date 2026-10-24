export type Language = "hinglish" | "hindi" | "english";
export type Difficulty = "easy" | "medium" | "hard";
export type NoteLength = "short" | "medium" | "detailed";

export interface NoteItem {
  id: string;
  title: string;
  subject: string;
  classLevel: string;
  language: Language;
  difficulty: Difficulty;
  content: {
    introduction: string;
    definitions: { term: string; explanation: string }[];
    keyConcepts: { heading: string; points: string[] }[];
    bulletPoints: string[];
    examples: string[];
    formulas: string[];
    examTips: string[];
    quickSummary: string;
    practiceQuestions: string[];
  };
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  isDemo?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizAttempt {
  id: string;
  title: string;
  subject: string;
  difficulty: Difficulty;
  language: Language;
  totalQuestions: number;
  userAnswers: { [questionIndex: number]: number };
  score: number;
  percentage: number;
  completedAt: string;
  questions: QuizQuestion[];
  isDemo?: boolean;
}

export interface Flashcard {
  id: string;
  subject: string;
  topic: string;
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
  status: "new" | "learning" | "mastered";
  lastReviewed?: string;
  nextReview?: string;
  isDemo?: boolean;
}

export interface StudyTask {
  id: string;
  subject: string;
  topic: string;
  durationMinutes: number;
  dueDate: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
  notes?: string;
}

export interface StudyPlan {
  id: string;
  title: string;
  examDate: string;
  targetDailyHours: number;
  subjects: string[];
  tasks: StudyTask[];
  createdAt: string;
  isDemo?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  content: string;
  timestamp: string;
  isSimplified?: boolean;
}

export interface UserStats {
  totalNotes: number;
  quizzesCompleted: number;
  averageScore: number;
  studyStreakDays: number;
  totalStudyMinutes: number;
  lastActiveDate: string;
}
