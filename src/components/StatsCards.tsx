import { useState, useEffect } from "react";
import { Bell, ScanFace, Clock } from "lucide-react";

interface StatsCardsProps {
  alertCount: number;
  scanCount: number;
  monitoringActive: boolean;
  monitoringStartTime: Date | null;
}

const StatsCards = ({ alertCount, scanCount, monitoringActive, monitoringStartTime }: StatsCardsProps) => {
  const [uptime, setUptime] = useState("00:00:00");

  useEffect(() => {
    if (!monitoringActive || !monitoringStartTime) {
      setUptime("00:00:00");
      return;
    }
    const tick = () => {
      const diff = Math.floor((Date.now() - monitoringStartTime.getTime()) / 1000);
      const h = String(Math.floor(diff / 3600)).padStart(2, "0");
      const m = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
      const s = String(diff % 60).padStart(2, "0");
      setUptime(`${h}:${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [monitoringActive, monitoringStartTime]);

  const cards = [
    { icon: Bell, label: "Total Alerts", value: String(alertCount) },
    { icon: ScanFace, label: "Scans Complete", value: String(scanCount) },
    { icon: Clock, label: "Uptime", value: uptime },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {cards.map((card, i) => (
        <div
          key={card.label}
          className="rounded-lg border border-border bg-card p-3 sm:p-4 animate-fade-in"
          style={{ animationDelay: `${i * 100}ms`, animationFillMode: "both" }}
        >
          <div className="mb-1.5 sm:mb-2 flex items-center gap-1.5">
            <card.icon className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{card.label}</span>
          </div>
          <p className="text-lg sm:text-xl font-mono font-bold text-foreground tabular-nums">{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
