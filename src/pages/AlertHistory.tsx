import { ExternalLink, ArrowLeft, Clock, Download, FileText } from "lucide-react";
import type { AlertItem, AlertSeverity } from "@/components/MonitoringFeed";

interface AlertHistoryProps {
  alerts: AlertItem[];
  onBack: () => void;
}

const SEVERITY_BADGE: Record<AlertSeverity, string> = {
  low: "text-[hsl(var(--severity-low))] bg-[hsl(var(--severity-low)/0.15)]",
  medium: "text-[hsl(var(--severity-medium))] bg-[hsl(var(--severity-medium)/0.15)]",
  high: "text-[hsl(var(--severity-high))] bg-[hsl(var(--severity-high)/0.15)]",
};

const SEVERITY_BORDER: Record<AlertSeverity, string> = {
  low: "border-l-[hsl(var(--severity-low))]",
  medium: "border-l-[hsl(var(--severity-medium))]",
  high: "border-l-[hsl(var(--severity-high))]",
};

const exportCSV = (alerts: AlertItem[]) => {
  const header = "ID,Severity,Message,Query,Timestamp\n";
  const rows = alerts.map(a =>
    `${a.id},"${a.severity}","${a.message.replace(/"/g, '""')}","${a.query}","${a.timestamp.toISOString()}"`
  ).join("\n");
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
    body: alerts.map(a => [
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

const AlertHistory = ({ alerts, onBack }: AlertHistoryProps) => {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 sm:px-6">
          <button onClick={onBack} className="rounded-md p-1.5 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-sm font-mono font-bold text-foreground tracking-tight">Alert History</h1>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs font-mono text-muted-foreground hidden sm:inline">{alerts.length} alerts</span>
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
            <p className="text-sm font-mono text-muted-foreground">No alerts recorded yet.</p>
            <p className="mt-1 text-xs font-body text-muted-foreground">Start monitoring to generate alerts.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {alerts.map((alert, i) => (
              <div
                key={alert.id}
                className={`rounded-md border border-border border-l-2 ${SEVERITY_BORDER[alert.severity]} bg-card p-3 sm:p-4 animate-fade-in`}
                style={{ animationDelay: `${Math.min(i * 30, 300)}ms`, animationFillMode: "both" }}
              >
                <div className="mb-2 flex items-start justify-between gap-2 sm:gap-4">
                  <p className="text-xs font-body text-foreground">{alert.message}</p>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-mono uppercase ${SEVERITY_BADGE[alert.severity]}`}>
                      {alert.severity}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap hidden sm:inline">
                      {alert.timestamp.toLocaleDateString()} {alert.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
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
