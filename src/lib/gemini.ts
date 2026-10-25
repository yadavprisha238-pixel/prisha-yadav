import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

/**
 * Retrieve the Gemini API key strictly from the server-side environment.
 * Prioritizes process.env.GEMINI_API_KEY, process.env.GOOGLE_API_KEY,
 * then checks .env.local file directly on disk, and lastly allows an optional override.
 * The key is never exposed to browser client JavaScript bundles.
 */
export function getEffectiveApiKey(customApiKey?: string): string {
  // 1. Direct process.env check
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()) {
    return process.env.GEMINI_API_KEY.trim();
  }
  if (process.env.GOOGLE_API_KEY && process.env.GOOGLE_API_KEY.trim()) {
    return process.env.GOOGLE_API_KEY.trim();
  }

  // 2. Optional runtime override (e.g. from local server test header)
  if (customApiKey && customApiKey.trim()) {
    return customApiKey.trim();
  }

  // 3. Inspect .env.local on the server side dynamically
  if (typeof window === "undefined") {
    try {
      const envPath = path.resolve(process.cwd(), ".env.local");
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, "utf8");
        for (const line of content.split("\n")) {
          const trimmed = line.trim();
          if (trimmed.startsWith("GEMINI_API_KEY=") || trimmed.startsWith("GOOGLE_API_KEY=")) {
            const val = trimmed.split("=").slice(1).join("=").trim().replace(/^["']|["']$/g, "");
            if (val.length > 5) {
              return val;
            }
          }
        }
      }
    } catch {
      // Fallback silently if disk read is restricted
    }
  }

  return "";
}

export function getGeminiClient(customApiKey?: string) {
  const apiKey = getEffectiveApiKey(customApiKey);
  if (!apiKey) {
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
}

export function isGeminiConfigured(customApiKey?: string): boolean {
  const apiKey = getEffectiveApiKey(customApiKey);
  return Boolean(apiKey && apiKey.length > 5);
}

// Supported stable Gemini model according to official docs (https://ai.google.dev/gemini-api/docs/models)
export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

// Candidate models for automatic fallback if a specific model tier is restricted
export const FALLBACK_GEMINI_MODELS = [
  GEMINI_MODEL,
  "gemini-2.5-flash",
  "gemini-3.8-flash",
  "gemini-3.5-flash-lite",
];

/**
 * Format any Gemini API error into a friendly, actionable response for users.
 */
export function formatGeminiError(err: any): { error: string; message: string; status: number } {
  const msg = err?.message || String(err || "");
  const status = err?.status || 500;

  if (
    msg.includes("API_KEY_INVALID") ||
    msg.includes("API key not valid") ||
    msg.includes("PERMISSION_DENIED") ||
    msg.includes("key is invalid")
  ) {
    return {
      error: "INVALID_API_KEY",
      message:
        "Your Gemini API key appears to be invalid. Please verify the key generated in Google AI Studio (aistudio.google.com) and update it in Settings.",
      status: 401,
    };
  }

  if (
    msg.includes("429") ||
    msg.includes("RESOURCE_EXHAUSTED") ||
    msg.includes("Quota exceeded") ||
    msg.includes("rate limit")
  ) {
    return {
      error: "QUOTA_EXCEEDED",
      message:
        "Google Gemini API rate limit or daily quota reached. Please wait a moment before sending another request.",
      status: 429,
    };
  }

  if (
    msg.includes("404") ||
    msg.includes("not found") ||
    msg.includes("is not supported for generateContent")
  ) {
    return {
      error: "MODEL_UNSUPPORTED",
      message:
        "The requested Gemini model is currently unavailable or unsupported for this API key tier. Please check model configuration.",
      status: 404,
    };
  }

  if (
    msg.includes("fetch failed") ||
    msg.includes("ECONNREFUSED") ||
    msg.includes("ENOTFOUND") ||
    msg.includes("ETIMEDOUT")
  ) {
    return {
      error: "NETWORK_ERROR",
      message:
        "Network connection to Google Gemini API failed. Please check your internet connectivity.",
      status: 503,
    };
  }

  return {
    error: "GENERATION_FAILED",
    message: err?.message || "An unexpected error occurred during content generation.",
    status: typeof status === "number" && status >= 400 && status < 600 ? status : 500,
  };
}

/**
 * Safely generate content, automatically trying active stable models if a 404/unsupported error occurs.
 */
export async function generateContentWithFallback(
  gemini: GoogleGenerativeAI,
  promptOrPayload: any,
  preferredModel: string = GEMINI_MODEL,
  modelOptions?: { systemInstruction?: string }
) {
  const modelsToTry = Array.from(new Set([preferredModel, ...FALLBACK_GEMINI_MODELS]));
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      const model = gemini.getGenerativeModel({
        model: modelName,
        systemInstruction: modelOptions?.systemInstruction,
      });
      const result = await model.generateContent(promptOrPayload);
      return result;
    } catch (err: any) {
      lastError = err;
      const isNotFound =
        err?.status === 404 ||
        err?.message?.includes("404") ||
        err?.message?.includes("not found") ||
        err?.message?.includes("is not supported for generateContent");
      if (!isNotFound) {
        throw err;
      }
      console.warn(`[Gemini API] Model "${modelName}" returned 404, attempting fallback to next supported stable model...`);
    }
  }

  throw lastError;
}

/**
 * Clean and parse JSON from a Gemini response that might be wrapped in ```json ... ``` markdown blocks.
 */
export function extractJsonFromResponse<T = any>(text: string): T {
  let cleaned = text.trim();

  // Strip ```json and ```
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.substring(3);
  }

  if (cleaned.endsWith("```")) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }

  cleaned = cleaned.trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch (err) {
    // Attempt to locate first { and last } or first [ and last ]
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(cleaned.substring(firstBrace, lastBrace + 1)) as T;
    }

    const firstBracket = cleaned.indexOf("[");
    const lastBracket = cleaned.lastIndexOf("]");
    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
      return JSON.parse(cleaned.substring(firstBracket, lastBracket + 1)) as T;
    }

    throw new Error(`Failed to parse AI JSON response: ${(err as Error).message}\nRaw Text: ${text.slice(0, 300)}...`);
  }
}
