// src/lib/github.ts
// Simple wrapper for GitHub public events API – no auth required (rate‑limited to 60 requests per hour per IP).
// The free tier is sufficient for a demo or low‑traffic UI.

export interface GitHubEvent {
  id: string;
  type: string;
  repo: { name: string; url: string };
  created_at: string;
  // other fields omitted for brevity
}

export async function fetchPublicEvents(
  username: string,
): Promise<GitHubEvent[]> {
  const url = `https://api.github.com/users/${encodeURIComponent(username)}/events/public`;
  const resp = await fetch(url, {
    headers: {
      // GitHub recommends a user‑agent header
      "User-Agent": "E-Vara (github.com/SHAURYASANYAL3/E-vara)",
      Accept: "application/vnd.github+json",
    },
  });

  if (resp.status === 404) {
    // user not found – treat as empty list
    return [];
  }
  if (!resp.ok) {
    throw new Error(`GitHub API error ${resp.status}`);
  }
  const data = (await resp.json()) as GitHubEvent[];
  return data;
}
