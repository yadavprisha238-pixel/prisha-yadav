import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getEffectiveApiKey, GEMINI_MODEL } from "@/lib/gemini";

const ENV_FILE_PATH = path.resolve(process.cwd(), ".env.local");

function maskKey(key: string): string {
  if (!key || key.length < 8) return "••••••••";
  const start = key.slice(0, 6);
  const end = key.slice(-4);
  return `${start}${"•".repeat(Math.min(key.length - 10, 16))}${end}`;
}

export async function GET() {
  try {
    const activeKey = getEffectiveApiKey();
    const isConfigured = Boolean(activeKey && activeKey.length > 5);

    return NextResponse.json({
      isConfigured,
      maskedKey: isConfigured ? maskKey(activeKey) : null,
      model: GEMINI_MODEL,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "SETTINGS_READ_FAILED", message: err?.message || "Failed to read server settings." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawKey = body?.apiKey;

    if (!rawKey || typeof rawKey !== "string") {
      return NextResponse.json(
        {
          error: "INVALID_INPUT",
          message: "API key is required and must be a text string.",
        },
        { status: 400 }
      );
    }

    const trimmedKey = rawKey.trim();

    // Basic format validation for Google API keys
    if (trimmedKey.length < 20) {
      return NextResponse.json(
        {
          error: "KEY_TOO_SHORT",
          message: "The entered API key is too short. Google AI Studio keys are typically 39 characters.",
        },
        { status: 400 }
      );
    }

    if (/\s/.test(trimmedKey)) {
      return NextResponse.json(
        {
          error: "INVALID_CHARACTERS",
          message: "API key must not contain any spaces or whitespace characters.",
        },
        { status: 400 }
      );
    }

    // Safely update or create .env.local on the server
    let envContent = "";
    if (fs.existsSync(ENV_FILE_PATH)) {
      envContent = fs.readFileSync(ENV_FILE_PATH, "utf8");
    }

    const lines = envContent.split(/\r?\n/);
    let keyFound = false;
    const updatedLines = lines.map((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith("GEMINI_API_KEY=")) {
        keyFound = true;
        return `GEMINI_API_KEY=${trimmedKey}`;
      }
      return line;
    });

    if (!keyFound) {
      if (updatedLines.length > 0 && updatedLines[updatedLines.length - 1].trim() !== "") {
        updatedLines.push("");
      }
      updatedLines.push(`GEMINI_API_KEY=${trimmedKey}`);
    }

    fs.writeFileSync(ENV_FILE_PATH, updatedLines.join("\n"), "utf8");

    // Also update runtime process.env so it takes effect immediately without restart
    process.env.GEMINI_API_KEY = trimmedKey;

    return NextResponse.json({
      success: true,
      message: "API key saved securely to server-side configuration (.env.local).",
      maskedKey: maskKey(trimmedKey),
      model: GEMINI_MODEL,
    });
  } catch (err: any) {
    console.error("Error saving API key:", err);
    return NextResponse.json(
      { error: "SAVE_FAILED", message: err?.message || "Failed to persist API key securely." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    if (fs.existsSync(ENV_FILE_PATH)) {
      const content = fs.readFileSync(ENV_FILE_PATH, "utf8");
      const lines = content.split(/\r?\n/);
      const updatedLines = lines.map((line) => {
        if (line.trim().startsWith("GEMINI_API_KEY=")) {
          return "GEMINI_API_KEY=";
        }
        return line;
      });
      fs.writeFileSync(ENV_FILE_PATH, updatedLines.join("\n"), "utf8");
    }

    delete process.env.GEMINI_API_KEY;

    return NextResponse.json({
      success: true,
      message: "API key removed from server-side configuration.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "DELETE_FAILED", message: err?.message || "Failed to remove API key." },
      { status: 500 }
    );
  }
}
