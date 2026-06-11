import { useMemo, useState } from "react";

interface DigitalFootprintMapProps {
  username: string;
}

const platformNodes = [
  { id: "github", label: "GitHub", x: 50, y: 12, risk: 45 },
  { id: "instagram", label: "Instagram", x: 84, y: 35, risk: 71 },
  { id: "twitter", label: "Twitter/X", x: 80, y: 72, risk: 58 },
  { id: "linkedin", label: "LinkedIn", x: 20, y: 70, risk: 36 },
  { id: "reddit", label: "Reddit", x: 16, y: 30, risk: 62 },
];

const DigitalFootprintMap = ({ username }: DigitalFootprintMapProps) => {
  const [selectedNode, setSelectedNode] = useState(platformNodes[0]);

  const links = useMemo(
    () =>
      platformNodes.map((node) => ({
        ...node,
        intensity: Math.max(1, Math.round(node.risk / 25)),
      })),
    [],
  );

  return (
    <section className="neon-panel rounded-xl border border-primary/20 p-4 sm:p-5">
      <h3 className="mb-4 text-sm font-mono font-semibold uppercase tracking-wider text-foreground">
        Digital Footprint Map
      </h3>
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="relative h-72 rounded-lg border border-border/70 bg-background/35 p-3">
          <div className="absolute inset-0 hud-grid opacity-40" />

          <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
            <button className="node-core h-16 w-16 rounded-full border border-primary/70 bg-primary/15 text-[11px] font-mono text-primary shadow-[0_0_30px_rgba(255,106,26,0.3)] animate-pulse">
              @{username || "identity"}
            </button>
          </div>

          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {links.map((node) => (
              <line
                key={node.id}
                x1="50"
                y1="50"
                x2={node.x}
                y2={node.y}
                stroke={
                  node.risk > 65
                    ? "hsl(var(--severity-high))"
                    : node.risk > 45
                      ? "hsl(var(--severity-medium))"
                      : "hsl(var(--primary))"
                }
                strokeOpacity="0.4"
                strokeWidth={node.intensity * 0.35}
                className="animate-pulse"
              />
            ))}
          </svg>

          {platformNodes.map((node) => (
            <button
              key={node.id}
              type="button"
              onClick={() => setSelectedNode(node)}
              className={`node-platform absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-surface/90 px-3 py-1 text-[9px] font-mono text-foreground hover:border-primary/50 transition-all ${selectedNode.id === node.id ? "border-primary/60 security-orange-glow" : ""}`}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              {node.label}
            </button>
          ))}
        </div>

        <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Node Analysis
          </p>
          <h4 className="mt-1 text-sm font-bold text-foreground uppercase tracking-wider">
            {selectedNode.label}
          </h4>
          <p className="mt-2 text-[11px] text-muted-foreground font-mono">
            Status: {selectedNode.risk > 60 ? "HIGH_EXPOSURE" : "MONITORED"}
          </p>

          <div className="mt-4 space-y-3">
            <div className="flex justify-between text-[9px] font-mono">
              <span className="text-muted-foreground uppercase">
                Correlation Strength
              </span>
              <span className="text-primary">{selectedNode.risk}%</span>
            </div>
            <div className="h-1 rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-1000"
                style={{ width: `${selectedNode.risk}%` }}
              />
            </div>
          </div>
          <p className="mt-4 text-[10px] text-muted-foreground leading-relaxed italic">
            Intelligence markers suggest a strong link between @
            {username || "target"} and the {selectedNode.label} profile.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DigitalFootprintMap;
