import { NextRequest, NextResponse } from "next/server";
import { GenerateNotesSchema } from "@/lib/validation";
import {
  getGeminiClient,
  extractJsonFromResponse,
  GEMINI_MODEL,
  generateContentWithFallback,
  formatGeminiError,
} from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = GenerateNotesSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input parameters", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { subject, topic, classLevel, language, length, difficulty } = parsed.data;
    const customKey = req.headers.get("x-gemini-key") || undefined;
    const gemini = getGeminiClient(customKey);

    if (!gemini) {
      return NextResponse.json(
        {
          error: "GEMINI_API_KEY_MISSING",
          message:
            "Google Gemini API key is not configured. Add GEMINI_API_KEY to your .env.local file or enter your key in Settings to generate live notes.",
        },
        { status: 401 }
      );
    }

    const langInstruction =
      language === "hinglish"
        ? "Explain in natural, student-friendly Hinglish (Hindi written in English alphabets mixed with standard English academic terms). Use relatable Indian daily life examples (like cricket, chai, local travel, mobile phones)."
        : language === "hindi"
        ? "Explain in fluent, clear Hindi (Devanagari script) with standard technical terms in brackets."
        : "Explain in fluent, engaging, clear English with memorable analogies.";

    const prompt = `You are AI Study Mate, an expert personal tutor.
Generate comprehensive, student-friendly revision notes for:
Subject: ${subject}
Topic: ${topic}
Education Level: ${classLevel}
Target Length: ${length}
Difficulty: ${difficulty}

Language instructions:
${langInstruction}

You MUST return your response as a STRICT JSON object with this exact schema (no markdown formatting outside of JSON):
{
  "title": "${topic}",
  "introduction": "Engaging 2-3 sentence introduction to why this concept matters and what it is",
  "definitions": [
    { "term": "Term Name", "explanation": "Crystal-clear definition in ${language}" }
  ],
  "keyConcepts": [
    {
      "heading": "Sub-concept Heading",
      "points": ["Key takeaway point 1", "Key takeaway point 2"]
    }
  ],
  "bulletPoints": [
    "Quick high-yield bullet point 1",
    "Quick high-yield bullet point 2",
    "Quick high-yield bullet point 3"
  ],
  "examples": [
    "Real-world example or code snippet or numerical application"
  ],
  "formulas": [
    "Key mathematical or scientific formula / syntax (if applicable, else empty array)"
  ],
  "examTips": [
    "Crucial high-scoring tip or common viva/exam pitfall to avoid"
  ],
  "quickSummary": "One paragraph recap of the entire topic",
  "practiceQuestions": [
    "Practice question 1 for self-testing",
    "Practice question 2 for self-testing",
    "Practice question 3 for self-testing"
  ]
}`;

    const result = await generateContentWithFallback(gemini, prompt);
    const responseText = result.response.text();
    const notesJson = extractJsonFromResponse(responseText);

    const generatedNote = {
      id: "note-" + Date.now(),
      title: notesJson.title || topic,
      subject,
      classLevel,
      language,
      difficulty,
      content: {
        introduction: notesJson.introduction || "",
        definitions: notesJson.definitions || [],
        keyConcepts: notesJson.keyConcepts || [],
        bulletPoints: notesJson.bulletPoints || [],
        examples: notesJson.examples || [],
        formulas: notesJson.formulas || [],
        examTips: notesJson.examTips || [],
        quickSummary: notesJson.quickSummary || "",
        practiceQuestions: notesJson.practiceQuestions || [],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [subject, topic],
      isDemo: false,
    };

    return NextResponse.json({ success: true, note: generatedNote });
  } catch (error: any) {
    console.error("AI Notes Generation Error:", error);
    const formatted = formatGeminiError(error);
    return NextResponse.json(
      { error: formatted.error, message: formatted.message },
      { status: formatted.status }
    );
  }
}
