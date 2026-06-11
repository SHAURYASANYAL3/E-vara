interface ThreatLevelIndicatorProps {
  score: number;
}

const LEVELS = [
  {
    name: "DEFCON 5",
    min: 0,
    max: 20,
    color: "hsl(var(--severity-low))",
    glow: "shadow-[0_0_24px_hsl(var(--severity-low)/0.35)]",
  },
  {
    name: "DEFCON 4",
    min: 21,
    max: 40,
    color: "hsl(var(--severity-low))",
    glow: "shadow-[0_0_24px_hsl(var(--severity-low)/0.35)]",
  },
  {
    name: "DEFCON 3",
    min: 41,
    max: 60,
    color: "hsl(var(--severity-medium))",
    glow: "shadow-[0_0_24px_hsl(var(--severity-medium)/0.35)]",
  },
  {
    name: "DEFCON 2",
    min: 61,
    max: 80,
    color: "hsl(var(--severity-high))",
    glow: "shadow-[0_0_24px_hsl(var(--severity-high)/0.35)]",
  },
  {
    name: "DEFCON 1",
    min: 81,
    max: 100,
    color: "hsl(var(--severity-high))",
    glow: "shadow-[0_0_24px_hsl(var(--severity-high)/0.45)]",
  },
];

const ThreatLevelIndicator = ({ score }: ThreatLevelIndicatorProps) => {
  const current =
    LEVELS.find((level) => score >= level.min && score <= level.max) ??
    LEVELS[0];

  return (
    <section className="neon-panel relative overflow-hidden rounded-xl border border-primary/25 p-4 sm:p-5">
      <div className="scanline" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
            Global Threat Level
          </p>
          <h2 className="text-sm font-mono font-semibold text-foreground sm:text-base">
            {current.name} • Active Monitoring Grid
          </h2>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex gap-2 items-center">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-black/40 text-cyan-400 border-cyan-400/50">
              REFRESHING
            </span>
            <div
              className={`rounded-full border border-border px-3 py-1 text-xs font-mono ${current.glow}`}
              style={{ color: current.color }}
            >
              Risk Snapshot {score}/100
            </div>
          </div>
          <div className="flex items-center gap-3 text-[9px] font-mono uppercase text-muted-foreground mt-1">
            <span>Confidence: 96%</span>
            <span>Evidence: High</span>
            <span>Updated: 12s ago</span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-5 gap-2">
        {LEVELS.map((level) => {
          const isActive = level.name === current.name;
          return (
            <div
              key={level.name}
              className={`rounded-md border px-2 py-2 text-center text-[10px] font-mono transition-all ${isActive ? "border-primary/60 bg-primary/10" : "border-border bg-secondary/40"}`}
            >
              <p className="font-semibold" style={{ color: level.color }}>
                {level.name}
              </p>
              <div className="mt-1 h-1 rounded-full bg-border/40">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(100, Math.max(20, score))}%`,
                    backgroundColor: level.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ThreatLevelIndicator;
