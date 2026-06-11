import type { ReactNode } from "react";

interface StatCardProps {
  icon?: ReactNode;
  label: string;
  value: string;
  accent?: "cyan" | "orange" | "red";
  subtext?: string;
  confidence?: number;
  updatedAt?: string;
  evidence?: "Low" | "Medium" | "High";
  reality?: "LIVE" | "SIMULATED" | "LIMITED DATA" | "REFRESHING";
}

const ACCENT = {
  cyan: "from-cyan-400/60 to-blue-500/80 border-cyan-400/40",
  orange: "from-amber-300/60 to-orange-500/80 border-orange-400/40",
  red: "from-red-400/60 to-rose-500/80 border-rose-400/40",
};

const StatCard = ({
  icon,
  label,
  value,
  accent = "cyan",
  subtext,
}: StatCardProps) => (
  <div
    className={`relative overflow-hidden rounded-xl border bg-[#0a0f1c]/85 p-4 ${ACCENT[accent]} shadow-[0_0_24px_rgba(0,229,255,0.12)]`}
  >
    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.04)_1px,transparent_1px)] bg-[size:16px_16px]" />
    <div className="relative z-10 flex flex-col h-full justify-between">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-100/90">
            {icon && icon}
            <span className="text-[10px] uppercase tracking-[0.2em]">
              {label}
            </span>
          </div>
          {reality && (
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-black/40 text-cyan-400 border-cyan-400/50">
              {reality}
            </span>
          )}
        </div>
        <p className="text-2xl font-semibold text-white">{value}</p>
        {subtext && <p className="mt-1 text-xs text-slate-300">{subtext}</p>}
      </div>
      <div className="mt-4 flex items-center justify-between text-[9px] font-mono uppercase text-cyan-200/50">
        <div className="flex flex-col gap-1">
          <span>Confidence: {confidence ?? 94}%</span>
          <span>Evidence: {evidence ?? "Medium"}</span>
        </div>
        <span>Updated: {updatedAt ?? "Just now"}</span>
      </div>
    </div>
  </div>
);

export default StatCard;
