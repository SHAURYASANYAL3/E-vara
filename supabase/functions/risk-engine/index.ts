import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Logger } from "../shared/logger.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  const traceId = req.headers.get("x-request-id") || crypto.randomUUID();
  const logger = new Logger("risk-engine", traceId);

  if (req.method === "OPTIONS")
    return new Response("ok", { headers: corsHeaders });

  logger.info("Request started", { method: req.method });

  try {
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

    // 1. Fetch Breaches
    const { data: breaches } = await supabase
      .from("identity_breaches")
      .select("severity, leak_date")
      .eq("user_id", user.id);

    // 2. Fetch Devices
    const { data: devices } = await supabase
      .from("trusted_devices")
      .select("is_trusted")
      .eq("user_id", user.id);

    let score = 100;
    let confidence = 95;
    const factors = [];

    // Base factor
    factors.push({
      impact: 0,
      description: "Baseline Security Posture",
      type: "positive",
    });

    // Deduct for breaches
    if (breaches && breaches.length > 0) {
      let breachDeduction = 0;
      breaches.forEach((b) => {
        if (b.severity === "critical") breachDeduction -= 25;
        else if (b.severity === "high") breachDeduction -= 15;
        else if (b.severity === "medium") breachDeduction -= 5;
        else breachDeduction -= 2;
      });
      score += breachDeduction;
      factors.push({
        impact: breachDeduction,
        description: `${breaches.length} Exposures Detected`,
        type: "negative",
      });
      confidence -= 5;
    }

    // Deduct for untrusted devices
    if (devices && devices.length > 0) {
      const untrustedCount = devices.filter((d) => !d.is_trusted).length;
      if (untrustedCount > 0) {
        score -= untrustedCount * 10;
        factors.push({
          impact: -(untrustedCount * 10),
          description: `${untrustedCount} Unverified Devices`,
          type: "negative",
        });
        confidence -= 10;
      }

      const trustedCount = devices.length - untrustedCount;
      if (trustedCount > 0) {
        score += 5;
        factors.push({
          impact: +5,
          description: `${trustedCount} Verified Devices`,
          type: "positive",
        });
      }
    }

    // Floor score at 0
    score = Math.max(0, Math.min(100, score));
    confidence = Math.max(0, confidence);

    // 3. Insert Risk Snapshot
    const { data: snapshot, error: snapshotError } = await supabase
      .from("risk_snapshots")
      .insert({
        user_id: user.id,
        score,
        confidence,
        factors,
      })
      .select("*")
      .single();

    if (snapshotError) throw snapshotError;

    // Trigger registered webhooks for this user (non‑blocking, with timeout)
    try {
      const { data: hooks, error: hooksError } = await supabase
        .from("webhooks")
        .select("url, secret")
        .eq("user_id", user.id);
      if (!hooksError && hooks && hooks.length > 0) {
        for (const hook of hooks) {
          (async () => {
            try {
              const payload = {
                event: "risk_snapshot_created",
                snapshot,
              };
              // HMAC signature
              const encoder = new TextEncoder();
              const key = await crypto.subtle.importKey(
                "raw",
                encoder.encode(hook.secret),
                { name: "HMAC", hash: "SHA-256" },
                false,
                ["sign"],
              );
              const mac = await crypto.subtle.sign(
                "HMAC",
                key,
                encoder.encode(JSON.stringify(payload)),
              );
              const signature =
                "sha256=" +
                Array.from(new Uint8Array(mac))
                  .map((b) => b.toString(16).padStart(2, "0"))
                  .join("");

              const controller = new AbortController();
              const timeout = setTimeout(() => controller.abort(), 3000); // 3 s timeout
              try {
                await fetch(hook.url, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "X-Hub-Signature-256": signature,
                  },
                  body: JSON.stringify(payload),
                  signal: controller.signal,
                });
                logger.info("Webhook delivered successfully", {
                  url: hook.url,
                });
              } catch (e) {
                logger.error("Webhook delivery error (timeout or network)", e);
              } finally {
                clearTimeout(timeout);
              }
            } catch (whError) {
              logger.error("Webhook preparation failed", whError);
            }
          })(); // fire‑and‑forget
        }
      }
    } catch (hookFetchError) {
      logger.error("Fetching webhooks failed", hookFetchError);
    }

    logger.info("Request completed successfully", { score, confidence });
    return new Response(JSON.stringify({ success: true, snapshot }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: unknown) {
    const e = error as Error;
    logger.error("Request failed", e);
    return new Response(JSON.stringify({ error: e.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }

  export default async (req: Request) => {
    const { user_id } = await req.json();

    // Example: query live risk scores from DB or engine
    const findings = [
      { vector: "Phishing Domain", score: 72 },
      { vector: "Compromised Email", score: 85 },
    ];

    return new Response(JSON.stringify({ success: true, findings }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  };
});
