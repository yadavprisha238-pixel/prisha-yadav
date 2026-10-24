import { z } from "zod";

export const GenerateNotesSchema = z.object({
  subject: z.string().min(2, "Subject is required"),
  topic: z.string().min(2, "Topic is required"),
  classLevel: z.string().default("High School / College"),
  language: z.enum(["hinglish", "hindi", "english"]).default("hinglish"),
  length: z.enum(["short", "medium", "detailed"]).default("medium"),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
});

export const GenerateQuizSchema = z.object({
  subject: z.string().min(2, "Subject is required"),
  topic: z.string().min(2, "Topic is required"),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
  numQuestions: z.number().min(3).max(15).default(5),
  language: z.enum(["hinglish", "hindi", "english"]).default("hinglish"),
});

export const GenerateFlashcardsSchema = z.object({
  subject: z.string().min(2, "Subject is required"),
  topic: z.string().min(2, "Topic is required"),
  numCards: z.number().min(3).max(12).default(6),
  language: z.enum(["hinglish", "hindi", "english"]).default("hinglish"),
});

export const ChatMessageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  language: z.enum(["hinglish", "hindi", "english"]).default("hinglish"),
  history: z
    .array(
      z.object({
        sender: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .optional(),
  simplify: z.boolean().optional(),
});

export const CreateStudyPlanSchema = z.object({
  examDate: z.string().min(4, "Exam date is required"),
  subjects: z.array(z.string()).min(1, "At least one subject is required"),
  topics: z.string().optional(),
  dailyHours: z.number().min(1).max(16).default(3),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
  goals: z.string().optional(),
});

export const DocumentProcessSchema = z.object({
  text: z.string().min(20, "Document text is too short to process"),
  action: z.enum(["summarize", "notes", "quiz", "qa"]),
  query: z.string().optional(),
  language: z.enum(["hinglish", "hindi", "english"]).default("hinglish"),
});
