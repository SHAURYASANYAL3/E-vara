// ─── E-VARA Security Hardening Layer ───

import { log } from "./observability";

// ─── Rate Limiter (Client-Side) ───
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export const checkRateLimit = (
  action: string,
  maxAttempts = 5,
  windowMs = 60000,
): boolean => {
  const now = Date.now();
  const entry = rateLimitStore.get(action);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(action, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxAttempts) {
    log("warn", `[Security] Rate limit exceeded for: ${action}`, {
      count: entry.count,
    });
    return false;
  }

  entry.count++;
  return true;
};

// ─── Input Sanitization (XSS Protection) ───
export const sanitizeInput = (input: string): string => {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(input));
  return div.innerHTML;
};

export const sanitizeHtml = (html: string): string => {
  return html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "");
};

// ─── CSRF Token Management ───
let csrfToken: string | null = null;

export const generateCsrfToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  csrfToken = Array.from(array, (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
  sessionStorage.setItem("e_vara_csrf", csrfToken);
  return csrfToken;
};

export const validateCsrfToken = (token: string): boolean => {
  const stored = csrfToken || sessionStorage.getItem("e_vara_csrf");
  if (!stored) return false;
  // Constant-time comparison
  if (token.length !== stored.length) return false;
  let result = 0;
  for (let i = 0; i < token.length; i++) {
    result |= token.charCodeAt(i) ^ stored.charCodeAt(i);
  }
  return result === 0;
};

// ─── Secure Token Rotation ───
export const rotateToken = (
  key: string,
  generator: () => string,
  intervalMs = 15 * 60 * 1000,
): (() => void) => {
  const rotate = () => {
    const newToken = generator();
    sessionStorage.setItem(key, newToken);
    log("debug", `[Security] Token rotated: ${key}`);
  };

  rotate(); // Initial rotation
  const interval = setInterval(rotate, intervalMs);
  return () => clearInterval(interval);
};

// ─── Secret Exposure Guard ───
export const validateEnvironment = (): {
  safe: boolean;
  warnings: string[];
} => {
  const warnings: string[] = [];

  // Check for exposed admin/service keys
  const envKeys = Object.keys(import.meta.env);
  const dangerousPatterns = [
    "SERVICE_ROLE",
    "ADMIN_KEY",
    "SECRET_KEY",
    "PRIVATE_KEY",
  ];

  for (const key of envKeys) {
    for (const pattern of dangerousPatterns) {
      if (key.toUpperCase().includes(pattern)) {
        warnings.push(
          `⚠️ Potentially dangerous env var exposed to client: ${key}`,
        );
        log("error", `[Security] Dangerous env var exposed: ${key}`);
      }
    }
  }

  // Check for Supabase service role key exposure
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (
    supabaseKey &&
    supabaseKey.startsWith("eyJ") &&
    supabaseKey.length > 200
  ) {
    // Likely a service role key if it's very long
    const decoded = atob(supabaseKey.split(".")[1] || "");
    if (decoded.includes("service_role")) {
      warnings.push(
        "🚨 CRITICAL: Supabase SERVICE_ROLE key is exposed in VITE_ env vars!",
      );
      log("error", "[Security] SERVICE_ROLE key exposed to client!");
    }
  }

  return { safe: warnings.length === 0, warnings };
};

// ─── Initialize Security Layer ───
export const initSecurity = () => {
  // 1. Validate environment
  const envCheck = validateEnvironment();
  if (!envCheck.safe) {
    envCheck.warnings.forEach((w) => console.warn(w));
  }

  // 2. Generate CSRF token
  generateCsrfToken();

  // 3. Rotate CSRF token every 15 minutes
  rotateToken("e_vara_csrf", generateCsrfToken, 15 * 60 * 1000);

  log("info", "[Security] Security layer initialized");
};
