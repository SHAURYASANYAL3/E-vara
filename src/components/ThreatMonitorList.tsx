import { useThreatMonitor } from "@/hooks/useThreatMonitor";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShieldCheck, Loader2, AlertTriangle } from "lucide-react";
import ThreatMonitorSkeleton from "@/components/ThreatMonitorSkeleton";

export const ThreatMonitorList = () => {
  const { data: findings = [], isLoading: loading, error } = useThreatMonitor();
  const isOffline = !!error;

if (loading) {
  return (
    <div className="p-6">
      <ThreatMonitorSkeleton />
    </div>
  );
}


  if (findings.length === 0) {
    return (
      <div className="space-y-4">
        {isOffline && (
          <div className="p-2 bg-destructive/10 border border-destructive/20 rounded text-[10px] text-destructive uppercase tracking-widest text-center animate-pulse">
            Database Offline: Displaying Cached Intelligence
          </div>
        )}
        <Card className="bg-background/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <ShieldCheck className="h-12 w-12 text-green-500/50 mb-4" />
            <CardTitle className="text-xl mb-2">Clean Bill of Health</CardTitle>
            <p className="text-muted-foreground max-w-xs">
              No exposures detected in this analysis window.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isOffline && (
        <div className="p-2 bg-destructive/10 border border-destructive/20 rounded text-[10px] text-destructive uppercase tracking-widest text-center animate-pulse">
          Database Offline: Displaying Cached Intelligence
        </div>
      )}
      <div className="flex items-center gap-2 mb-6">
        <AlertTriangle className="h-5 w-5 text-destructive" />
        <h2 className="text-xl font-semibold">Active Intelligence Findings</h2>
        <Badge variant="outline" className="ml-auto">
          {findings.length} Total
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {findings.map((finding) => (
          <Card
            key={finding.id}
            className="relative overflow-hidden border-l-4 border-l-destructive/50 hover:bg-accent/5 transition-colors"
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm font-bold leading-tight max-w-[70%]">
                  {finding.title}
                </CardTitle>
                <Badge
                  variant={
                    finding.severity === "critical" ||
                    finding.severity === "high"
                      ? "destructive"
                      : "secondary"
                  }
                  className="uppercase text-[10px]"
                >
                  {finding.severity}
                </Badge>
              </div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                Source: {finding.source}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {finding.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">
                  Detected: {new Date(finding.found_at).toLocaleDateString()}
                </span>
                <button className="text-[10px] font-bold text-primary hover:underline uppercase">
                  View Details
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
