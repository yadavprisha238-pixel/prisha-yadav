import { NextRequest, NextResponse } from "next/server";
import { GenerateQuizSchema } from "@/lib/validation";
import {
  getGeminiClient,
  extractJsonFromResponse,
  GEMINI_MODEL,
  generateContentWithFallback,
  formatGeminiError,
} from "@/lib/gemini";
import { QuizQuestion } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = GenerateQuizSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input parameters", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { subject, topic, difficulty, numQuestions, language } = parsed.data;
    const customKey = req.headers.get("x-gemini-key") || undefined;
    const gemini = getGeminiClient(customKey);

    if (!gemini) {
      return NextResponse.json(
        {
          error: "GEMINI_API_KEY_MISSING",
          message:
            "Google Gemini API key is not configured. Add GEMINI_API_KEY to your .env.local file or enter your key in Settings to generate live quizzes.",
        },
        { status: 401 }
      );
    }

    const langInstruction =
      language === "hinglish"
        ? "Formulate questions and explanations in natural Hinglish with everyday clarity."
        : language === "hindi"
        ? "Formulate questions and explanations in Hindi."
        : "Formulate questions and explanations in English.";

    const prompt = `You are AI Study Mate's Quiz Engine.
Create an interactive Multiple Choice Quiz (MCQ) testing student knowledge.
Subject: ${subject}
Topic: ${topic}
Difficulty: ${difficulty}
Total Questions: ${numQuestions}
Language: ${language} (${langInstruction})

Requirements:
- Exactly ${numQuestions} high-quality questions.
- Each question must have 4 distinct options.
- correctAnswerIndex MUST be an integer from 0 to 3 corresponding to the correct option in the options array.
- Include a concise, helpful explanation why that option is correct.

Return STRICT JSON matching this schema:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswerIndex": 0,
      "explanation": "Clear explanation of why this answer is correct."
    }
  ]
}`;

    const result = await generateContentWithFallback(gemini, prompt);
    const parsedData = extractJsonFromResponse<{ questions: QuizQuestion[] }>(
      result.response.text()
    );

    const questions: QuizQuestion[] = (parsedData.questions || []).map((q, idx) => ({
      id: `q-${Date.now()}-${idx}`,
      question: q.question,
      options: q.options || [],
      correctAnswerIndex: typeof q.correctAnswerIndex === "number" ? q.correctAnswerIndex : 0,
      explanation: q.explanation || "Correct answer.",
    }));

    return NextResponse.json({
      success: true,
      title: `${topic} Quiz (${difficulty.toUpperCase()})`,
      subject,
      difficulty,
      language,
      totalQuestions: questions.length,
      questions,
    });
  } catch (error: any) {
    console.error("AI Quiz Generation Error:", error);
    const formatted = formatGeminiError(error);
    return NextResponse.json(
      { error: formatted.error, message: formatted.message },
      { status: formatted.status }
    );
  }
}
