import { useMemo, useState, useEffect, useRef } from "react";
import {
  AlertTriangle,
  Bot,
  ChevronDown,
  ChevronUp,
  Cpu,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

interface CyberIntelligencePanelProps {
  fullName: string;
  username: string;
  alertCount: number;
  monitoringActive: boolean;
}

type RiskTone = "low" | "medium" | "high";

type TimelineEvent = {
  id: number;
  title: string;
  detail: string;
  timestamp: string;
  risk: RiskTone;
};

type PlatformNode = {
  id: string;
  label: string;
  exposure: number;
  x: number;
  y: number;
};

type AttackStep = {
  id: number;
  title: string;
  description: string;
  weakPoint?: boolean;
};

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 1,
    title: "Zynga breach reference indexed",
    detail: "Credential hash mention associated with reused username pattern.",
    timestamp: "Dec 12, 2019 · 02:14 UTC",
    risk: "high",
  },
  {
    id: 2,
    title: "GitHub profile activity spike",
    detail:
      "Unexpected repository watch/follow growth detected in 6-hour window.",
    timestamp: "Mar 09, 2020 · 16:40 UTC",
    risk: "medium",
  },
  {
    id: 3,
    title: "LinkedIn credential mention",
    detail:
      "Public paste fragment appears to contain profile and email pairings.",
    timestamp: "Jul 03, 2021 · 08:22 UTC",
    risk: "high",
  },
  {
    id: 4,
    title: "Cross-platform identity mention",
    detail: "Handle variation appears in OSINT forum thread and social repost.",
    timestamp: "Nov 14, 2024 · 10:31 UTC",
    risk: "medium",
  },
];

const PLATFORM_GRAPH: PlatformNode[] = [
  { id: "github", label: "GitHub", exposure: 77, x: 20, y: 26 },
  { id: "instagram", label: "Instagram", exposure: 62, x: 77, y: 22 },
  { id: "x", label: "X / Twitter", exposure: 53, x: 84, y: 62 },
  { id: "linkedin", label: "LinkedIn", exposure: 69, x: 35, y: 78 },
  { id: "reddit", label: "Reddit", exposure: 34, x: 10, y: 60 },
];

const ATTACK_STEPS: AttackStep[] = [
  {
    id: 1,
    title: "Email Enumeration",
    description: "Attacker correlates leaked email from public breach corpus.",
    weakPoint: true,
  },
  {
    id: 2,
    title: "GitHub Correlation",
    description: "Username and commit metadata reveal timezone and aliases.",
  },
  {
    id: 3,
    title: "Instagram Pivot",
    description:
      "Same alias and avatar pattern tie social identity to personal photos.",
    weakPoint: true,
  },
  {
    id: 4,
    title: "Leak Confirmation",
    description:
      "Cross-reference with dumped credential pair list confirms account reuse.",
    weakPoint: true,
  },
];

const CHAT_RESPONSES: Record<string, string> = {
  exposure:
    "Your highest exposure appears on GitHub and LinkedIn due to profile metadata overlap and historical breach references.",
  reduce:
    "Start with unique emails per platform, tighten social visibility, rotate credentials, and enable MFA everywhere.",
};

const riskClass: Record<RiskTone, string> = {
  low: "text-[hsl(var(--severity-low))] border-[hsl(var(--severity-low)/0.35)] bg-[hsl(var(--severity-low)/0.08)]",
  medium:
    "text-[hsl(var(--severity-medium))] border-[hsl(var(--severity-medium)/0.35)] bg-[hsl(var(--severity-medium)/0.08)]",
  high: "text-[hsl(var(--severity-high))] border-[hsl(var(--severity-high)/0.35)] bg-[hsl(var(--severity-high)/0.08)]",
};

const CircleMetric = ({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: RiskTone;
}) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="glass-panel interactive-panel p-3 text-center">
      <svg className="mx-auto h-24 w-24 -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="hsl(var(--border))"
          strokeWidth="8"
          fill="transparent"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke={`hsl(var(--severity-${tone}))`}
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <p className="-mt-14 text-xl font-bold tabular-nums">{value}</p>
      <p className="mt-6 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
    </div>
  );
};

const CyberIntelligencePanel = ({
  fullName,
  username,
  alertCount,
  monitoringActive,
}: CyberIntelligencePanelProps) => {
  const [expandedEvent, setExpandedEvent] = useState<number | null>(1);
  const [selectedNode, setSelectedNode] = useState<PlatformNode | null>(
    PLATFORM_GRAPH[0],
  );
  const [simulating, setSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: "user" | "assistant"; text: string }>
  >([
    {
      role: "assistant",
      text: "Ask E-Vara about exposure patterns or mitigation guidance.",
    },
  ]);
  const [typing, setTyping] = useState(false);

  const timeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      // Clean up all active timeouts on unmount
      timeoutsRef.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const riskScore = useMemo(() => {
    const base = 35;
    const alertFactor = Math.min(alertCount * 3, 30);
    const monitorFactor = monitoringActive ? 12 : 0;
    return Math.min(base + alertFactor + monitorFactor + 14, 100);
  }, [alertCount, monitoringActive]);

  const threatLabel =
    riskScore >= 75 ? "DEFCON 2" : riskScore >= 55 ? "DEFCON 3" : "DEFCON 4";

  const runSimulation = () => {
    timeoutsRef.current.forEach((t) => window.clearTimeout(t));
    timeoutsRef.current = [];

    setSimulating(true);
    setSimulationStep(0);
    ATTACK_STEPS.forEach((_, idx) => {
      const t = window.setTimeout(
        () => setSimulationStep(idx + 1),
        idx * 900 + 350,
      );
      timeoutsRef.current.push(t);
    });
    const endT = window.setTimeout(
      () => setSimulating(false),
      ATTACK_STEPS.length * 900 + 500,
    );
    timeoutsRef.current.push(endT);
  };

  const askQuestion = (type: "exposure" | "reduce") => {
    const question =
      type === "exposure"
        ? "Where am I most exposed?"
        : "How can I reduce my risk?";
    setChatMessages((prev) => [...prev, { role: "user", text: question }]);
    setTyping(true);
    const t = window.setTimeout(() => {
      setTyping(false);
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", text: CHAT_RESPONSES[type] },
      ]);
    }, 950);
    timeoutsRef.current.push(t);
  };

  return (
    <section className="space-y-4">
      <div className="glass-panel relative overflow-hidden p-4 sm:p-5">
        <div className="scanline" />
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary">
              Global Threat Level
            </p>
            <h3 className="text-lg font-semibold">
              {threatLabel} · Elevated Identity Exposure
            </h3>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5">
            <span className="system-dot" />
            <span className="text-xs font-mono">System Active</span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-4">
          <CircleMetric label="Breach Data" value={78} tone="high" />
          <CircleMetric label="Platform Exposure" value={67} tone="medium" />
          <CircleMetric label="Anomaly Index" value={58} tone="medium" />
          <div className="glass-panel interactive-panel flex flex-col justify-center p-3">
            <div className="flex justify-between items-center mb-1">
              <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Identity Risk Snapshot
              </p>
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-black/40 text-cyan-400 border-cyan-400/50">
                LIVE
              </span>
            </div>
            <p className="text-3xl font-bold text-[hsl(var(--severity-high))]">
              {riskScore}/100
            </p>

            <div className="mt-4 p-2 rounded bg-black/20 border border-white/5">
              <p className="text-[10px] text-muted-foreground uppercase font-mono mb-1.5">
                Changed since last snapshot:
              </p>
              <div className="flex flex-col gap-1 text-[11px] font-mono">
                <span className="text-emerald-400">
                  −10 New verified device
                </span>
                <span className="text-rose-400">+15 Reused email exposed</span>
                <span className="text-emerald-400">
                  −5 MFA confirmed active
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-3 text-[9px] font-mono uppercase text-muted-foreground">
              <div className="flex flex-col gap-1">
                <span>Confidence: 91%</span>
                <span>Evidence: High</span>
              </div>
              <span>Updated: 3m ago</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <p className="mb-2 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            Risk Heatmap Strip
          </p>
          <div className="grid grid-cols-12 gap-1">
            {Array.from({ length: 12 }).map((_, idx) => (
              <div
                key={idx}
                className="h-2 rounded-full"
                style={{
                  background:
                    idx > 8
                      ? "hsl(var(--severity-high))"
                      : idx > 5
                        ? "hsl(var(--severity-medium))"
                        : "hsl(var(--severity-low))",
                  opacity: 0.55 + idx * 0.03,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="glass-panel p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-semibold uppercase tracking-wider">
              Identity History Timeline
            </h4>
          </div>
          <div className="space-y-2">
            {TIMELINE_EVENTS.map((event) => {
              const open = expandedEvent === event.id;
              return (
                <div
                  key={event.id}
                  className="rounded-md border border-border/70 bg-secondary/40 p-3"
                >
                  <button
                    onClick={() => setExpandedEvent(open ? null : event.id)}
                    className="flex w-full items-center justify-between gap-3 text-left"
                  >
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {event.timestamp}
                      </p>
                      <p className="text-sm font-medium">{event.title}</p>
                    </div>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] uppercase border ${riskClass[event.risk]}`}
                    >
                      {event.risk}
                    </span>
                    {open ? (
                      <ChevronUp className="h-4 w-4 text-primary" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-primary" />
                    )}
                  </button>
                  {open && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {event.detail}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </article>

        <article className="glass-panel p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-2">
            <Cpu className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-semibold uppercase tracking-wider">
              Digital Footprint Map
            </h4>
          </div>
          <div className="relative h-64 rounded-lg border border-border/70 bg-black/20 p-3">
            {PLATFORM_GRAPH.map((node) => (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-2 py-1 text-[10px] font-mono transition-all ${
                  selectedNode?.id === node.id
                    ? "bg-primary/30 shadow-[0_0_22px_hsl(var(--primary)/0.65)]"
                    : "bg-secondary/60"
                }`}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  border: `1px solid hsl(var(--severity-${node.exposure > 65 ? "high" : node.exposure > 45 ? "medium" : "low"}) / 0.8)`,
                }}
              >
                {node.label}
              </button>
            ))}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/80 bg-primary/20 px-3 py-1 text-xs font-semibold shadow-[0_0_28px_hsl(var(--primary)/0.55)]">
              {username || fullName}
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {selectedNode
              ? `${selectedNode.label} exposure intensity: ${selectedNode.exposure}/100`
              : "Select a node to inspect exposure details."}
          </p>
        </article>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <article className="glass-panel p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-semibold uppercase tracking-wider">
                Attack Simulation Mode
              </h4>
            </div>
            <button
              disabled={simulating}
              onClick={runSimulation}
              className="neon-button rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-50"
            >
              Simulate Attack
            </button>
          </div>
          <div className="space-y-2">
            {ATTACK_STEPS.map((step, index) => {
              const active = simulationStep > index;
              return (
                <div
                  key={step.id}
                  className={`rounded-md border p-3 transition-all ${
                    active
                      ? step.weakPoint
                        ? "border-[hsl(var(--severity-high)/0.8)] bg-[hsl(var(--severity-high)/0.14)]"
                        : "border-primary/60 bg-primary/10"
                      : "border-border/70 bg-secondary/40"
                  }`}
                >
                  <p className="text-xs font-mono text-muted-foreground">
                    Step {step.id}
                  </p>
                  <p className="text-sm font-semibold">{step.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-3 rounded-md border border-border/80 bg-secondary/40 p-3 text-xs">
            <p className="font-semibold text-primary">Risk Summary</p>
            <p className="text-muted-foreground">
              Trace path shows high exploitability via reused email and profile
              linkage across 4 platforms.
            </p>
          </div>
        </article>

        <aside className="glass-panel flex max-h-[420px] flex-col p-4">
          <div className="mb-2 flex items-center gap-2">
            <Bot className="h-4 w-4 text-primary" />
            <h4 className="text-sm font-semibold uppercase tracking-wider">
              Ask E-Vara
            </h4>
          </div>
          <div className="mb-3 flex-1 space-y-2 overflow-y-auto pr-1">
            {chatMessages.map((message, idx) => (
              <div
                key={`${message.role}-${idx}`}
                className={`rounded-md px-2.5 py-2 text-xs ${message.role === "assistant" ? "bg-secondary/65" : "bg-primary/20 text-primary-foreground"}`}
              >
                {message.text}
              </div>
            ))}
            {typing && (
              <p className="text-xs text-primary animate-pulse">
                E-Vara is typing...
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <button
              onClick={() => askQuestion("exposure")}
              className="neon-button rounded-md border border-primary/30 bg-secondary px-2 py-2 text-xs"
            >
              Where am I most exposed?
            </button>
            <button
              onClick={() => askQuestion("reduce")}
              className="neon-button rounded-md border border-primary/30 bg-secondary px-2 py-2 text-xs"
            >
              How can I reduce my risk?
            </button>
          </div>
        </aside>
      </div>

      <article className="glass-panel p-4 sm:p-5">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-semibold uppercase tracking-wider">
            AI Insight Panel
          </h4>
        </div>
        <ul className="space-y-1 text-xs text-muted-foreground">
          <li>
            • High exposure across 4 platforms with repeated identity
            attributes.
          </li>
          <li>
            • Primary vulnerability: reused email and consistent username across
            public services.
          </li>
          <li>
            • Suggested priority: isolate aliases, rotate credentials, and
            enforce MFA with device checks.
          </li>
        </ul>
        <div className="mt-3 text-[11px] text-muted-foreground">
          <AlertTriangle className="mr-1 inline h-3.5 w-3.5 text-[hsl(var(--severity-medium))]" />
          Insight confidence: 87% based on active telemetry and timeline
          correlation.
        </div>
      </article>
    </section>
  );
};

export default CyberIntelligencePanel;
