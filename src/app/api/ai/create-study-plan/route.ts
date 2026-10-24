import { NextRequest, NextResponse } from "next/server";
import { CreateStudyPlanSchema } from "@/lib/validation";
import {
  getGeminiClient,
  extractJsonFromResponse,
  GEMINI_MODEL,
  generateContentWithFallback,
  formatGeminiError,
} from "@/lib/gemini";
import { StudyPlan, StudyTask } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = CreateStudyPlanSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid study plan input", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { examDate, subjects, topics, dailyHours, difficulty, goals } = parsed.data;
    const customKey = req.headers.get("x-gemini-key") || undefined;
    const gemini = getGeminiClient(customKey);

    if (!gemini) {
      return NextResponse.json(
        {
          error: "GEMINI_API_KEY_MISSING",
          message:
            "Google Gemini API key is not configured. Add GEMINI_API_KEY to your .env.local file or enter your key in Settings to create an AI study plan.",
        },
        { status: 401 }
      );
    }

    const prompt = `You are an expert academic counselor and study strategist.
Create a smart, practical study schedule.
Exam Date: ${examDate}
Subjects: ${subjects.join(", ")}
Specific Topics / Weak Areas: ${topics || "All core syllabus"}
Daily Available Study Time: ${dailyHours} hours
Difficulty Level: ${difficulty}
Student Goals: ${goals || "Achieve top grades with thorough revision"}

Generate 5 to 8 focused, sequential study tasks that fit this timeframe.
Return STRICT JSON:
{
  "title": "Smart Study Sprint for ${subjects[0]} & Exams",
  "tasks": [
    {
      "subject": "${subjects[0]}",
      "topic": "Topic Name",
      "durationMinutes": 45,
      "priority": "high",
      "notes": "Advice on how to study this topic effectively"
    }
  ]
}`;

    const result = await generateContentWithFallback(gemini, prompt);
    const parsedData = extractJsonFromResponse<{ title: string; tasks: any[] }>(
      result.response.text()
    );

    const today = new Date();
    const generatedTasks: StudyTask[] = (parsedData.tasks || []).map((t, idx) => {
      const taskDate = new Date(today.getTime() + 86400000 * Math.floor(idx / 2));
      return {
        id: `task-${Date.now()}-${idx}`,
        subject: t.subject || subjects[0] || "General",
        topic: t.topic || "Core Revision",
        durationMinutes: t.durationMinutes || 45,
        dueDate: taskDate.toISOString().split("T")[0],
        completed: false,
        priority: ["high", "medium", "low"].includes(t.priority) ? t.priority : "medium",
        notes: t.notes || "",
      };
    });

    const newPlan: StudyPlan = {
      id: `plan-${Date.now()}`,
      title: parsedData.title || `Exam Prep Plan`,
      examDate,
      targetDailyHours: dailyHours,
      subjects,
      tasks: generatedTasks,
      createdAt: new Date().toISOString(),
      isDemo: false,
    };

    return NextResponse.json({ success: true, plan: newPlan });
  } catch (error: any) {
    console.error("AI Study Plan Error:", error);
    const formatted = formatGeminiError(error);
    return NextResponse.json(
      { error: formatted.error, message: formatted.message },
      { status: formatted.status }
    );
  }
}
