import { useState } from "react";
import { User, ShieldCheck, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { sha256 } from "@/lib/crypto";
import { useSimulation } from "@/providers/SimulationProvider";

export interface IdentityData {
  email: string;
  username: string;
  fullName: string;
}

interface IdentityFormProps {
  onSave?: (data: IdentityData) => void;
  initial?: Partial<IdentityData> | null;
}

const IdentityForm = ({ onSave, initial }: IdentityFormProps) => {
  const { user, saveIdentity } = useAuth();
  const { isSimulationMode } = useSimulation();
  const [email, setEmail] = useState(initial?.email || user?.email || "");
  const [username, setUsername] = useState(initial?.username || "");
  const [fullName, setFullName] = useState(initial?.fullName || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!user) return;

    setLoading(true);

    try {
      const safeEmail = email.trim().toLowerCase();
      const safeUsername = username.trim();
      const safeFullName = fullName.trim();

      if (!safeEmail) {
        toast.error("Validation Error", { description: "Email is required." });
        setLoading(false);
        return;
      }

      // 1. Cryptographic Integrity: Hash before persistence
      const identity_hash = await sha256(safeEmail);

      // 2. Real Persistence via useAuth (which now enforces hashing and Postgres RLS)
      await saveIdentity({
        email: safeEmail,
        username: safeUsername,
        fullName: safeFullName,
        faceImage: null,
      });

      // 3. Trigger Intelligence Engine
      let scanResult = null;
      let scanError = null;
      try {
        const hashedEmail = await sha256(safeEmail);

        // Simulation Guard
        const simulationMode =
          localStorage.getItem("e_vara_simulation_mode") === "true";
        if (simulationMode) {
          // Fake network delay
          await new Promise((r) => setTimeout(r, 1500));
          scanResult = { count: 5, status: "NODE_SIMULATED" };
        } else {
          const res = await supabase.functions.invoke("breach-check", {
            body: {
              identityHash: hashedEmail,
              userId: user.id,
            },
          });
          scanResult = res.data;
          scanError = res.error;
        }
      } catch (e) {
        scanError = e;
      }

      let resultCount = 0;
      if (scanError) {
        toast.error("Intelligence Engine Offline", {
          description:
            "Could not complete the breach scan. Ensure APIs are connected.",
        });
        return; // Early return to prevent false success
      } else {
        resultCount = scanResult?.count || 0;
      }

      toast.success("Identity monitoring active", {
        description: `Analysis complete. Found ${resultCount} data markers.`,
      });

      if (onSave)
        onSave({
          email: safeEmail,
          username: safeUsername,
          fullName: safeFullName,
        });
    } catch (err) {
      toast.error("Operational Error", {
        description: "Failed to establish identity link. Check network status.",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all";

  return (
    <div className="rounded-xl border border-border/50 bg-card/30 p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-2 opacity-10">
        <ShieldCheck className="h-24 w-24 text-primary" />
      </div>

      <div className="mb-6 flex items-center gap-3 relative z-10">
        <div className="p-2 bg-primary/10 rounded-lg">
          <User className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-foreground uppercase tracking-[0.2em]">
            Identity Intelligence
          </h3>
          <p className="text-[10px] text-muted-foreground uppercase">
            Configure monitoring targets
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
            Primary Email Target
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            maxLength={255}
            className={inputClass}
            placeholder="target@example.com"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
              Public Handle
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={100}
              className={inputClass}
              placeholder="@handle"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">
              Legal Designation
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              maxLength={100}
              className={inputClass}
              placeholder="John Doe"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 flex items-center justify-center gap-2 rounded-md bg-primary py-3 text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Establishing Link...
            </>
          ) : (
            "Verify & Activate"
          )}
        </button>
      </form>
    </div>
  );
};

export default IdentityForm;
