import { NextRequest, NextResponse } from "next/server";
import { GenerateFlashcardsSchema } from "@/lib/validation";
import {
  getGeminiClient,
  extractJsonFromResponse,
  GEMINI_MODEL,
  generateContentWithFallback,
  formatGeminiError,
} from "@/lib/gemini";
import { Flashcard } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = GenerateFlashcardsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input parameters", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { subject, topic, numCards, language } = parsed.data;
    const customKey = req.headers.get("x-gemini-key") || undefined;
    const gemini = getGeminiClient(customKey);

    if (!gemini) {
      return NextResponse.json(
        {
          error: "GEMINI_API_KEY_MISSING",
          message:
            "Google Gemini API key is not configured. Add GEMINI_API_KEY to your .env.local file or enter your key in Settings to generate flashcards.",
        },
        { status: 401 }
      );
    }

    const prompt = `You are AI Study Mate's Flashcard Creator.
Create ${numCards} high-yield revision flashcards for:
Subject: ${subject}
Topic: ${topic}
Language: ${language} (Natural Hinglish or English)

Requirements:
- Front of card (question): Clear question, term, or formula to identify.
- Back of card (answer): Crisp, high-yield explanation or bullet points that are quick to memorize.
- difficulty: "easy", "medium", or "hard".

Return STRICT JSON:
{
  "flashcards": [
    {
      "question": "Question or concept name",
      "answer": "Crisp, memorable answer",
      "difficulty": "medium"
    }
  ]
}`;

    const result = await generateContentWithFallback(gemini, prompt);
    const parsedData = extractJsonFromResponse<{ flashcards: any[] }>(result.response.text());

    const flashcards: Flashcard[] = (parsedData.flashcards || []).map((fc, idx) => ({
      id: `fc-${Date.now()}-${idx}`,
      subject,
      topic,
      question: fc.question,
      answer: fc.answer,
      difficulty: ["easy", "medium", "hard"].includes(fc.difficulty) ? fc.difficulty : "medium",
      status: "new",
      isDemo: false,
    }));

    return NextResponse.json({
      success: true,
      subject,
      topic,
      totalCards: flashcards.length,
      flashcards,
    });
  } catch (error: any) {
    console.error("Flashcard Generation Error:", error);
    const formatted = formatGeminiError(error);
    return NextResponse.json(
      { error: formatted.error, message: formatted.message },
      { status: formatted.status }
    );
  }
}
