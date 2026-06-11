import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import ChartCard from "@/components/ChartCard";
import StatCard from "@/components/StatCard";
import { useThreatMonitor } from "@/hooks/useThreatMonitor";
import { AlertCircle, ShieldCheck } from "lucide-react";

const ThreatScanPanel = () => {
  const { data: findings, isLoading, error } = useThreatMonitor();

  const metrics = useMemo(() => {
    if (!findings) return null;

    const highRisk = findings.filter(
      (f) => f.severity === "high" || f.severity === "critical",
    ).length;
    const mediumRisk = findings.filter((f) => f.severity === "medium").length;
    const lowRisk = findings.filter((f) => f.severity === "low").length;

    // Calculate a dynamic risk score based on findings
    const rawScore = highRisk * 25 + mediumRisk * 10 + lowRisk * 5;
    const riskScore = Math.min(Math.max(rawScore, 0), 100);

    const level = riskScore >= 70 ? "HIGH" : riskScore >= 40 ? "MEDIUM" : "LOW";

    const pieData =
      total === 0
        ? [{ name: "No Exposure", value: 100, color: "#00e5ff" }]
        : [
            {
              name: "Vulnerable",
              value: Math.round((mediumRisk / total) * 100),
              color: "#3d8bff",
            },
            {
              name: "High Risk",
              value: Math.round((highRisk / total) * 100),
              color: "#ff5f3a",
            },
            {
              name: "Low Risk",
              value: Math.round((lowRisk / total) * 100),
              color: "#31d3c6",
            },
          ].filter((d) => d.value > 0);

    // Simple distribution for the bar chart based on actual findings
    const sourceMap: Record<string, number> = {};
    findings.forEach((f) => {
      const src = f.source.split(" ")[0] || "Unknown";
      sourceMap[src] = (sourceMap[src] || 0) + 1;
    });

    const barData = Object.entries(sourceMap).map(([name, value]) => ({
      name,
      value,
    }));

    return { riskScore, level, pieData, barData };
  }, [findings]);

  if (error) {
    return (
      <section className="rounded-xl border border-[hsl(var(--severity-high)/0.4)] bg-[hsl(var(--severity-high)/0.05)] p-6 flex flex-col items-center justify-center text-center h-48">
        <AlertCircle className="h-8 w-8 text-[hsl(var(--severity-high))] mb-2" />
        <h3 className="text-sm font-semibold text-[hsl(var(--severity-high))]">
          Scan Terminated
        </h3>
        <p className="text-xs text-[hsl(var(--severity-high))/80] mt-1">
          {error.message}
        </p>
      </section>
    );
  }

  if (isLoading || !metrics) {
    return (
      <section className="rounded-xl border border-[#244163] bg-[#0a1224] p-6 flex items-center justify-center h-48">
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm font-mono text-primary animate-pulse">
            Initializing Scan Engines...
          </p>
        </div>
      </section>
    );
  }

  const { riskScore, level, pieData, barData } = metrics;

  return (
    <section className="space-y-4 rounded-xl border border-[#244163] bg-[#0a1224] p-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold tracking-wide text-[#b7f8ff]">
          Threat Scan Console
        </h2>
        {riskScore === 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[hsl(var(--severity-low)/0.15)] border border-[hsl(var(--severity-low)/0.3)]">
            <ShieldCheck className="h-3.5 w-3.5 text-[hsl(var(--severity-low))]" />
            <span className="text-[10px] uppercase font-bold text-[hsl(var(--severity-low))]">
              No Known Exposure
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Overall Threat Level" value={level} />
          <StatCard
            label="Calculated Risk Snapshot"
            value={`${riskScore}%`}
            reality="LIVE"
            evidence="High"
          />
          <StatCard
            label="Active Findings"
            value={findings?.length.toString() || "0"}
          />
        </div>

        {findings && findings.length > 0 && (
          <div className="grid gap-3 lg:grid-cols-2">
            <ChartCard title="Risk Distribution">
              <div className="h-56">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={84}
                      innerRadius={46}
                    >
                      {pieData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0E1015",
                        border: "1px solid #ffffff10",
                        fontSize: "12px",
                      }}
                      itemStyle={{ color: "#ffffff" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
            <ChartCard title="Source Analysis">
              <div className="h-56">
                <ResponsiveContainer>
                  <BarChart data={barData}>
                    <XAxis
                      dataKey="name"
                      stroke="#8eb3d6"
                      fontSize={10}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#8eb3d6"
                      fontSize={10}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0E1015",
                        border: "1px solid #ffffff10",
                        fontSize: "12px",
                      }}
                      cursor={{ fill: "#ffffff05" }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {barData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={
                            ["#00e5ff", "#3da4ff", "#31d3c6", "#ff7c53"][i % 4]
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        )}
      </div>
    </section>
  );
};

export default ThreatScanPanel;
