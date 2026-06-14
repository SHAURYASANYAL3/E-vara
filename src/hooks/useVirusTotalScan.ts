import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { sha256 } from "@/lib/crypto";

// ── Types ────────────────────────────────────────────────────────────────────

export type ScanVerdict = "clean" | "suspicious" | "malicious" | "unknown";

export interface FileScanResult {
  id?: string;
  sha256_hash: string;
  file_name: string;
  file_size: number;
  malicious: number;
  suspicious: number;
  undetected: number;
  total_engines: number;
  verdict: ScanVerdict;
  vt_link: string | null;
  scanned_at: string;
  cached?: boolean;
}

export interface ScanState {
  status: "idle" | "hashing" | "scanning" | "done" | "error";
  result: FileScanResult | null;
  error: string | null;
}

// ── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useVirusTotalScan
 *
 * Computes a SHA-256 hash of the provided File object client-side (no file
 * bytes are sent to our servers) then invokes the `virustotal-scan` Supabase
 * Edge Function to check the hash against VirusTotal's database.
 */
export function useVirusTotalScan() {
  const [state, setState] = useState<ScanState>({
    status: "idle",
    result: null,
    error: null,
  });

  const reset = useCallback(() => {
    setState({ status: "idle", result: null, error: null });
  }, []);

  const scanFile = useCallback(async (file: File) => {
    setState({ status: "hashing", result: null, error: null });

    try {
      // ── Step 1: Hash the file client-side (ArrayBuffer → SHA-256 hex) ──────
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
      const hashHex = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      setState((s) => ({ ...s, status: "scanning" }));

      // ── Step 2: Call the Edge Function with only the hash ─────────────────
      const { data, error } = await supabase.functions.invoke(
        "virustotal-scan",
        {
          body: {
            sha256Hash: hashHex,
            fileName: file.name,
            fileSize: file.size,
          },
        },
      );

      if (error) {
        // Surface the error code from our edge function
        const msg = (error as { message?: string }).message ?? "Scan failed";
        throw new Error(msg);
      }

      const scanResult: FileScanResult = {
        ...(data.result as FileScanResult),
        cached: data.cached ?? false,
      };

      setState({ status: "done", result: scanResult, error: null });
      return scanResult;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "An unknown error occurred";
      setState({ status: "error", result: null, error: msg });
      return null;
    }
  }, []);

  return { ...state, scanFile, reset };
}

// ── Utility: Verdict display helpers ─────────────────────────────────────────

export const VERDICT_CONFIG: Record<
  ScanVerdict,
  {
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
    icon: string;
  }
> = {
  clean: {
    label: "Clean",
    color: "hsl(var(--severity-low))",
    bgColor: "hsl(var(--severity-low) / 0.12)",
    borderColor: "hsl(var(--severity-low) / 0.35)",
    icon: "shield-check",
  },
  suspicious: {
    label: "Suspicious",
    color: "hsl(var(--severity-medium))",
    bgColor: "hsl(var(--severity-medium) / 0.12)",
    borderColor: "hsl(var(--severity-medium) / 0.35)",
    icon: "alert-triangle",
  },
  malicious: {
    label: "Malicious",
    color: "hsl(var(--severity-high))",
    bgColor: "hsl(var(--severity-high) / 0.12)",
    borderColor: "hsl(var(--severity-high) / 0.35)",
    icon: "shield-x",
  },
  unknown: {
    label: "Unknown",
    color: "#8eb3d6",
    bgColor: "rgba(142,179,214,0.1)",
    borderColor: "rgba(142,179,214,0.3)",
    icon: "help-circle",
  },
};
