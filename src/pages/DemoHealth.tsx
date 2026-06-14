import { useEffect, useState } from "react";
import { Shield } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useSimulation } from "@/providers/SimulationProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function DemoHealth() {
  const { user } = useAuth();
  const { isSimulationMode } = useSimulation();
  const [consoleErrors, setConsoleErrors] = useState(0);
  const [renderTime] = useState(() => Date.now());

  // 1. Edge Worker Queue Query
  const { data: queueCount } = useQuery({
    queryKey: ["demo-health-queue-count", user?.id, isSimulationMode],
    queryFn: async () => {
      if (isSimulationMode) return 0;
      const { count, error } = await supabase
        .from("osint_jobs")
        .select("*", { count: "exact", head: true })
        .in("status", ["pending", "processing"]);
      if (error) throw error;
      return count || 0;
    },
    enabled: !!user && !isSimulationMode,
    refetchInterval: 5000,
  });

  // 2. Snapshot Freshness Query
  const { data: latestSnapshot } = useQuery({
    queryKey: ["demo-health-latest-snapshot", user?.id, isSimulationMode],
    queryFn: async () => {
      if (isSimulationMode) return null;
      const { data, error } = await supabase
        .from("risk_snapshots")
        .select("expires_at")
        .eq("user_id", user?.id)
        .order("calculated_at", { ascending: false })
        .limit(1);
      if (error) throw error;
      return data?.[0] || null;
    },
    enabled: !!user && !isSimulationMode,
  });

  // 3. Console Errors local buffer monitor
  useEffect(() => {
    const checkErrors = () => {
      try {
        const logsStr = localStorage.getItem("e_vara_logs");
        if (logsStr) {
          const logs = JSON.parse(logsStr);
          if (Array.isArray(logs)) {
            const errorCount = logs.filter(
              (l: { level?: string }) => l.level === "error",
            ).length;
            setConsoleErrors(errorCount);
            return;
          }
        }
      } catch (e) {
        // ignore storage/parse failures
      }
      setConsoleErrors(0);
    };

    checkErrors();
    const interval = setInterval(checkErrors, 2000);
    return () => clearInterval(interval);
  }, []);

  // Compute Queue Vitals
  let queueText = "0 pending";
  let queueColor = "text-emerald-400";
  if (!user) {
    queueText = "N/A";
    queueColor = "text-muted-foreground";
  } else if (!isSimulationMode) {
    const count = queueCount ?? 0;
    queueText = `${count} pending`;
    if (count > 0) {
      queueColor = "text-amber-400";
    }
  }

  // Compute Freshness Vitals
  let freshnessText = "Stable";
  let freshnessColor = "text-emerald-400";
  if (!user) {
    freshnessText = "N/A";
    freshnessColor = "text-muted-foreground";
  } else if (!isSimulationMode) {
    if (latestSnapshot && latestSnapshot.expires_at) {
      const expiresAt = new Date(latestSnapshot.expires_at).getTime();
      if (isNaN(expiresAt)) {
        freshnessText = "Unavailable";
        freshnessColor = "text-cyan-400";
      } else {
        const now = renderTime;
        if (now > expiresAt) {
          freshnessText = "Stale";
          freshnessColor = "text-amber-400";
        } else {
          freshnessText = "Stable";
          freshnessColor = "text-emerald-400";
        }
      }
    } else if (latestSnapshot) {
      freshnessText = "Unavailable";
      freshnessColor = "text-cyan-400";
    } else {
      freshnessText = "None";
      freshnessColor = "text-cyan-400";
    }
  }

  // Compute Console Errors Vitals
  const errorText = String(consoleErrors);
  const errorColor = consoleErrors > 0 ? "text-red-400" : "text-emerald-400";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="mb-10 border-b border-border/50 pb-6">
            <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              Demo Health Diagnostics
            </h1>
            <p className="text-muted-foreground mt-2 font-mono text-sm uppercase tracking-wider">
              Internal Vitals • {new Date().toISOString()}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="glass-panel p-4 rounded-lg">
              <p className="text-[10px] uppercase font-mono text-muted-foreground">
                Build Version
              </p>
              <p className="text-xl font-bold mt-1 text-cyan-400">RC-1.0.0</p>
            </div>
            <div className="glass-panel p-4 rounded-lg">
              <p className="text-[10px] uppercase font-mono text-muted-foreground">
                Edge Worker Queue
              </p>
              <p className={`text-xl font-bold mt-1 ${queueColor}`}>
                {queueText}
              </p>
            </div>
            <div className="glass-panel p-4 rounded-lg">
              <p className="text-[10px] uppercase font-mono text-muted-foreground">
                Snapshot Freshness
              </p>
              <p className={`text-xl font-bold mt-1 ${freshnessColor}`}>
                {freshnessText}
              </p>
            </div>
            <div className="glass-panel p-4 rounded-lg">
              <p className="text-[10px] uppercase font-mono text-muted-foreground">
                Console Errors
              </p>
              <p className={`text-xl font-bold mt-1 ${errorColor}`}>
                {errorText}
              </p>
            </div>
            <div className="glass-panel p-4 rounded-lg">
              <p className="text-[10px] uppercase font-mono text-muted-foreground">
                Offline Fallback
              </p>
              <p className="text-xl font-bold mt-1 text-emerald-400">Active</p>
            </div>
            <div className="glass-panel p-4 rounded-lg">
              <p className="text-[10px] uppercase font-mono text-muted-foreground">
                Demo Mode
              </p>
              <p className="text-xl font-bold mt-1 text-emerald-400">
                {import.meta.env.VITE_DEMO_MODE === "true" ? "ON" : "OFF"}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
