import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

type RiskLevel = "low" | "medium" | "high";

interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  summary: string;
  details: string;
  risk: RiskLevel;
}

const EVENTS: TimelineEvent[] = [
  {
    id: "zynga-2019",
    timestamp: "Oct 2019",
    title: "Zynga credential exposure correlation",
    summary: "Email footprint matched with known gaming leak dataset.",
    details:
      "The monitored email alias appears in historical breach artifacts tied to Zynga's 2019 incident. Password reset and MFA audit recommended.",
    risk: "high",
  },
  {
    id: "activity-2020",
    timestamp: "Jun 2020",
    title: "Unusual platform activity cluster",
    summary: "Rapid account lookups observed across social channels.",
    details:
      "Open-source traces indicate username reconnaissance from multiple low-reputation profiles within a 36-hour period.",
    risk: "medium",
  },
  {
    id: "linkedin-2021",
    timestamp: "Apr 2021",
    title: "LinkedIn dataset mention",
    summary:
      "Identity attributes appeared in professional network dump mentions.",
    details:
      "Public records suggest first/last name and profile URL associations in scraped LinkedIn records. Validate profile visibility settings.",
    risk: "medium",
  },
  {
    id: "mentions-2025",
    timestamp: "Jan 2025",
    title: "Identity mention escalation",
    summary: "More third-party references detected in indexing feeds.",
    details:
      "Mentions increased across forum snapshots and repost mirrors, raising impersonation and spear-phishing exposure risk.",
    risk: "high",
  },
];

const RISK_STYLES: Record<RiskLevel, string> = {
  low: "border-[hsl(var(--severity-low)/0.45)] text-[hsl(var(--severity-low))]",
  medium:
    "border-[hsl(var(--severity-medium)/0.45)] text-[hsl(var(--severity-medium))]",
  high: "border-[hsl(var(--severity-high)/0.45)] text-[hsl(var(--severity-high))]",
};

export const TimelineView = () => {
  const [openId, setOpenId] = useState<string>(EVENTS[0].id);

  return (
    <section className="neon-panel relative overflow-hidden rounded-xl border border-border/80 bg-card/70 p-5 backdrop-blur-md">
      <div className="scan-line" />
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-foreground">
        Identity Timeline
      </h3>
      <div className="space-y-3">
        {EVENTS.map((event) => {
          const isOpen = openId === event.id;
          return (
            <div
              key={event.id}
              className="relative rounded-lg border border-border/70 bg-secondary/30 p-3 transition-all"
            >
              <div className="absolute left-0 top-3 h-[calc(100%-1.5rem)] w-0.5 bg-gradient-to-b from-primary/60 to-purple-400/30" />
              <button
                onClick={() => setOpenId(isOpen ? "" : event.id)}
                className="flex w-full items-start justify-between gap-3 text-left"
              >
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    {event.timestamp}
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {event.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {event.summary}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-md border px-2 py-0.5 text-[10px] uppercase ${RISK_STYLES[event.risk]}`}
                  >
                    {event.risk}
                  </span>
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 text-primary" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-primary" />
                  )}
                </div>
              </button>
              {isOpen && (
                <p className="mt-3 border-t border-border/60 pt-3 text-xs text-muted-foreground">
                  {event.details}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
