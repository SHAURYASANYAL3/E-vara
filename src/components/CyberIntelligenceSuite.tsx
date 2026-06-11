import { useMemo, useState, useEffect, useRef } from "react";
import {
  Bot,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Target,
  ShieldAlert,
  Wand2,
} from "lucide-react";

interface CyberIntelligenceSuiteProps {
  fullName: string;
  username: string;
  alertCount: number;
  monitoringActive: boolean;
}

type TimelineEvent = {
  id: number;
  title: string;
  timestamp: string;
  level: "low" | "medium" | "high";
  details: string;
};

type PlatformNode = {
  id: string;
  label: string;
  risk: number;
  x: number;
  y: number;
  detail: string;
};

const timelineEvents: TimelineEvent[] = [
  {
    id: 1,
    title: "Zynga credential mention",
    timestamp: "2019-09-13 18:21 UTC",
    level: "high",
    details:
      "Email hash linked to username pattern found in legacy gaming breach dataset.",
  },
  {
    id: 2,
    title: "LinkedIn profile correlation",
    timestamp: "2021-04-06 07:12 UTC",
    level: "medium",
    details:
      "Professional profile metadata aligns with identity keywords and reused avatar markers.",
  },
  {
    id: 3,
    title: "GitHub activity spike",
    timestamp: "2024-11-02 10:44 UTC",
    level: "low",
    details:
      "Repository visibility changes detected with matching handle and similar commit signatures.",
  },
  {
    id: 4,
    title: "Open forum mention",
    timestamp: "2026-04-27 23:08 UTC",
    level: "medium",
    details:
      "Potential identity mention in archived forum thread tied to personal keyword set.",
  },
];

const platformNodes: PlatformNode[] = [
  {
    id: "instagram",
    label: "Instagram",
    risk: 78,
    x: 82,
    y: 95,
    detail: "Public stories and tag exposure.",
  },
  {
    id: "github",
    label: "GitHub",
    risk: 55,
    x: 200,
    y: 45,
    detail: "Commit emails and project metadata visible.",
  },
  {
    id: "twitter",
    label: "Twitter/X",
    risk: 72,
    x: 316,
    y: 90,
    detail: "Historical posts and mentions heavily indexed.",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    risk: 62,
    x: 326,
    y: 204,
    detail: "Employment graph reveals social correlation points.",
  },
  {
    id: "discord",
    label: "Discord",
    risk: 40,
    x: 208,
    y: 252,
    detail: "Server aliases map to known usernames.",
  },
  {
    id: "reddit",
    label: "Reddit",
    risk: 64,
    x: 94,
    y: 214,
    detail: "Topic-specific posts leak behavioral signals.",
  },
];

const riskTone = (score: number) =>
  score > 70 ? "high" : score > 45 ? "medium" : "low";

const levelClasses: Record<"low" | "medium" | "high", string> = {
  low: "text-[hsl(var(--severity-low))] border-[hsl(var(--severity-low)/0.35)] bg-[hsl(var(--severity-low)/0.08)]",
  medium:
    "text-[hsl(var(--severity-medium))] border-[hsl(var(--severity-medium)/0.35)] bg-[hsl(var(--severity-medium)/0.08)]",
  high: "text-[hsl(var(--severity-high))] border-[hsl(var(--severity-high)/0.35)] bg-[hsl(var(--severity-high)/0.08)]",
};

export default function CyberIntelligenceSuite({
  fullName,
  username,
  alertCount,
  monitoringActive,
}: CyberIntelligenceSuiteProps) {
  const [expandedEvent, setExpandedEvent] = useState<number | null>(1);
  const [activeNode, setActiveNode] = useState<string>("instagram");
  const [chatOpen, setChatOpen] = useState(false);
  const [simRunning, setSimRunning] = useState(false);
  const [simStep, setSimStep] = useState(0);
  const [chatMessages, setChatMessages] = useState([
    {
      from: "assistant",
      text: "E-Vara AI online. Ask me about exposure, weak points, or mitigation.",
    },
  ]);

  const timeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const score = useMemo(() => {
    const breach = 34;
    const platforms = Math.round(
      (platformNodes.reduce((acc, p) => acc + p.risk, 0) /
        platformNodes.length) *
        0.38,
    );
    const anomalies = Math.min(28, alertCount * 4);
    return {
      total: Math.min(100, breach + platforms + anomalies),
      breach,
      platforms,
      anomalies,
    };
  }, [alertCount]);

  const threatLevel =
    score.total > 75 ? "DEFCON 2" : score.total > 55 ? "DEFCON 3" : "DEFCON 4";
  const activePlatform =
    platformNodes.find((node) => node.id === activeNode) ?? platformNodes[0];

  const simulationSteps = [
    "Email fingerprint discovered in archived data leak",
    "Username pivot reveals GitHub profile linkage",
    "GitHub metadata correlates to Instagram handle",
    "Instagram public graph exposes personal context",
    "Attacker confirms identity through leaked credential overlap",
  ];

  const askAssistant = (question: string) => {
    const lower = question.toLowerCase();
    setChatMessages((prev) => [
      ...prev,
      { from: "user", text: question },
      { from: "assistant", text: "Analyzing..." },
    ]);
    const t = window.setTimeout(() => {
      setChatMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          from: "assistant",
          text: lower.includes("reduce")
            ? "Prioritize unique emails per platform, lock down public profiles, and enable MFA on high-risk nodes first."
            : "Your highest exposure currently clusters around Instagram, Twitter/X, and reused identity tokens from older breach data.",
        };
        return next;
      });
    }, 900);
    timeoutsRef.current.push(t);
  };

  const runSimulation = () => {
    timeoutsRef.current.forEach((t) => window.clearTimeout(t));
    timeoutsRef.current = [];

    setSimRunning(true);
    setSimStep(0);
    simulationSteps.forEach((_, idx) => {
      const t = window.setTimeout(() => setSimStep(idx + 1), idx * 800);
      timeoutsRef.current.push(t);
    });
    const endT = window.setTimeout(
      () => setSimRunning(false),
      simulationSteps.length * 850,
    );
    timeoutsRef.current.push(endT);
  };

  return (
    <section className="space-y-4">
      <div className="glass-panel rounded-xl p-4 sm:p-5 scanline-wrap lift-3d">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary">
              Global threat posture
            </p>
            <h2 className="text-lg font-semibold text-foreground">
              {threatLevel} · {monitoringActive ? "Live" : "Idle"}
            </h2>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-primary/35 bg-secondary/45 px-3 py-1.5">
            <span
              className={`h-2.5 w-2.5 rounded-full ${monitoringActive ? "status-dot" : "bg-muted"}`}
            />
            <span className="text-xs font-mono text-muted-foreground">
              System {monitoringActive ? "active" : "standby"}
            </span>
          </div>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-secondary/80">
          <div
            className="risk-heatmap h-full"
            style={{ width: `${score.total}%` }}
          />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
        <div className="glass-panel rounded-xl p-4 sm:p-5 lift-3d">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
              Identity timeline
            </h3>
            <span className="text-[10px] font-mono text-muted-foreground">
              Historic intelligence events
            </span>
          </div>
          <div className="space-y-3">
            {timelineEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-lg border border-border/80 bg-secondary/35 p-3 transition-all hover:border-primary/40"
              >
                <button
                  onClick={() =>
                    setExpandedEvent((curr) =>
                      curr === event.id ? null : event.id,
                    )
                  }
                  className="flex w-full items-start justify-between gap-3 text-left"
                >
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {event.timestamp}
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {event.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] uppercase ${levelClasses[event.level]}`}
                    >
                      {event.level}
                    </span>
                    {expandedEvent === event.id ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </button>
                {expandedEvent === event.id && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {event.details}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-xl p-4 sm:p-5 lift-3d">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
              AI insight panel
            </h3>
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li className="rounded-md border border-border/70 bg-secondary/35 p-2.5">
              High exposure footprint across{" "}
              <span className="text-foreground">4 platforms</span>.
            </li>
            <li className="rounded-md border border-border/70 bg-secondary/35 p-2.5">
              Primary vulnerability:{" "}
              <span className="text-foreground">
                reused email and correlated username tokens
              </span>
              .
            </li>
            <li className="rounded-md border border-border/70 bg-secondary/35 p-2.5">
              Recommended action: isolate public metadata and rotate credentials
              in top-risk nodes.
            </li>
          </ul>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { label: "Breach", value: score.breach },
              { label: "Platform", value: score.platforms },
              { label: "Anomalies", value: score.anomalies },
              { label: "Total", value: score.total },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-border/80 bg-secondary/30 p-2.5 text-center"
              >
                <p className="text-lg font-semibold text-foreground">
                  {item.value}
                </p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.25fr_1fr]">
        <div className="glass-panel rounded-xl p-4 sm:p-5 lift-3d">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
              Digital footprint map
            </h3>
            <span className="text-[10px] font-mono text-muted-foreground">
              Click nodes for platform risk context
            </span>
          </div>
          <div className="grid gap-3 lg:grid-cols-[1.15fr_1fr]">
            <svg
              viewBox="0 0 410 295"
              className="w-full rounded-lg border border-border/70 bg-secondary/20 p-2"
            >
              {platformNodes.map((node) => (
                <line
                  key={`line-${node.id}`}
                  x1="205"
                  y1="150"
                  x2={node.x}
                  y2={node.y}
                  stroke={
                    riskTone(node.risk) === "high"
                      ? "#ef4444"
                      : riskTone(node.risk) === "medium"
                        ? "#f59e0b"
                        : "#22c55e"
                  }
                  strokeOpacity="0.7"
                  strokeWidth={node.risk / 25}
                />
              ))}
              <circle
                cx="205"
                cy="150"
                r="34"
                className="fill-cyan-400/35 stroke-cyan-300"
                strokeWidth="2"
              />
              <text
                x="205"
                y="146"
                textAnchor="middle"
                className="fill-white text-[10px]"
              >
                {fullName || "Identity"}
              </text>
              <text
                x="205"
                y="160"
                textAnchor="middle"
                className="fill-cyan-200 text-[9px]"
              >
                @{username || "user"}
              </text>
              {platformNodes.map((node) => (
                <g
                  key={node.id}
                  onClick={() => setActiveNode(node.id)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={activeNode === node.id ? 19 : 14}
                    className={`${activeNode === node.id ? "node-glow" : ""} ${riskTone(node.risk) === "high" ? "fill-red-500/65" : riskTone(node.risk) === "medium" ? "fill-amber-400/65" : "fill-emerald-400/65"}`}
                  />
                  <text
                    x={node.x}
                    y={node.y + 3}
                    textAnchor="middle"
                    className="fill-black text-[8px] font-semibold"
                  >
                    {node.label}
                  </text>
                </g>
              ))}
            </svg>
            <div className="space-y-2 rounded-lg border border-border/75 bg-secondary/30 p-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Active node
              </p>
              <p className="text-sm font-semibold text-foreground">
                {activePlatform.label}
              </p>
              <span
                className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] uppercase ${levelClasses[riskTone(activePlatform.risk)]}`}
              >
                risk {activePlatform.risk}%
              </span>
              <p className="text-xs text-muted-foreground">
                {activePlatform.detail}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-4 sm:p-5 lift-3d">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
              Attack simulation mode
            </h3>
            <button
              disabled={simRunning}
              onClick={runSimulation}
              className="neon-button rounded-md border border-primary/35 px-3 py-1 text-xs font-mono text-primary hover:text-foreground disabled:opacity-50"
            >
              Simulate Attack
            </button>
          </div>
          <div className="space-y-2">
            {simulationSteps.map((step, index) => {
              const active = simStep >= index + 1;
              return (
                <div
                  key={step}
                  className={`rounded-md border p-2.5 text-xs transition-all ${active ? "border-[hsl(var(--severity-high)/0.55)] bg-[hsl(var(--severity-high)/0.12)]" : "border-border/80 bg-secondary/25"}`}
                >
                  <p className="font-medium text-foreground">
                    {index + 1}. {step}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-3 rounded-md border border-primary/30 bg-primary/10 p-3 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground">Risk Summary</p>
            <p className="mt-1">
              {simRunning
                ? "Simulating attack chain..."
                : "Most critical weak point: identity token reuse between email and social handles."}
            </p>
          </div>
        </div>
      </div>

      <button onClick={() => setChatOpen((curr) => !curr)} className="chat-fab">
        <Bot className="h-4 w-4" /> Ask E-Vara
      </button>

      {chatOpen && (
        <div className="chat-panel glass-panel">
          <div className="mb-2 flex items-center justify-between border-b border-border/70 pb-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground">
              AI Assistant
            </p>
            <button
              onClick={() => setChatOpen(false)}
              className="text-[10px] text-muted-foreground"
            >
              Close
            </button>
          </div>
          <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
            {chatMessages.map((msg, idx) => (
              <div
                key={`${msg.text}-${idx}`}
                className={`rounded-md px-2.5 py-2 text-xs ${msg.from === "assistant" ? "bg-secondary/45 text-foreground" : "bg-primary/25 text-primary-foreground"}`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2">
            <button
              onClick={() => askAssistant("Where am I most exposed?")}
              className="neon-button rounded-md border border-border/70 px-2 py-2 text-left text-xs text-muted-foreground hover:text-foreground"
            >
              Where am I most exposed?
            </button>
            <button
              onClick={() => askAssistant("How can I reduce my risk?")}
              className="neon-button rounded-md border border-border/70 px-2 py-2 text-left text-xs text-muted-foreground hover:text-foreground"
            >
              How can I reduce my risk?
            </button>
          </div>
        </div>
      )}

      <div className="glass-panel rounded-xl p-4 sm:p-5 lift-3d">
        <div className="mb-3 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
                Identity Risk Snapshot: {score.total}/100
              </h3>
            </div>
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-black/40 text-amber-400 border-amber-400/50">
              LIMITED DATA
            </span>
          </div>
          <div className="flex items-center gap-4 text-[9px] font-mono uppercase text-muted-foreground ml-6 mt-1">
            <div className="flex gap-4">
              <span>Confidence: 89%</span>
              <span>Evidence: Medium</span>
            </div>
            <span>Updated: 1m ago</span>
          </div>
          <div className="ml-6 mt-2 p-2 rounded bg-black/20 border border-white/5 w-fit">
            <p className="text-[10px] text-muted-foreground uppercase font-mono mb-1">
              Changed since last snapshot:
            </p>
            <div className="flex flex-col gap-1 text-[11px] font-mono">
              <span className="text-rose-400">
                +12 Deepfake audio marker match
              </span>
              <span className="text-emerald-400">−8 PII takedown verified</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { title: "Breach data", value: score.breach, icon: ShieldAlert },
            { title: "Platform exposure", value: score.platforms, icon: Wand2 },
            { title: "Activity anomalies", value: score.anomalies, icon: Bot },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-lg border border-border/80 bg-secondary/25 p-3 text-center"
            >
              <item.icon className="mx-auto mb-2 h-4 w-4 text-primary" />
              <div className="mx-auto mb-2 h-20 w-20">
                <svg viewBox="0 0 120 120" className="h-full w-full">
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    stroke="rgba(148,163,184,0.2)"
                    strokeWidth="10"
                    fill="none"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    stroke="rgba(34,211,238,0.9)"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={327}
                    strokeDashoffset={
                      327 - (Math.min(item.value, 100) / 100) * 327
                    }
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                  />
                  <text
                    x="60"
                    y="66"
                    textAnchor="middle"
                    className="fill-white text-[22px] font-bold"
                  >
                    {item.value}
                  </text>
                </svg>
              </div>
              <p className="text-xs text-muted-foreground">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
