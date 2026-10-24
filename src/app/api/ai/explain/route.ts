import { NextRequest, NextResponse } from "next/server";
import {
  getGeminiClient,
  GEMINI_MODEL,
  generateContentWithFallback,
  formatGeminiError,
} from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { concept, passage, language = "hinglish" } = await req.json();

    const input = concept || passage;
    if (!input || input.trim().length < 3) {
      return NextResponse.json(
        { error: "Concept or passage is required" },
        { status: 400 }
      );
    }

    const customKey = req.headers.get("x-gemini-key") || undefined;
    const gemini = getGeminiClient(customKey);

    if (!gemini) {
      return NextResponse.json(
        {
          error: "GEMINI_API_KEY_MISSING",
          message:
            "Google Gemini API key is not configured. Add GEMINI_API_KEY to your .env.local file or enter your key in Settings.",
        },
        { status: 401 }
      );
    }

    const prompt = `You are AI Study Mate.
Explain the following concept or passage clearly in ${language}:
"${input.slice(0, 5000)}"

Structure your answer:
1. Simple Intuitive Explanation (like talking to a friend)
2. Everyday Real-World Analogy (something relatable like tea, cricket, driving, smartphones)
3. Technical/Academic Definition
4. Quick Viva / Interview Question with Answer`;

    const result = await generateContentWithFallback(gemini, prompt);

    return NextResponse.json({
      success: true,
      explanation: result.response.text(),
    });
  } catch (error: any) {
    console.error("Explanation Error:", error);
    const formatted = formatGeminiError(error);
    return NextResponse.json(
      { error: formatted.error, message: formatted.message },
      { status: formatted.status }
    );
  }
}
