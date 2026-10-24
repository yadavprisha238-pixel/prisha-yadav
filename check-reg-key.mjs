import { execSync } from "child_process";

try {
  const userOut = execSync('reg query "HKCU\\Environment" /v GEMINI_API_KEY', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
  console.log("HKCU GEMINI_API_KEY found:", userOut.includes("GEMINI_API_KEY"));
} catch (e) {
  console.log("HKCU GEMINI_API_KEY not found in registry");
}

try {
  const machOut = execSync('reg query "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment" /v GEMINI_API_KEY', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
  console.log("HKLM GEMINI_API_KEY found:", machOut.includes("GEMINI_API_KEY"));
} catch (e) {
  console.log("HKLM GEMINI_API_KEY not found in registry");
}
