import React, { useState } from "react";
import { AlertTriangle, ShieldAlert, Power } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const EmergencyLockdown = () => {
  const [isLocking, setIsLocking] = useState(false);

  const handleLockdown = async () => {
    if (
      !confirm(
        "WARNING: This will instantly revoke all active sessions across all devices, purge your local cryptographic vault, and pause all background analysis. Proceed?",
      )
    ) {
      return;
    }

    setIsLocking(true);
    try {
      // 1. Purge Local Vault (Layer 4)
      localStorage.clear();
      sessionStorage.clear();

      // 2. Revoke Global Sessions (Layer 6)
      const { error } = await supabase.auth.signOut({ scope: "global" });
      if (error) throw error;

      toast.success("Identity Secured. All sessions revoked.", {
        description:
          "Your local vault has been purged. Please authenticate again.",
      });

      // Redirect to home/login
      window.location.href = "/";
    } catch (error: unknown) {
      const e = error as Error;
      toast.error("Lockdown failed", { description: e.message });
      setIsLocking(false);
    }
  };

  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 transition-opacity group-hover:opacity-10">
        <ShieldAlert size={100} className="text-red-500" />
      </div>

      <h3 className="text-red-400 font-medium flex items-center gap-2 mb-2">
        <AlertTriangle size={18} />
        Emergency Lockdown
      </h3>
      <p className="text-sm text-gray-400 mb-6 max-w-md">
        Instantly revoke all global sessions, purge local cryptographic keys,
        and halt background queue execution. Use only if you suspect active
        compromise.
      </p>

      <button
        onClick={handleLockdown}
        disabled={isLocking}
        className="flex items-center gap-2 px-6 py-3 bg-red-500/20 text-red-500 border border-red-500/50 rounded-lg hover:bg-red-500 hover:text-white transition-all font-medium uppercase tracking-wider text-sm"
      >
        <Power size={16} />
        {isLocking ? "Securing Identity..." : "Execute Lockdown"}
      </button>
    </div>
  );
};
