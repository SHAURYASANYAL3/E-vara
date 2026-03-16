import { useState, useEffect, useCallback, useRef } from "react";
import { Activity, ExternalLink } from "lucide-react";

export type AlertSeverity = "low" | "medium" | "high";

export interface AlertItem {
  id: number;
  message: string;
  query: string;
  timestamp: Date;
  isNew: boolean;
  severity: AlertSeverity;
}

interface MonitoringFeedProps {
  fullName: string;
  username: string;
  keywords: string;
  onAlertsChange?: (alerts: AlertItem[]) => void;
  onMonitoringChange?: (active: boolean, startTime: Date | null) => void;
}

const TEMPLATES: { text: string; severity: AlertSeverity }[] = [
  { text: "Potential identity mention detected for: {query}", severity: "medium" },
  { text: "Possible profile reference found for: {query}", severity: "low" },
  { text: "Username match identified for: {query}", severity: "high" },
  { text: "Social mention flagged for: {query}", severity: "low" },
  { text: "Content similarity detected for: {query}", severity: "medium" },
  { text: "Suspicious account activity detected for: {query}", severity: "high" },
  { text: "Public data exposure flagged for: {query}", severity: "high" },
  { text: "Minor keyword match for: {query}", severity: "low" },
];

const SEVERITY_STYLES: Record<AlertSeverity, string> = {
  low: "border-l-[hsl(var(--severity-low))]",
  medium: "border-l-[hsl(var(--severity-medium))]",
  high: "border-l-[hsl(var(--severity-high))]",
};

const SEVERITY_DOT: Record<AlertSeverity, string> = {
  low: "bg-[hsl(var(--severity-low))]",
  medium: "bg-[hsl(var(--severity-medium))]",
  high: "bg-[hsl(var(--severity-high))]",
};

const SEVERITY_BADGE: Record<AlertSeverity, string> = {
  low: "text-[hsl(var(--severity-low))] bg-[hsl(var(--severity-low)/0.15)]",
  medium: "text-[hsl(var(--severity-medium))] bg-[hsl(var(--severity-medium)/0.15)]",
  high: "text-[hsl(var(--severity-high))] bg-[hsl(var(--severity-high)/0.15)]",
};

const MonitoringFeed = ({ fullName, username, keywords, onAlertsChange, onMonitoringChange }: MonitoringFeedProps) => {
  const [monitoring, setMonitoring] = useState(false);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const counterRef = useRef(0);

  const queries = [fullName, username, ...(keywords ? keywords.split(",").map(k => k.trim()).filter(Boolean) : [])].filter(Boolean);

  const generateAlert = useCallback(() => {
    const query = queries[Math.floor(Math.random() * queries.length)] || fullName;
    const template = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
    counterRef.current += 1;
    const alert: AlertItem = {
      id: counterRef.current,
      message: template.text.replace("{query}", query),
      query,
      timestamp: new Date(),
      isNew: true,
      severity: template.severity,
    };
    setAlerts(prev => {
      const updated = [alert, ...prev].slice(0, 50);
      onAlertsChange?.(updated);
      return updated;
    });
    setTimeout(() => {
      setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, isNew: false } : a));
    }, 3000);
  }, [fullName, queries, onAlertsChange]);

  const toggleMonitoring = () => {
    if (monitoring) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = null;
      setMonitoring(false);
      onMonitoringChange?.(false, null);
    } else {
      setMonitoring(true);
      onMonitoringChange?.(true, new Date());
      generateAlert();
      intervalRef.current = setInterval(generateAlert, 8000);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="rounded-lg border border-border bg-card p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Activity className="h-4 w-4 shrink-0 text-primary" />
          <h3 className="text-xs sm:text-sm font-mono font-semibold text-foreground uppercase tracking-wider truncate">Monitoring</h3>
        </div>
        <button
          onClick={toggleMonitoring}
          className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-mono font-medium transition-all ${
            monitoring
              ? "bg-secondary text-muted-foreground hover:text-foreground"
              : "bg-primary text-primary-foreground hover:opacity-90"
          }`}
        >
          {monitoring ? "Stop" : "Start"}
        </button>
      </div>

      {monitoring && (
        <div className="mb-4 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
          </span>
          <span className="text-xs font-mono text-muted-foreground">Live monitoring active</span>
        </div>
      )}

      <div className="max-h-[400px] space-y-2 overflow-y-auto pr-1">
        {alerts.length === 0 ? (
          <p className="py-8 text-center text-xs text-muted-foreground font-body">
            {monitoring ? "Scanning for mentions..." : "Start monitoring to receive alerts"}
          </p>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`relative rounded-md border border-border border-l-2 ${SEVERITY_STYLES[alert.severity]} bg-secondary p-3 transition-all ${alert.isNew ? "alert-wave" : ""}`}
            >
              {alert.isNew && (
                <span className={`alert-pulse-dot absolute right-3 top-3 h-1.5 w-1.5 rounded-full ${SEVERITY_DOT[alert.severity]}`} />
              )}
              <div className="mb-2 flex items-start justify-between gap-2">
                <p className="text-xs font-body text-foreground">{alert.message}</p>
                <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-mono uppercase ${SEVERITY_BADGE[alert.severity]}`}>
                  {alert.severity}
                </span>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(alert.query)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-mono text-primary hover:underline"
                >
                  Google <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href={`https://www.bing.com/search?q=${encodeURIComponent(alert.query)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-mono text-primary hover:underline"
                >
                  Bing <ExternalLink className="h-3 w-3" />
                </a>
                <span className="ml-auto text-[10px] font-mono text-muted-foreground">
                  {alert.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MonitoringFeed;
