import type { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  children: ReactNode;
}

const ChartCard = ({ title, children }: ChartCardProps) => (
  <div className="rounded-xl border border-cyan-400/30 bg-[#0a0f1c]/85 p-4 shadow-[0_0_30px_rgba(0,229,255,0.1)]">
    <h4 className="mb-3 text-xs uppercase tracking-[0.2em] text-cyan-200">
      {title}
    </h4>
    {children}
  </div>
);

export default ChartCard;
