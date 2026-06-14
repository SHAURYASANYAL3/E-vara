import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Logger } from "../shared/logger.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// VirusTotal API v3 base URL
const VT_API_BASE = "https://www.virustotal.com/api/v3";

// Verdict thresholds: if >= MALICIOUS_THRESHOLD engines flag it → malicious
const MALICIOUS_THRESHOLD = 3;
const SUSPICIOUS_THRESHOLD = 1;

// Maximum file size we accept hashes for: 650 MB (VT free tier limit)
const MAX_FILE_SIZE_BYTES = 650 * 1024 * 1024;

interface VTAttributes {
  last_analysis_stats: {
    malicious: number;
    suspicious: number;
    undetected: number;
    harmless: number;
    timeout: number;
  };
  sha256: string;
  meaningful_name?: string;
}

interface VTResponse {
  data?: {
    attributes?: VTAttributes;
    id?: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

function computeVerdict(malicious: number, suspicious: number): string {
  if (malicious >= MALICIOUS_THRESHOLD) return "malicious";
  if (malicious > 0 || suspicious >= SUSPICIOUS_THRESHOLD) return "suspicious";
  return "clean";
}

serve(async (req) => {
  const traceId = req.headers.get("x-request-id") || crypto.randomUUID();
  const logger = new Logger("virustotal-scan", traceId);

  // Handle CORS preflight
  if (req.method === "OPTIONS")
    return new Response("ok", { headers: corsHeaders });

  logger.info("Request started", { method: req.method });

  try {
    // ── 1. Auth ──────────────────────────────────────────────────────────────
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("ERR_AUTH_EXPIRED");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authError || !user) throw new Error("ERR_HANDSHAKE_FAILED");

    // ── 2. Rate limiting (reuse the existing check_rate_limit RPC) ───────────
    const { data: limitAllowed, error: rpcError } = await supabase.rpc(
      "check_rate_limit",
      {
        p_user_id: user.id,
        p_endpoint: "virustotal_scan",
        p_max_requests: 4, // VT free tier: 4 req/min
        p_window_minutes: 1,
      },
    );
    if (rpcError || !limitAllowed) throw new Error("ERR_RATE_LIMIT_EXCEEDED");

    // ── 3. Parse & validate request body ────────────────────────────────────
    const body = await req.json();
    const { sha256Hash, fileName, fileSize } = body as {
      sha256Hash?: string;
      fileName?: string;
      fileSize?: number;
    };

    if (!sha256Hash) throw new Error("ERR_MISSING_HASH");
    if (!/^[a-f0-9]{64}$/i.test(sha256Hash))
      throw new Error("ERR_INVALID_HASH");
    if (typeof fileSize === "number" && fileSize > MAX_FILE_SIZE_BYTES) {
      throw new Error("ERR_FILE_TOO_LARGE");
    }

    logger.info("Checking hash", { sha256Hash, fileName });

    // ── 4. Check our DB cache first (avoid redundant VT API calls) ───────────
    const { data: cached } = await supabase
      .from("file_scan_results")
      .select("*")
      .eq("sha256_hash", sha256Hash)
      .order("scanned_at", { ascending: false })
      .limit(1)
      .single();

    if (cached) {
      logger.info("Cache hit — returning stored result", { sha256Hash });
      return new Response(
        JSON.stringify({ success: true, result: cached, cached: true }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        },
      );
    }

    // ── 5. Query VirusTotal v3 ────────────────────────────────────────────────
    const vtApiKey = Deno.env.get("VIRUSTOTAL_API_KEY");
    if (!vtApiKey) throw new Error("ERR_VT_KEY_NOT_CONFIGURED");

    const vtRes = await fetch(`${VT_API_BASE}/files/${sha256Hash}`, {
      headers: {
        "x-apikey": vtApiKey,
        Accept: "application/json",
      },
    });

    const vtData: VTResponse = await vtRes.json();

    // ── 6. Handle "not found" gracefully (new/rare file) ─────────────────────
    let malicious = 0;
    let suspicious = 0;
    let undetected = 0;
    let totalEngines = 0;
    let verdict = "unknown";
    let vtLink: string | null = null;

    if (vtRes.status === 200 && vtData.data?.attributes) {
      const stats = vtData.data.attributes.last_analysis_stats;
      malicious = stats.malicious;
      suspicious = stats.suspicious;
      undetected = stats.undetected;
      totalEngines =
        malicious +
        suspicious +
        undetected +
        (stats.harmless ?? 0) +
        (stats.timeout ?? 0);
      verdict = computeVerdict(malicious, suspicious);
      vtLink = `https://www.virustotal.com/gui/file/${sha256Hash}`;
      logger.info("VT response received", { malicious, suspicious, verdict });
    } else if (vtRes.status === 404) {
      // Hash not known to VirusTotal — treat as unknown (not inherently safe)
      verdict = "unknown";
      logger.info("Hash not found in VirusTotal database", { sha256Hash });
    } else {
      // VT API error
      logger.warn("VirusTotal API error", { status: vtRes.status, vtData });
      throw new Error(
        `ERR_VT_API: ${vtData.error?.message ?? "Unknown VT error"}`,
      );
    }

    // ── 7. Persist the result for this user ──────────────────────────────────
    const { data: saved, error: insertError } = await supabase
      .from("file_scan_results")
      .insert({
        user_id: user.id,
        file_name: fileName ?? "unknown",
        file_size: fileSize ?? 0,
        sha256_hash: sha256Hash,
        malicious,
        suspicious,
        undetected,
        total_engines: totalEngines,
        verdict,
        vt_link: vtLink,
      })
      .select("*")
      .single();

    if (insertError) {
      logger.warn("Failed to persist scan result", { error: insertError });
      // Non-fatal — still return the VT data to the user
    }

    logger.info("Scan complete", { verdict, sha256Hash });

    return new Response(
      JSON.stringify({
        success: true,
        result: saved ?? {
          sha256_hash: sha256Hash,
          malicious,
          suspicious,
          undetected,
          total_engines: totalEngines,
          verdict,
          vt_link: vtLink,
          file_name: fileName ?? "unknown",
          file_size: fileSize ?? 0,
          scanned_at: new Date().toISOString(),
        },
        cached: false,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error: unknown) {
    const e = error as Error;
    logger.error("Request failed", e);
    const statusMap: Record<string, number> = {
      ERR_AUTH_EXPIRED: 401,
      ERR_HANDSHAKE_FAILED: 401,
      ERR_RATE_LIMIT_EXCEEDED: 429,
      ERR_MISSING_HASH: 400,
      ERR_INVALID_HASH: 400,
      ERR_FILE_TOO_LARGE: 413,
      ERR_VT_KEY_NOT_CONFIGURED: 503,
    };
    const status = statusMap[e.message] ?? 500;
    return new Response(JSON.stringify({ error: e.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status,
    });
  }
});
