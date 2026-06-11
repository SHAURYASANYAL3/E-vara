import { BrainCircuit, AlertTriangle, ShieldCheck } from "lucide-react";

interface AIInsightPanelProps {
  score: number;
  alertCount: number;
}

const AIInsightPanel = ({ score, alertCount }: AIInsightPanelProps) => {
  const breachWeight = Math.min(100, 30 + alertCount * 8);
  const platformExposure = Math.min(100, score + 12);
  const anomalies = Math.min(100, score - 6);

  const recommendations = [
    {
      text: "Enable hardware-based 2FA on primary email accounts.",
      level: "CRITICAL",
    },
    {
      text: "Rotate SHA-256 identity hashes for session anonymity.",
      level: "RECOMMENDED",
    },
    {
      text: "Scrub public metadata from 3 linked social profiles.",
      level: "MODERATE",
    },
  ];

  return (
    <section className="neon-panel rounded-xl border border-primary/20 p-4 sm:p-5 bg-[#0A0C10]/80 backdrop-blur-md">
      <div className="flex items-center gap-2 mb-4">
        <BrainCircuit className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-foreground">
          Cognitive Intelligence Suite
        </h3>
      </div>

      <p className="text-[10px] leading-relaxed text-muted-foreground font-mono">
        <span className="text-primary font-bold">ANALYSIS_REPORT:</span> High
        exposure detected across 4 platforms. Primary vulnerability identified:
        persistent reuse of high-entropy email markers and public cross-platform
        alias correlation.
      </p>

      <div className="mt-6 grid gap-3">
        {[
          {
            label: "Breach Data Density",
            value: breachWeight,
            color: "bg-primary",
          },
          {
            label: "Platform Exposure Index",
            value: platformExposure,
            color: "bg-primary",
          },
          {
            label: "Predictive Anomalies",
            value: anomalies,
            color: "bg-primary",
          },
        ].map((item) => (
          <div key={item.label}>
            <div className="flex justify-between items-center mb-1">
              <p className="text-[9px] font-mono uppercase text-muted-foreground">
                {item.label}
              </p>
              <p className="text-[10px] font-bold text-foreground font-mono">
                {item.value}/100
              </p>
            </div>
            <div className="h-1 rounded-full bg-white/5">
              <div
                className={`h-full rounded-full ${item.color}`}
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-3">
        <h4 className="text-[10px] font-mono font-bold uppercase text-primary/80 tracking-widest border-b border-white/5 pb-2">
          Strategic Recommendations
        </h4>
        {recommendations.map((rec, i) => (
          <div
            key={i}
            className="flex gap-3 p-2 rounded border border-white/5 bg-white/[0.01]"
          >
            {rec.level === "CRITICAL" ? (
              <AlertTriangle className="h-3 w-3 text-destructive shrink-0" />
            ) : (
              <ShieldCheck className="h-3 w-3 text-primary shrink-0" />
            )}
            <div>
              <p className="text-[10px] font-bold text-foreground leading-tight uppercase tracking-tighter">
                {rec.level}
              </p>
              <p className="text-[9px] text-muted-foreground mt-0.5">
                {rec.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AIInsightPanel;
