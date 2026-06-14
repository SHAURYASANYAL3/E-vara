import { useEffect, useMemo, useState } from "react";
import { Bell, ScanFace, Clock } from "lucide-react";

interface StatsCardsProps {
  alertCount: number;
  scanCount: number;
  monitoringActive: boolean;
  monitoringStartTime: Date | null;
}

const easeValue = (target: number, current: number) => {
  if (target === current) return current;
  const diff = target - current;
  return (
    current + Math.sign(diff) * Math.max(1, Math.floor(Math.abs(diff) / 4))
  );
};

const StatsCards = ({
  alertCount,
  scanCount,
  monitoringActive,
  monitoringStartTime,
}: StatsCardsProps) => {
  const [uptime, setUptime] = useState("00:00:00");
  const [liveAlerts, setLiveAlerts] = useState(alertCount);
  const [liveScans, setLiveScans] = useState(scanCount);

  useEffect(() => {
    if (!monitoringActive || !monitoringStartTime) {
      setUptime("00:00:00");
      return;
    }
    const tick = () => {
      const diff = Math.floor(
        (Date.now() - monitoringStartTime.getTime()) / 1000,
      );
      const h = String(Math.floor(diff / 3600)).padStart(2, "0");
      const m = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
      const s = String(diff % 60).padStart(2, "0");
      setUptime(`${h}:${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [monitoringActive, monitoringStartTime]);

  useEffect(() => {
    const id = setInterval(() => {
      setLiveAlerts((curr) => easeValue(alertCount, curr));
      setLiveScans((curr) => easeValue(scanCount, curr));
    }, 75);
    return () => clearInterval(id);
  }, [alertCount, scanCount]);

  const cards = useMemo(
    () => [
      {
        icon: Bell,
        label: "Total Alerts",
        value: String(liveAlerts),
        meter: Math.min(100, liveAlerts * 8),
      },
      {
        icon: ScanFace,
        label: "Scans Complete",
        value: String(liveScans),
        meter: Math.min(100, liveScans * 12),
      },
      {
        icon: Clock,
        label: "Uptime",
        value: uptime,
        meter: monitoringActive ? 100 : 12,
      },
    ],
    [liveAlerts, liveScans, uptime, monitoringActive],
  );

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {cards.map((card, i) => (
        <div
          key={card.label}
          className="glass-panel scanline-wrap lift-3d rounded-xl p-3.5 sm:p-4"
          style={{ animationDelay: `${i * 90}ms`, animationFillMode: "both" }}
        >
          <div className="mb-2 flex items-center gap-1.5">
            <card.icon className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              {card.label}
            </span>
          </div>
          <p className="text-lg font-mono font-bold tabular-nums text-foreground sm:text-xl">
            {card.value}
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary/90">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 transition-all duration-500"
              style={{ width: `${card.meter}%` }}
            />
          </div>
          <p
            className={`text-sm font-semibold ${monitoringActive ? "text-primary monitor-pulse" : "text-muted-foreground"}`}
          >
            {monitoringActive ? "ACTIVE" : "STANDBY"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
