import { NextRequest, NextResponse } from "next/server";
import { ChatMessageSchema } from "@/lib/validation";
import {
  getGeminiClient,
  GEMINI_MODEL,
  generateContentWithFallback,
  formatGeminiError,
} from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ChatMessageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid message payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { message, language, history = [], simplify = false } = parsed.data;
    const customKey = req.headers.get("x-gemini-key") || undefined;
    const gemini = getGeminiClient(customKey);

    if (!gemini) {
      return NextResponse.json(
        {
          error: "GEMINI_API_KEY_MISSING",
          message:
            "Google Gemini API key is not configured. Add GEMINI_API_KEY to .env.local or enter your key in Settings to chat with the live AI Tutor.",
        },
        { status: 401 }
      );
    }

    const isStudentStuck =
      simplify ||
      message.toLowerCase().includes("samajh nahi aaya") ||
      message.toLowerCase().includes("phir se samjhao") ||
      message.toLowerCase().includes("explain again") ||
      message.toLowerCase().includes("too hard");

    const systemPrompt = `You are "AI Study Mate", a friendly, patient, highly motivating, and enthusiastic Indian academic tutor.
Your persona:
- Always supportive, cheerful, and encouraging ("Arre bilkul easy hai, abhi 2 minute me clear ho jaayega!").
- Language: Default to natural spoken **Hinglish** (Hindi in English script mixed with standard technical English terms like 'class', 'function', 'energy', 'momentum'). If requested in Hindi or English, adapt smoothly.
- Teaching style:
  1. Break big concepts into bite-sized steps (1-2-3).
  2. Use relatable daily life analogies (Cricket, Chai, Metro/Bus, Bollywood, Food, Gaming, Mobile apps).
  3. Format answers with clear headings, bullet points, and code/formula snippets where helpful.
  4. End with 1 quick check-for-understanding practice question.

${
  isStudentStuck
    ? `SPECIAL INSTRUCTION: The student didn't understand the previous explanation!
Drop all academic jargon completely. Explain it like the student is 10 years old with an ultra-simple real-world story or analogy. Be extra reassuring.`
    : ""
}`;

    // Format chat history for Gemini with valid alternating roles
    const contents: any[] = [];

    // Append up to last 8 messages for context ensuring proper alternation
    const recentHistory = history.slice(-8);
    for (const msg of recentHistory) {
      const role = msg.sender === "user" ? "user" : "model";
      // Avoid duplicate consecutive roles
      if (contents.length > 0 && contents[contents.length - 1].role === role) {
        contents[contents.length - 1].parts[0].text += `\n${msg.content}`;
      } else {
        contents.push({
          role,
          parts: [{ text: msg.content }],
        });
      }
    }

    // Add current user prompt
    const currentText = isStudentStuck
      ? `Student is confused: "${message}". Please simplify the explanation with an intuitive everyday analogy and encourage them!`
      : message;

    if (contents.length > 0 && contents[contents.length - 1].role === "user") {
      contents[contents.length - 1].parts[0].text += `\n${currentText}`;
    } else {
      contents.push({
        role: "user",
        parts: [{ text: currentText }],
      });
    }

    const result = await generateContentWithFallback(
      gemini,
      { contents },
      GEMINI_MODEL,
      { systemInstruction: systemPrompt }
    );
    const replyText = result.response.text();

    return NextResponse.json({
      success: true,
      reply: replyText,
      timestamp: new Date().toISOString(),
      isSimplified: isStudentStuck,
    });
  } catch (error: any) {
    console.error("AI Tutor Chat Error:", error);
    const formatted = formatGeminiError(error);
    return NextResponse.json(
      { error: formatted.error, message: formatted.message },
      { status: formatted.status }
    );
  }
}
