/**
 * Identity Intelligence Analysis System
 * Transforms raw search results into structured identity intelligence.
 */

export type ResultClassification =
  | "Verified Platform Match"
  | "Possible Identity Match"
  | "Username Similarity Detected"
  | "Public Mention Detected"
  | "Not Relevant";

export type RiskLevel = "High Risk" | "Medium Risk" | "Low Risk" | "Ignore";

export interface IdentitySignal {
  type: ResultClassification;
  platform: string | null;
  confidence: number;
  risk: RiskLevel;
  reason: string;
  title: string;
  snippet: string;
  link: string;
  imageUrl?: string;
  metadata?: {
    exactMatch?: boolean;
    partialMatch?: boolean;
    similarityScore?: number;
    platformVerified?: boolean;
  };
}

export interface SearchResultInput {
  title: string;
  snippet: string;
  link: string;
}

export interface AnalysisResult {
  signals: IdentitySignal[];
  summary: {
    totalResults: number;
    highRiskCount: number;
    mediumRiskCount: number;
    lowRiskCount: number;
    averageConfidence: number;
  };
  timestamp: Date;
}

const KNOWN_PLATFORMS: Record<string, string[]> = {
  Twitter: ["twitter.com", "x.com"],
  Instagram: ["instagram.com", "instagr.am"],
  LinkedIn: ["linkedin.com"],
  Facebook: ["facebook.com", "fb.com"],
  TikTok: ["tiktok.com"],
  Threads: ["threads.net"],
  BlueSky: ["bsky.app"],
  Reddit: ["reddit.com"],
  GitHub: ["github.com"],
  YouTube: ["youtube.com", "youtu.be"],
  Medium: ["medium.com"],
  Discord: ["discord.com"],
  Telegram: ["telegram.org", "t.me"],
};

export function detectPlatform(url: string): string | null {
  try {
    const domain = new URL(url).hostname.toLowerCase();

    for (const [platform, domains] of Object.entries(KNOWN_PLATFORMS)) {
      if (domains.some((candidate) => domain.includes(candidate))) {
        return platform;
      }
    }

    const bare = domain.replace(/^www\./, "").split(".")[0];
    return bare ? bare.charAt(0).toUpperCase() + bare.slice(1) : null;
  } catch {
    return null;
  }
}

export function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.trim().toLowerCase();
  const s2 = str2.trim().toLowerCase();

  if (!s1 || !s2) return 0;
  if (s1 === s2) return 1;

  const matrix: number[][] = Array.from({ length: s2.length + 1 }, (_, row) =>
    Array.from({ length: s1.length + 1 }, (_, col) =>
      row === 0 ? col : col === 0 ? row : 0,
    ),
  );

  for (let row = 1; row <= s2.length; row += 1) {
    for (let col = 1; col <= s1.length; col += 1) {
      const substitutionCost = s2[row - 1] === s1[col - 1] ? 0 : 1;

      matrix[row][col] = Math.min(
        matrix[row - 1][col] + 1,
        matrix[row][col - 1] + 1,
        matrix[row - 1][col - 1] + substitutionCost,
      );
    }
  }

  const distance = matrix[s2.length][s1.length];
  return 1 - distance / Math.max(s1.length, s2.length);
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function containsExactMatch(text: string, patterns: string[]): boolean {
  const normalizedText = normalize(text);

  return patterns.some((pattern) => {
    const normalizedPattern = normalize(pattern);
    const compactPattern = normalizedPattern.replace(/\s+/g, "");

    return (
      normalizedText.includes(normalizedPattern) ||
      normalizedText.replace(/\s+/g, "").includes(compactPattern)
    );
  });
}

function extractUsername(url: string): string | null {
  try {
    const path = new URL(url).pathname;
    const patterns = [
      /\/@([a-zA-Z0-9_.-]+)/,
      /\/in\/([a-zA-Z0-9_.-]+)/,
      /\/u(?:ser)?\/([a-zA-Z0-9_.-]+)/,
      /\/profile\/([a-zA-Z0-9_.-]+)/,
      /^\/([a-zA-Z0-9_.-]{3,})\/?$/,
    ];

    for (const pattern of patterns) {
      const match = path.match(pattern);
      if (match) return match[1].toLowerCase();
    }

    return null;
  } catch {
    return null;
  }
}

export function classifyResult(
  result: SearchResultInput,
  fullName: string,
  username: string,
): IdentitySignal {
  const platform = detectPlatform(result.link);
  const content = `${result.title} ${result.snippet}`;
  const extractedUsername = extractUsername(result.link);

  const normalizedFullName = normalize(fullName);
  const normalizedUsername = normalize(username);
  const normalizedContent = normalize(content);

  const usernameFromUrlScore = extractedUsername
    ? calculateSimilarity(extractedUsername, normalizedUsername)
    : 0;

  const usernameContentScore = calculateSimilarity(
    normalizedUsername,
    normalizedContent.slice(0, Math.max(normalizedUsername.length + 20, 40)),
  );

  const hasFullName = containsExactMatch(normalizedContent, [
    normalizedFullName,
  ]);
  const hasUsernameMention = containsExactMatch(normalizedContent, [
    normalizedUsername,
  ]);

  let type: ResultClassification = "Not Relevant";
  let confidence = 10;
  let reason = "No meaningful identity signal detected";
  let metadata: IdentitySignal["metadata"] = {};

  if (
    platform &&
    (usernameFromUrlScore >= 0.85 ||
      (hasFullName && hasUsernameMention) ||
      hasUsernameMention)
  ) {
    type = "Verified Platform Match";
    confidence = Math.min(100, Math.round(82 + usernameFromUrlScore * 18));
    reason = `Strong profile identity signal found on ${platform}`;
    metadata = {
      exactMatch: usernameFromUrlScore >= 0.95 || hasUsernameMention,
      platformVerified: true,
      similarityScore: Math.round(usernameFromUrlScore * 100),
    };
  } else if (hasUsernameMention || (platform && usernameFromUrlScore >= 0.6)) {
    type = "Possible Identity Match";
    confidence = Math.max(
      50,
      Math.min(
        79,
        Math.round(52 + usernameFromUrlScore * 25 + (hasFullName ? 8 : 0)),
      ),
    );
    reason = `Partial identity signal found on ${platform ?? "a public source"}`;
    metadata = {
      partialMatch: true,
      platformVerified: Boolean(platform),
      similarityScore: Math.round(
        Math.max(usernameFromUrlScore, usernameContentScore) * 100,
      ),
    };
  } else if (Math.max(usernameFromUrlScore, usernameContentScore) >= 0.5) {
    type = "Username Similarity Detected";
    confidence = Math.max(
      50,
      Math.min(
        79,
        Math.round(
          50 + Math.max(usernameFromUrlScore, usernameContentScore) * 25,
        ),
      ),
    );
    reason = "Username pattern is similar to monitored identity";
    metadata = {
      similarityScore: Math.round(
        Math.max(usernameFromUrlScore, usernameContentScore) * 100,
      ),
      partialMatch: true,
      platformVerified: Boolean(platform),
    };
  } else if (hasFullName) {
    type = "Public Mention Detected";
    confidence = 35;
    reason = "Full name appears in public text with weak identity linkage";
    metadata = {
      exactMatch: true,
    };
  }

  let risk: RiskLevel = "Ignore";
  if (confidence >= 80) risk = "High Risk";
  else if (confidence >= 50) risk = "Medium Risk";
  else if (confidence >= 20) risk = "Low Risk";

  const cleanHandle = username.split("@")[0];
  let imageUrl: string | undefined = undefined;

  if (platform === "Twitter")
    imageUrl = `https://unavatar.io/twitter/${cleanHandle}`;
  else if (platform === "GitHub")
    imageUrl = `https://unavatar.io/github/${cleanHandle}`;
  else if (platform === "Reddit")
    imageUrl = `https://unavatar.io/reddit/${cleanHandle}`;
  else if (platform) imageUrl = `https://unavatar.io/${cleanHandle}`;

  return {
    type,
    platform,
    confidence,
    risk,
    reason,
    title: result.title,
    snippet: result.snippet,
    link: result.link,
    imageUrl,
    metadata,
  };
}

export function deduplicateSignals(
  signals: IdentitySignal[],
): IdentitySignal[] {
  const seen = new Set<string>();

  return signals.filter((signal) => {
    const key = `${signal.link.toLowerCase()}::${signal.platform ?? "Unknown"}`;
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export function analyzeSearchResults(
  results: SearchResultInput[],
  fullName: string,
  username: string,
  limit = 10,
): AnalysisResult {
  const classified = results.map((result) =>
    classifyResult(result, fullName, username),
  );

  const filtered = deduplicateSignals(classified)
    .filter(
      (signal) => signal.type !== "Not Relevant" && signal.risk !== "Ignore",
    )
    .sort((left, right) => right.confidence - left.confidence)
    .slice(0, limit);

  return {
    signals: filtered,
    summary: {
      totalResults: results.length,
      highRiskCount: filtered.filter((signal) => signal.risk === "High Risk")
        .length,
      mediumRiskCount: filtered.filter(
        (signal) => signal.risk === "Medium Risk",
      ).length,
      lowRiskCount: filtered.filter((signal) => signal.risk === "Low Risk")
        .length,
      averageConfidence: filtered.length
        ? Math.round(
            filtered.reduce((sum, signal) => sum + signal.confidence, 0) /
              filtered.length,
          )
        : 0,
    },
    timestamp: new Date(),
  };
}

export function getRiskEmoji(risk: RiskLevel): string {
  const riskMap: Record<RiskLevel, string> = {
    "High Risk": "🔴",
    "Medium Risk": "🟡",
    "Low Risk": "🟢",
    Ignore: "⚪",
  };

  return riskMap[risk];
}
