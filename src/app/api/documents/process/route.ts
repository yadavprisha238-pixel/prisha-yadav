import { NextRequest, NextResponse } from "next/server";
import { DocumentProcessSchema } from "@/lib/validation";
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
    const parsed = DocumentProcessSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid document request", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { text, action, query, language } = parsed.data;
    const customKey = req.headers.get("x-gemini-key") || undefined;
    const gemini = getGeminiClient(customKey);

    if (!gemini) {
      return NextResponse.json(
        {
          error: "GEMINI_API_KEY_MISSING",
          message:
            "Google Gemini API key is not configured. Add GEMINI_API_KEY to your .env.local file or enter your key in Settings to analyze documents.",
        },
        { status: 401 }
      );
    }

    // Truncate to first 12,000 characters to stay safely within token limits while capturing main content
    const documentExcerpt = text.slice(0, 12000);

    let prompt = "";
    if (action === "summarize") {
      prompt = `Summarize the attached document content in ${language}.
Provide:
1. Main Theme & Purpose
2. 5-7 Key Highlights & Formulas/Concepts
3. Conclusion & Exam Relevance

Document Content:
"""
${documentExcerpt}
"""`;
    } else if (action === "notes") {
      prompt = `Generate structured revision notes based solely on the attached document content in ${language}.
Include:
- Key terms and definitions
- Important points
- Common exam takeaways

Document Content:
"""
${documentExcerpt}
"""`;
    } else if (action === "quiz") {
      prompt = `Generate a 5-question Multiple Choice Quiz directly testing understanding of the attached document in ${language}.
Return STRICT JSON:
{
  "questions": [
    {
      "question": "Question text based on document?",
      "options": ["A", "B", "C", "D"],
      "correctAnswerIndex": 0,
      "explanation": "Why this answer is verified from the text"
    }
  ]
}

Document Content:
"""
${documentExcerpt}
"""`;
    } else {
      // Q&A
      prompt = `You are AI Study Mate. A student is asking a question about their study document.
Student Question: "${query || "What are the most critical takeaways from this text?"}"

Document Context:
"""
${documentExcerpt}
"""

Answer the student's question accurately based on the document text in ${language}. If the answer is not in the text, mention that politely and offer general academic knowledge.`;
    }

    const result = await generateContentWithFallback(gemini, prompt);
    const responseText = result.response.text();

    if (action === "quiz") {
      try {
        const quizJson = extractJsonFromResponse<{ questions: any[] }>(responseText);
        return NextResponse.json({ success: true, action, quiz: quizJson });
      } catch (err) {
        // Return raw text if JSON extraction failed
        return NextResponse.json({ success: true, action, result: responseText });
      }
    }

    return NextResponse.json({
      success: true,
      action,
      result: responseText,
    });
  } catch (error: any) {
    console.error("Document Process Error:", error);
    const formatted = formatGeminiError(error);
    return NextResponse.json(
      { error: formatted.error, message: formatted.message },
      { status: formatted.status }
    );
  }
}
