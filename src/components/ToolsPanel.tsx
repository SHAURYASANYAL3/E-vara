import { useState } from "react";
import { Search, ExternalLink, AlertTriangle, Lock, Loader2, ShieldAlert, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BreachResult {
  source: string;
  breachName: string;
  breachDate: string;
  dataTypes: string[];
  severity: "low" | "medium" | "high";
  description: string;
}

interface ScanSummary {
  totalBreaches: number;
  sourcesChecked: number;
  highSeverity: number;
  mediumSeverity: number;
  lowSeverity: number;
}

interface ScanResponse {
  results: BreachResult[];
  summary: ScanSummary;
  scannedAt: string;
}

const SEVERITY_BADGE: Record<string, string> = {
  low: "text-[hsl(var(--severity-low))] bg-[hsl(var(--severity-low)/0.15)]",
  medium: "text-[hsl(var(--severity-medium))] bg-[hsl(var(--severity-medium)/0.15)]",
  high: "text-[hsl(var(--severity-high))] bg-[hsl(var(--severity-high)/0.15)]",
};

interface ToolsPanelProps {
  identity?: { fullName: string; username: string } | null;
}

const ToolsPanel = ({ identity }: ToolsPanelProps) => {
  const [scanning, setScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResponse | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  const runBreachScan = async () => {
    if (!identity?.fullName) return;
    setScanning(true);
    setScanError(null);
    setScanResults(null);

    try {
      const { data, error } = await supabase.functions.invoke("breach-check", {
        body: {
          email: identity.fullName.toLowerCase().replace(/\s/g, ".") + "@example.com",
          username: identity.username || identity.fullName.toLowerCase().replace(/\s/g, ""),
          fullName: identity.fullName,
        },
      });
      if (error) throw error;
      setScanResults(data as ScanResponse);
    } catch (e: any) {
      setScanError(e.message || "Scan failed. Please try again.");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Reverse Image Search */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <Search className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-mono font-semibold text-foreground uppercase tracking-wider">Reverse Image Search</h3>
        </div>
        <p className="mb-4 text-xs text-muted-foreground font-body">Check if your images are being used elsewhere online.</p>
        <div className="space-y-2">
          {[
            { name: "Google Lens", url: "https://lens.google.com" },
            { name: "Yandex Images", url: "https://yandex.com/images" },
            { name: "Bing Visual Search", url: "https://www.bing.com/visualsearch" },
          ].map((tool) => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-between rounded-md border border-border bg-secondary px-3 py-2.5 text-xs font-mono text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              {tool.name}
              <ExternalLink className="h-3 w-3" />
            </a>
          ))}
        </div>
      </div>

      {/* Report */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-mono font-semibold text-foreground uppercase tracking-wider">Reporting</h3>
        </div>
        <a
          href="https://cybercrime.gov.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-mono font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Report to Cybercrime
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Dark Web Breach Scan */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <Lock className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-mono font-semibold text-foreground uppercase tracking-wider">Dark Web Scan</h3>
        </div>
        <p className="mb-4 text-xs text-muted-foreground font-body">
          Scan multiple breach databases (HaveIBeenPwned, DeHashed, IntelX, LeakCheck, BreachDirectory) for exposed data.
        </p>

        {!identity?.fullName ? (
          <div className="rounded-md border border-border bg-secondary px-4 py-4 text-center">
            <p className="text-xs font-mono text-muted-foreground">Complete your identity profile to run a scan.</p>
          </div>
        ) : (
          <>
            <button
              onClick={runBreachScan}
              disabled={scanning}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-mono font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {scanning ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Scanning databases...
                </>
              ) : (
                <>
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Run Breach Scan
                </>
              )}
            </button>

            {scanError && (
              <div className="mt-3 rounded-md border border-[hsl(var(--severity-high)/0.3)] bg-[hsl(var(--severity-high)/0.1)] px-3 py-2">
                <p className="text-xs font-mono text-[hsl(var(--severity-high))]">{scanError}</p>
              </div>
            )}

            {scanResults && (
              <div className="mt-4 space-y-3">
                {/* Summary */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-md border border-border bg-secondary px-2 py-2 text-center">
                    <p className="text-lg font-mono font-bold text-foreground">{scanResults.summary.totalBreaches}</p>
                    <p className="text-[10px] font-mono text-muted-foreground">Breaches</p>
                  </div>
                  <div className="rounded-md border border-border bg-secondary px-2 py-2 text-center">
                    <p className="text-lg font-mono font-bold text-[hsl(var(--severity-high))]">{scanResults.summary.highSeverity}</p>
                    <p className="text-[10px] font-mono text-muted-foreground">High</p>
                  </div>
                  <div className="rounded-md border border-border bg-secondary px-2 py-2 text-center">
                    <p className="text-lg font-mono font-bold text-foreground">{scanResults.summary.sourcesChecked}</p>
                    <p className="text-[10px] font-mono text-muted-foreground">Sources</p>
                  </div>
                </div>

                {/* Results */}
                {scanResults.results.length === 0 ? (
                  <div className="rounded-md border border-border bg-secondary px-4 py-4 text-center">
                    <CheckCircle className="mx-auto mb-2 h-5 w-5 text-[hsl(var(--severity-low))]" />
                    <p className="text-xs font-mono text-foreground">No breaches found</p>
                    <p className="text-[10px] font-body text-muted-foreground mt-1">Your identity was not found in any scanned databases.</p>
                  </div>
                ) : (
                  <div className="max-h-[300px] space-y-2 overflow-y-auto pr-1">
                    {scanResults.results.map((result, i) => (
                      <div
                        key={`${result.breachName}-${result.source}-${i}`}
                        className="rounded-md border border-border bg-secondary p-3"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <p className="text-xs font-mono font-semibold text-foreground">{result.breachName}</p>
                          <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-mono uppercase ${SEVERITY_BADGE[result.severity]}`}>
                            {result.severity}
                          </span>
                        </div>
                        <p className="text-[10px] font-body text-muted-foreground mb-1.5">{result.description}</p>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex flex-wrap gap-1">
                            {result.dataTypes.map(t => (
                              <span key={t} className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground">
                                {t}
                              </span>
                            ))}
                          </div>
                          <span className="text-[10px] font-mono text-muted-foreground shrink-0">{result.source}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-[10px] font-mono text-muted-foreground text-center">
                  Scanned at {new Date(scanResults.scannedAt).toLocaleString()}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ToolsPanel;
