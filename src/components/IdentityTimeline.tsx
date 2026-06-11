import { useState } from "react";
import { ChevronDown, ChevronUp, Clock, ShieldCheck } from "lucide-react";
import { useThreatMonitor } from "@/hooks/useThreatMonitor";

interface IdentityTimelineProps {
  fullName: string;
}

const RISK_STYLE = {
  low: "border-[hsl(var(--severity-low)/0.4)] text-[hsl(var(--severity-low))]",
  medium:
    "border-[hsl(var(--severity-medium)/0.4)] text-[hsl(var(--severity-medium))]",
  high: "border-[hsl(var(--severity-high)/0.4)] text-[hsl(var(--severity-high))]",
  critical:
    "border-[hsl(var(--severity-high)/0.8)] text-[hsl(var(--severity-high))]",
};

const IdentityTimeline = ({ fullName }: IdentityTimelineProps) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const { data: findings, isLoading, error } = useThreatMonitor();

  if (error) {
    return null; // Fail gracefully
  }

  return (
    <section className="neon-panel rounded-xl border border-primary/20 p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-mono font-semibold uppercase tracking-wider text-foreground">
          Identity Event Timeline
        </h3>
        <Clock className="h-4 w-4 text-muted-foreground" />
      </div>

      {isLoading ? (
        <div className="flex justify-center p-4">
          <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      ) : !findings || findings.length === 0 ? (
        <div className="rounded-lg border border-[hsl(var(--severity-low)/0.2)] bg-[hsl(var(--severity-low)/0.05)] p-6 text-center">
          <ShieldCheck className="h-6 w-6 text-[hsl(var(--severity-low))] mx-auto mb-2 opacity-80" />
          <p className="text-sm text-[hsl(var(--severity-low))] font-medium">
            No Historical Events
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Identity record is clean.
          </p>
        </div>
      ) : (
        <div className="space-y-3 animate-fade-in">
          {findings.map((event) => {
            const isOpen = expanded === event.id;
            return (
              <article
                key={event.id}
                className="rounded-lg border border-border/80 bg-secondary/30 p-3 hover:border-primary/30 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : event.id)}
                  className="flex w-full items-center justify-between gap-3 text-left"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div
                      className={`h-2.5 w-2.5 rounded-full shrink-0 ${event.severity === "high" || event.severity === "critical" ? "bg-[hsl(var(--severity-high))]" : event.severity === "medium" ? "bg-[hsl(var(--severity-medium))]" : "bg-[hsl(var(--severity-low))]"}`}
                    />
                    <div className="truncate">
                      <p className="text-xs font-medium text-foreground truncate">
                        {event.title}
                      </p>
                      <p className="text-[10px] font-mono text-muted-foreground">
                        {new Date(event.found_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`rounded border px-2 py-0.5 text-[10px] font-mono uppercase ${RISK_STYLE[event.severity]}`}
                    >
                      {event.severity}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </button>
                {isOpen && (
                  <p className="mt-3 text-xs text-muted-foreground animate-fade-in border-t border-border/50 pt-2">
                    {event.description}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default IdentityTimeline;
