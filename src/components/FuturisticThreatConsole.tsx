import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ShieldCheck,
  ShieldX,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const scanStages = [
  "Scanning Digital Footprint...",
  "Tracking Data Sources...",
  "Analyzing Behavioral Patterns...",
  "Detecting Threat Signatures...",
];

const threatMeta = {
  LOW: { color: "#22d3ee", tone: "text-cyan-300", icon: ShieldCheck },
  MEDIUM: { color: "#f59e0b", tone: "text-amber-300", icon: AlertTriangle },
  HIGH: { color: "#f97316", tone: "text-orange-300", icon: ShieldX },
} as const;

const pieData = [
  { name: "No Exposure", value: 46, color: "#00e5ff" },
  { name: "Vulnerable", value: 31, color: "#f59e0b" },
  { name: "High Risk", value: 23, color: "#fb7185" },
];

const barData = [
  { label: "Social", value: 74 },
  { label: "Email", value: 59 },
  { label: "Password", value: 43 },
  { label: "Device", value: 67 },
];

const ScanStep = ({
  step,
  active,
  done,
}: {
  step: string;
  active: boolean;
  done: boolean;
}) => (
  <div
    role="listitem"
    aria-current={active ? "step" : undefined}
    className={`rounded-md border px-3 py-2 text-xs tracking-wide ${active ? "border-cyan-400 text-cyan-200 shadow-[0_0_18px_rgba(0,229,255,0.25)]" : done ? "border-cyan-800/70 text-cyan-400" : "border-slate-700 text-slate-400"}`}
  >
    {step}
  </div>
);

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg border border-cyan-500/20 bg-slate-900/50 p-3">
    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
      {label}
    </p>
    <p className="mt-2 text-sm text-slate-100">{value}</p>
  </div>
);

const ChartCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-xl border border-cyan-400/20 bg-[#0a0f1c]/90 p-4">
    <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-cyan-300">
      {title}
    </p>
    {children}
  </div>
);

export default function FuturisticThreatConsole({
  alertCount,
}: {
  alertCount: number;
}) {
  const [stage, setStage] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(false);
    const timer = setInterval(() => {
      setStage((s) => {
        if (s >= scanStages.length - 1) {
          clearInterval(timer);
          setDone(true);
          return s;
        }
        return s + 1;
      });
    }, 1200);
    return () => clearInterval(timer);
  }, [alertCount]);

  const riskScore = useMemo(
    () => Math.min(92, 48 + alertCount * 6),
    [alertCount],
  );
  const threatLevel: keyof typeof threatMeta =
    riskScore > 70 ? "HIGH" : riskScore > 45 ? "MEDIUM" : "LOW";
  const ThreatIcon = threatMeta[threatLevel].icon;

  return (
    <section aria-label="Threat Console" className="space-y-4 rounded-2xl border border-cyan-500/20 bg-[#0a0f1c] p-4">
      <div role="status" aria-live="polite" aria-label="Scan progress" className="grid gap-3 md:grid-cols-2">
        {scanStages.map((s, i) => (
          <ScanStep
            key={s}
            step={s}
            active={!done && i === stage}
            done={done || i < stage}
          />
        ))}
      </div>

      {done && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Threat Level" value={threatLevel} />
            <StatCard label="Identity Risk Snapshot" value={`${riskScore}%`} />
            <StatCard
              label="Account Compromise"
              value={`${Math.min(95, riskScore - 4)}%`}
            />
            <StatCard
              label="Data Exposure"
              value={`${Math.max(20, riskScore - 18)}%`}
            />
          </div>
          <div className="rounded-xl border border-cyan-500/20 bg-slate-900/40 p-4">
            <div className="flex items-center gap-3">
              <ThreatIcon
                aria-hidden="true"
                className={`h-5 w-5 ${threatMeta[threatLevel].tone}`}
              />
              <p className="text-sm text-slate-100">
                Identity Misuse Risk: {Math.max(18, riskScore - 31)}%
              </p>
            </div>
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            <ChartCard title="Risk Composition">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {pieData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
            <ChartCard title="Surface Category Risk">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <XAxis
                      dataKey="label"
                      stroke="#7dd3fc"
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis stroke="#7dd3fc" tick={{ fontSize: 10 }} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {barData.map((v) => (
                        <Cell
                          key={v.label}
                          fill={
                            v.value > 65
                              ? "#fb7185"
                              : v.value > 50
                                ? "#f59e0b"
                                : "#00e5ff"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard label="Threats detected" value={String(alertCount)} />
            <StatCard
              label="Last scan time"
              value={new Date().toLocaleTimeString()}
            />
            <StatCard
              label="Risk trend"
              value={alertCount > 2 ? "Rising" : "Falling"}
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-cyan-300">
            {alertCount > 2 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}{" "}
            Your Digital Risk Level:{" "}
            {threatLevel === "HIGH"
              ? "High"
              : threatLevel === "MEDIUM"
                ? "Medium"
                : "Low"}
          </div>
        </>
      )}
    </section>
  );
}
