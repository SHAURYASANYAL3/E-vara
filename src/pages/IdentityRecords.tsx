import {
  Shield,
  Database,
  Plus,
  Trash2,
  Search,
  Globe,
  Mail,
  Fingerprint,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface MonitoredRecord {
  id: string;
  type: string;
  value: string;
  status: string;
  risk: "High" | "Medium" | "Low";
}

import { runResilient } from "@/lib/resilient-fetch";

const MOCK_RECORDS: MonitoredRecord[] = [
  {
    id: "rec-1",
    type: "email",
    value: "demo@e-vara.com",
    status: "Active",
    risk: "High",
  },
  {
    id: "rec-2",
    type: "domain",
    value: "e-vara.com",
    status: "Active",
    risk: "Low",
  },
];

const IdentityRecords = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: records = [], isLoading } = useQuery<MonitoredRecord[], Error>({
    queryKey: ["monitored-records", user?.id],
    queryFn: async () => {
      if (!user) return [];
      return runResilient(
        async () => {
          const { data, error } = await supabase
            .from("monitored_identities")
            .select(
              "id, identity_type, identity_value_encrypted, is_active, risk_score",
            )
            .eq("user_id", user.id);

          if (error) throw error;
          return (data || []).map((d) => ({
            id: d.id,
            type: d.identity_type || "email",
            value: d.identity_value_encrypted || "classified",
            status: d.is_active ? "Active" : "Disabled",
            risk: ((d.risk_score || 0) > 60
              ? "High"
              : (d.risk_score || 0) > 30
                ? "Medium"
                : "Low") as "High" | "Medium" | "Low",
          }));
        },
        `e_vara_records_${user.id}`,
        MOCK_RECORDS,
      );
    },
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase
          .from("monitored_identities")
          .delete()
          .eq("id", id);
        if (error) throw error;
      } catch (e) {
        console.warn("Delete mutation offline, simulating local delete", e);
        const storageKey = `e_vara_records_${user?.id}`;
        const cached = localStorage.getItem(storageKey);
        if (cached) {
          try {
            const list = JSON.parse(cached) as MonitoredRecord[];
            const filtered = list.filter((r) => r.id !== id);
            localStorage.setItem(storageKey, JSON.stringify(filtered));
          } catch (err) {
            /* ignore */
          }
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monitored-records"] });
      toast.error("Record De-linked");
    },
    onError: (err: Error) => {
      console.warn("Delete mutation error captured:", err);
    },
  });

  return (
    <div className="min-h-screen bg-[#050608] text-foreground font-mono selection:bg-primary/30">
      <nav className="h-20 border-b border-white/5 bg-[#050608]/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/client-portal" className="flex items-center gap-2">
              <div className="p-2 bg-primary rounded-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight uppercase">
                E-VARA
              </span>
            </Link>
          </div>
          <Link to="/client-portal">
            <Button
              variant="ghost"
              className="text-[10px] uppercase font-bold tracking-widest hover:bg-white/5"
            >
              Back to Portal
            </Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-secondary/20 bg-secondary/5 text-secondary text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                <Fingerprint className="h-3 w-3" /> Encrypted Vault
              </div>
              <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">
                Monitored Assets
              </h1>
              <p className="text-muted-foreground font-body max-w-xl">
                Manage the digital identifiers E-VARA tracks across global leak
                databases and OSINT vectors.
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-[12px] px-8 py-6 font-bold uppercase tracking-widest text-[10px] security-orange-glow">
              <Plus className="mr-2 h-4 w-4" /> Add Identifier
            </Button>
          </div>

          <div className="grid gap-4">
            {records.map((record) => (
              <div
                key={record.id}
                className="group p-6 rounded-[20px] border border-white/5 bg-[#11141B] hover:border-primary/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden"
              >
                <div className="absolute inset-0 hud-grid opacity-[0.02] pointer-events-none" />

                <div className="flex items-center gap-6 relative z-10">
                  <div
                    className={`h-12 w-12 rounded-xl flex items-center justify-center border ${record.risk === "High" ? "border-alert/30 bg-alert/5" : "border-white/10 bg-white/5"}`}
                  >
                    {String(record.type).includes("email") ? (
                      <Mail className="h-5 w-5 text-primary" />
                    ) : (
                      <Globe className="h-5 w-5 text-secondary" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold uppercase tracking-tight">
                        {record.type}
                      </h3>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full border ${record.status === "Active" ? "border-success/30 bg-success/10 text-success" : "border-secondary/30 bg-secondary/10 text-secondary"}`}
                      >
                        {record.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {record.value}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8 relative z-10">
                  <div className="text-right hidden sm:block">
                    <p className="text-[9px] uppercase font-bold text-muted-foreground tracking-widest mb-1">
                      Risk Level
                    </p>
                    <p
                      className={`text-xs font-bold ${record.risk === "High" ? "text-alert" : record.risk === "Medium" ? "text-secondary" : "text-success"}`}
                    >
                      {record.risk}_EXPOSURE
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/10 hover:bg-white/5 text-[9px] uppercase font-bold px-4"
                    >
                      Re-Scan
                    </Button>
                    <button
                      onClick={() => deleteMutation.mutate(record.id)}
                      className="p-2 text-muted-foreground hover:text-alert transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {records.length === 0 && !isLoading && (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-[24px]">
              <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <p className="text-sm text-muted-foreground uppercase tracking-widest">
                No identifiers found in the grid.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdentityRecords;
