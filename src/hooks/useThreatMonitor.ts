import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { runResilient } from "@/lib/resilient-fetch";
import { useSimulation } from "@/providers/SimulationProvider";
import { useAuth } from "@/hooks/useAuth";

export interface ThreatFinding {
  id: string;
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  source: string;
  description: string;
  found_at: string;
}

export const useThreatMonitor = () => {
  const { isSimulationMode, getSimulatedFindings } = useSimulation();
  const { user } = useAuth();

  return useQuery<ThreatFinding[], Error>({
    queryKey: ["threat-findings", user?.id, isSimulationMode],
    queryFn: async () => {
      if (isSimulationMode && user) {
        const fakeData = getSimulatedFindings(user.id, "sim-identity-123");
        return fakeData.map((row) => ({
          id: row.id,
          severity: row.severity,
          title: `Exposure Detected in ${row.source_name}`,
          source: row.source_name,
          description: row.description,
          found_at: row.found_at,
        }));
      }

      return runResilient(
        async () => {
          const { data, error } = await supabase
            .from("identity_breaches")
            .select("id, severity, source_name, description, created_at")
            .order("created_at", { ascending: false });

          if (error) {
            throw new Error(
              "Unable to securely fetch threat intelligence data.",
            );
          }

          return (data || []).map((row) => ({
            id: row.id,
            severity: (row.severity || "medium") as ThreatFinding["severity"],
            title: `Exposure Detected in ${row.source_name || "Unknown Source"}`,
            source: row.source_name || "Unknown Source",
            description: row.description || "Data point leaked.",
            found_at: row.created_at || new Date().toISOString(),
          }));
        },
        "e_vara_threat_findings",
        [], // Return an empty array on failure instead of mocked threats
      );
    },
    enabled: !!user,
    staleTime: 30000, // 30 seconds cache
  });
};
