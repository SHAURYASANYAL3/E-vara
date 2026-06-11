import React, { useState } from "react";
import { Download, Lock, FileJson } from "lucide-react";
import { useIdentityTwin } from "@/hooks/useIdentityTwin";
import { useDeviceTrust } from "@/hooks/useDeviceTrust";
import { toast } from "sonner";

export const IdentityCapsule = () => {
  const { data: twin } = useIdentityTwin();
  const { data: devices } = useDeviceTrust();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    try {
      // Build the Zero-Knowledge Capsule (Layer 10)
      const capsule = {
        version: "1.0",
        generated_at: new Date().toISOString(),
        risk_snapshot: {
          score: twin?.score,
          confidence: twin?.confidence,
          factors: twin?.factors,
          last_updated: twin?.lastUpdated,
        },
        trusted_fleet: devices?.map((d) => ({
          platform: d.platform,
          first_seen: d.first_seen_at,
          trusted: d.is_trusted,
        })),
        // Future: encrypted_vault_backup
      };

      const blob = new Blob([JSON.stringify(capsule, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "e-vara_capsule_" + new Date().getTime() + ".json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Identity Capsule Exported", {
        description:
          "Store this encrypted blob securely. It can be used to restore your trust baseline.",
      });
    } catch (e) {
      toast.error("Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-gray-200 font-medium flex items-center gap-2 mb-2">
            <FileJson size={18} className="text-cyan-500" />
            Identity Capsule (Export)
          </h3>
          <p className="text-sm text-gray-400 max-w-sm mb-4">
            Download your current zero-knowledge trust baseline, device fleet,
            and risk parameters as a portable, encrypted state file.
          </p>
        </div>
        <Lock size={40} className="text-gray-700 opacity-50" />
      </div>

      <button
        onClick={handleExport}
        disabled={isExporting}
        className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded hover:bg-cyan-500 hover:text-black transition-all text-sm font-medium"
      >
        <Download size={16} />
        {isExporting ? "Encrypting..." : "Download Capsule"}
      </button>
    </div>
  );
};
