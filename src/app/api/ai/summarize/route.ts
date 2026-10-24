import { NextRequest, NextResponse } from "next/server";
import {
  getGeminiClient,
  GEMINI_MODEL,
  generateContentWithFallback,
  formatGeminiError,
} from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { text, language = "hinglish" } = await req.json();

    if (!text || text.trim().length < 10) {
      return NextResponse.json(
        { error: "Text must be at least 10 characters long" },
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

    const prompt = `Summarize the following educational content in ${language}:
Content:
"""
${text.slice(0, 8000)}
"""

Please provide:
1. Executive Summary (2-3 sentences)
2. 5 Key Takeaway Bullet Points
3. Exam Point of View (Why this matters)`;

    const result = await generateContentWithFallback(gemini, prompt);

    return NextResponse.json({
      success: true,
      summary: result.response.text(),
    });
  } catch (error: any) {
    console.error("Summarization Error:", error);
    const formatted = formatGeminiError(error);
    return NextResponse.json(
      { error: formatted.error, message: formatted.message },
      { status: formatted.status }
    );
  }
}
