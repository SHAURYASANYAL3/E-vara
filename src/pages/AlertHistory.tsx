import { ArrowLeft, ShieldAlert } from "lucide-react";
import type { AlertItem, AlertSeverity } from "@/components/MonitoringFeed";

interface AlertHistoryProps {
  alerts: AlertItem[];
  onBack: () => void;
}

const SEVERITY_BADGE: Record<AlertSeverity, string> = {
  low: "text-yellow-300 bg-yellow-400/10",
  medium: "text-orange-300 bg-orange-400/10",
  high: "text-red-300 bg-red-500/10",
};

const ACTIONS: Record<AlertSeverity, string> = {
  low: "Review account activity and rotate weak passwords.",
  medium: "Enable additional verification and audit connected apps.",
  high: "Enable 2FA immediately and lock suspicious sessions.",
};

const EXPLAIN: Record<AlertSeverity, string> = {
  low: "Minor anomaly observed in monitored metadata.",
  medium: "Suspicious behavior pattern matched known threat signatures.",
  high: "High-confidence malicious indicator tied to identity misuse.",
};

const THREAT_GUIDANCE: Record<
  AlertSeverity,
  { type: string; explanation: string; action: string }
> = {
  low: {
    type: "Suspicious Metadata Drift",
    explanation: "Minor anomalies were found in indexed identity records.",
    action: "Revalidate public profile visibility settings.",
  },
  medium: {
    type: "Credential Threat Activity",
    explanation: "Potential reuse patterns suggest elevated exposure risk.",
    action: "Rotate passwords and enable multi-factor authentication.",
  },
  high: {
    type: "Suspicious Login Attempt",
    explanation:
      "High-confidence signal indicates unauthorized access attempts.",
    action: "Enable 2FA immediately and review active sessions.",
  },
};

const actionBySeverity: Record<AlertSeverity, string> = {
  low: "Review account activity and update passwords for inactive services.",
  medium: "Enable MFA and revoke unknown sessions on linked services.",
  high: "Suspicious login attempt detected. Recommended: Enable 2FA immediately.",
};

const exportCSV = (alerts: AlertItem[]) => {
  const header = "ID,Severity,Message,Query,Timestamp\n";
  const rows = alerts
    .map(
      (a) =>
        `${a.id},"${a.severity}","${a.message.replace(/"/g, '""')}","${a.query}","${a.timestamp.toISOString()}"`,
    )
    .join("\n");
  const blob = new Blob([header + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `evara-alerts-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

const exportPDF = async (alerts: AlertItem[]) => {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("E-Vara Alert History", 14, 20);
  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

  autoTable(doc, {
    startY: 35,
    head: [["#", "Severity", "Message", "Query", "Timestamp"]],
    body: alerts.map((a) => [
      a.id,
      a.severity.toUpperCase(),
      a.message,
      a.query,
      `${a.timestamp.toLocaleDateString()} ${a.timestamp.toLocaleTimeString()}`,
    ]),
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [30, 41, 59] },
  });

  doc.save(`evara-alerts-${new Date().toISOString().slice(0, 10)}.pdf`);
};

const recommendations: Record<AlertSeverity, string> = {
  low: "Recommended: Review activity and keep monitoring enabled.",
  medium: "Recommended: Update passwords and enable security alerts.",
  high: "Recommended: Enable 2FA immediately and revoke suspicious sessions.",
};

const alertType = (msg: string) => {
  if (/login|sign in|credential/i.test(msg))
    return "Suspicious login attempt detected";
  if (/breach|leak|dump/i.test(msg)) return "Potential data exposure event";
  return "Anomalous identity activity detected";
};

const AlertHistory = ({ alerts, onBack }: AlertHistoryProps) => {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 sm:px-6">
          <button
            onClick={onBack}
            className="rounded-md p-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-sm font-mono font-bold text-foreground tracking-tight">
            Alert History
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground hidden sm:inline">
              {alerts.length} alerts
            </span>
            {alerts.length > 0 && (
              <>
                <button
                  onClick={() => exportCSV(alerts)}
                  className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary px-2 py-1 text-[10px] sm:text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Download className="h-3 w-3" />
                  <span className="hidden sm:inline">CSV</span>
                </button>
                <button
                  onClick={() => exportPDF(alerts)}
                  className="inline-flex items-center gap-1 rounded-md border border-border bg-secondary px-2 py-1 text-[10px] sm:text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
                >
                  <FileText className="h-3 w-3" />
                  <span className="hidden sm:inline">PDF</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        {alerts.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-12 text-center">
            <Clock className="mx-auto mb-3 h-6 w-6 text-muted-foreground" />
            <p className="text-sm font-mono text-muted-foreground">
              No alerts recorded yet.
            </p>
            <p className="mt-1 text-xs font-body text-muted-foreground">
              Start monitoring to generate alerts.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {alerts.map((alert, i) => (
              <div
                key={alert.id}
                className={`rounded-md border border-border border-l-2 ${SEVERITY_BORDER[alert.severity]} bg-card p-3 sm:p-4 animate-fade-in`}
                style={{
                  animationDelay: `${Math.min(i * 30, 300)}ms`,
                  animationFillMode: "both",
                }}
              >
                <div className="mb-2 flex items-start justify-between gap-2 sm:gap-4">
                  <p className="text-xs font-body text-foreground">
                    {alertType(alert.message)}
                  </p>
                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-mono uppercase ${SEVERITY_BADGE[alert.severity]}`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap hidden sm:inline">
                      {alert.timestamp.toLocaleDateString()}{" "}
                      {alert.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <p className="mb-2 text-xs text-muted-foreground">
                  {alert.message}
                </p>
                <p className="mb-3 text-xs text-primary">
                  {recommendations[alert.severity]}
                </p>
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
                  <span className="ml-auto text-[10px] font-mono text-muted-foreground sm:hidden">
                    {alert.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AlertHistory;
