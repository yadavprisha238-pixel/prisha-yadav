import fs from "fs";

function findKey() {
  const envFiles = [".env.local", ".env", ".env.development", ".env.production"];
  for (const file of envFiles) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, "utf8");
      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith("GEMINI_API_KEY=") || line.startsWith("GOOGLE_API_KEY=")) {
          const parts = line.split("=");
          const val = parts.slice(1).join("=").trim();
          if (val.length > 0) {
            return { file: file, key: val };
          }
        }
      }
    }
  }
  if (process.env.GEMINI_API_KEY) {
    return { file: "process.env.GEMINI_API_KEY", key: process.env.GEMINI_API_KEY.trim() };
  }
  return null;
}

const result = findKey();
if (!result) {
  console.log("No key found in any env file or process.env.");
} else {
  console.log("Found key in " + result.file + " with length " + result.key.length);
}
