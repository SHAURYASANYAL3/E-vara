// src/components/GitHubEventsCard.tsx
// Displays recent public GitHub events for a given username using the free GitHub public events API.
// Free tier limit: 60 requests per hour per IP (standard unauthenticated rate limit).

import { useEffect, useState } from "react";
import { fetchPublicEvents, GitHubEvent } from "@/lib/github";
import { Activity, Clock } from "lucide-react";

interface Props {
  username: string;
}

export const GitHubEventsCard = ({ username }: Props) => {
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    void (async () => {
      try {
        const data = await fetchPublicEvents(username);
        setEvents(data.slice(0, 5)); // show latest 5 events
        setError(null);
      } catch (e) {
        setError((e as Error).message);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [username]);

  if (!username) return null;

  return (
    <article className="rounded-lg border border-primary/20 bg-primary/5 p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="flex items-center gap-1 text-sm font-medium text-foreground">
          <Activity className="h-4 w-4" /> GitHub Activity
        </h4>
        <p className="text-xs text-muted-foreground">Rate limit: 60 req/h</p>
      </div>

      {loading && <p className="text-xs text-muted-foreground">Loading…</p>}
      {error && <p className="text-xs text-red-500">Error: {error}</p>}

      {!loading && !error && events.length === 0 && (
        <p className="text-xs text-muted-foreground">
          No recent public activity.
        </p>
      )}

      <ul className="space-y-2 text-xs">
        {events.map((ev) => (
          <li key={ev.id} className="border-b border-muted/20 pb-1">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="font-medium">{ev.type}</span>
              <a
                href={ev.repo.url.replace("api.github.com/repos", "github.com")}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                {ev.repo.name}
              </a>
            </div>
            <p className="ml-5 text-muted-foreground">
              {new Date(ev.created_at).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </article>
  );
};
