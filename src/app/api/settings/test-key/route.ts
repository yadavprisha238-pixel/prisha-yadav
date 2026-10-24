import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  getEffectiveApiKey,
  getGeminiClient,
  generateContentWithFallback,
  GEMINI_MODEL,
  formatGeminiError,
} from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    let customKey: string | undefined;
    try {
      const body = await req.json();
      if (body?.apiKey && typeof body.apiKey === "string" && body.apiKey.trim()) {
        customKey = body.apiKey.trim();
      }
    } catch {
      // Body is optional if testing already configured server key
    }

    const client = customKey ? new GoogleGenerativeAI(customKey) : getGeminiClient();

    if (!client) {
      return NextResponse.json(
        {
          error: "GEMINI_API_KEY_MISSING",
          message:
            "No API key is configured. Please enter your Gemini API key in the input field or save it first.",
        },
        { status: 400 }
      );
    }

    // Ping Gemini with a tiny test prompt to verify credentials and connectivity
    const response = await generateContentWithFallback(
      client,
      "Respond with 'OK' to confirm connectivity."
    );

    const reply = response.response.text();

    return NextResponse.json({
      success: true,
      message: "Connection verified! Gemini API is active and operational.",
      model: GEMINI_MODEL,
      replyPreview: reply.slice(0, 50).trim(),
    });
  } catch (err: any) {
    console.error("[Test Key Error]:", err);
    const formatted = formatGeminiError(err);
    return NextResponse.json(
      {
        error: formatted.error,
        message: formatted.message,
      },
      { status: formatted.status }
    );
  }
}
