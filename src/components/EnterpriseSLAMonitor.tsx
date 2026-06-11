import React from "react";
import { Activity, ShieldCheck, Zap, Globe } from "lucide-react";

const EnterpriseSLAMonitor = () => {
  const systems = [
    {
      name: "Identity Engine",
      status: "Operational",
      latency: "12ms",
      uptime: "99.99%",
    },
    {
      name: "Breach Correlation",
      status: "Operational",
      latency: "45ms",
      uptime: "99.95%",
    },
    {
      name: "Exposure Intelligence",
      status: "Degraded",
      latency: "240ms",
      uptime: "98.5%",
    },
    {
      name: "Global API Gateway",
      status: "Operational",
      latency: "8ms",
      uptime: "99.999%",
    },
  ];

  return (
    <div className="neon-panel rounded-xl border border-primary/20 p-5 bg-[#0A0C10]/80 backdrop-blur-md">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-mono font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" /> Enterprise SLA Monitoring
        </h3>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            System Health: Optimal
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {systems.map((system) => (
          <div
            key={system.name}
            className="p-4 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase text-muted-foreground">
                {system.name}
              </span>
              {system.status === "Operational" ? (
                <Zap className="h-3 w-3 text-success" />
              ) : (
                <Activity className="h-3 w-3 text-warning animate-pulse" />
              )}
            </div>
            <div className="flex flex-col">
              <span
                className={`text-lg font-bold font-mono ${system.status === "Operational" ? "text-foreground" : "text-warning"}`}
              >
                {system.status}
              </span>
              <div className="flex items-center justify-between mt-2 text-[10px] font-mono text-muted-foreground">
                <span>Latency: {system.latency}</span>
                <span>Uptime: {system.uptime}</span>
              </div>
            </div>
            <div className="mt-3 h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${system.status === "Operational" ? "bg-success" : "bg-warning"}`}
                style={{
                  width: system.status === "Operational" ? "100%" : "70%",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-lg border border-primary/10 bg-primary/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Globe className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs font-bold text-foreground">
              Global Intelligence Network
            </p>
            <p className="text-[10px] text-muted-foreground">
              Active nodes in 12 regions. Real-time synchronization enabled.
            </p>
          </div>
        </div>
        <button className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">
          View Network Map
        </button>
      </div>
    </div>
  );
};

export default EnterpriseSLAMonitor;
