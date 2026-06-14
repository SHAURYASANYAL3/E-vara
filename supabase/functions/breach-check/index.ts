import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Logger } from "../shared/logger.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Simple in-memory rate limiter (persists per edge isolate)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 5; // Max 5 requests per minute per user

serve(async (req) => {
  const traceId = req.headers.get("x-request-id") || crypto.randomUUID();
  const logger = new Logger("breach-check", traceId);

  if (req.method === "OPTIONS")
    return new Response("ok", { headers: corsHeaders });

  logger.info("Request started", { method: req.method });

  try {
    // 1. TRUSTLESS AUTHENTICATION: Derive user_id only from JWT
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

    // RATE LIMITING ENFORCEMENT (DISTRIBUTED P0)
    const { data: limitAllowed, error: rpcError } = await supabase.rpc(
      "check_rate_limit",
      {
        p_user_id: user.id,
        p_endpoint: "breach_check",
        p_max_requests: 5,
        p_window_minutes: 1,
      },
    );

    if (rpcError || !limitAllowed) {
      throw new Error("ERR_RATE_LIMIT_EXCEEDED");
    }

    const { identityHash } = await req.json();
    if (!identityHash) throw new Error("ERR_MISSING_HASH");

    // 2. SOVEREIGN OWNERSHIP VERIFICATION using Cryptographic Hash
    const { data: identity } = await supabase
      .from("monitored_identities")
      .select("id, user_id, identity_type")
      .eq("identity_hash", identityHash)
      .eq("user_id", user.id)
      .single();

    if (!identity) throw new Error("ERR_OWNERSHIP_MISMATCH");

    // 3. ASYNCHRONOUS JOB QUEUE (P0)
    // We reject synchronous OSINT fetches to protect edge function isolates from blocking.
    const { error: jobError } = await supabase.from("osint_jobs").insert({
      user_id: user.id,
      identity_hash: identityHash,
      status: "pending",
    });

    if (jobError) {
      logger.error("Queue insertion failed", jobError);
      throw new Error("ERR_QUEUE_FAILED");
    }

    logger.info("Job queued successfully", { identityHash });
    return new Response(
      JSON.stringify({
        success: true,
        status: "JOB_QUEUED",
        message: "Scan dispatched to distributed queue.",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 202,
      },
    );
  } catch (error: unknown) {
    const e = error as Error;
    logger.error("Request failed", e);
    return new Response(JSON.stringify({ error: e.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
