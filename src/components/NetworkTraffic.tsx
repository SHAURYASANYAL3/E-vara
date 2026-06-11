import { useState, useEffect, useRef } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TrafficData {
  time: string;
  traffic: number;
  threats: number;
}

const NetworkTraffic = () => {
  const [data, setData] = useState<TrafficData[]>(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      time: `${i}:00`,
      traffic: Math.floor(Math.random() * 300) + 200,
      threats: Math.floor(Math.random() * 10),
    }));
  });

  // PERFORMANCE HARDENING: Use a ref for the interval to ensure clean disposal
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setData((prev) => {
        // ENFORCE MEMORY INTEGRITY: Strict buffer limit of 25 nodes
        const next = [...prev];
        if (next.length >= 25) {
          next.shift();
        }

        const lastTimeParts = prev[prev.length - 1].time.split(":");
        const nextHour = (parseInt(lastTimeParts[0]) + 1) % 24;

        next.push({
          time: `${nextHour}:00`,
          traffic: Math.floor(Math.random() * 300) + 200,
          threats: Math.floor(Math.random() * 15),
        });

        return next;
      });
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md h-full">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary/80 font-mono">
          Real-time Traffic Analysis
        </h4>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-secondary" />
            <span className="text-[9px] font-mono text-muted-foreground uppercase">
              Incoming
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-[9px] font-mono text-muted-foreground uppercase">
              Threats
            </span>
          </div>
        </div>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4A8BFF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4A8BFF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF6A1A" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#FF6A1A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#ffffff05"
              vertical={false}
            />
            <XAxis dataKey="time" hide />
            <YAxis hide domain={[0, 600]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0E1015",
                border: "1px solid #ffffff10",
                fontSize: "10px",
                fontFamily: "JetBrains Mono",
              }}
              itemStyle={{ color: "#ffffff" }}
            />
            <Area
              isAnimationActive={false} // Performance: Disable animations for high-frequency updates
              type="monotone"
              dataKey="traffic"
              stroke="#4A8BFF"
              fillOpacity={1}
              fill="url(#colorTraffic)"
              strokeWidth={2}
            />
            <Area
              isAnimationActive={false}
              type="monotone"
              dataKey="threats"
              stroke="#FF6A1A"
              fillOpacity={1}
              fill="url(#colorThreats)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default NetworkTraffic;
