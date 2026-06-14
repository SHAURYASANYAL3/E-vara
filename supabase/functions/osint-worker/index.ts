import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Logger } from "../shared/logger.ts";

serve(async (req) => {
  const traceId = req.headers.get("x-request-id") || crypto.randomUUID();
  const logger = new Logger("osint-worker", traceId);
  logger.info("Worker started");

  // This function should be triggered via pg_net or cron
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const workerId = crypto.randomUUID();

  // 1. Claim Jobs (Lease Locking)
  // Calculate lease expiry as 2 minutes from now.
  const leaseExpiry = new Date(Date.now() + 120000).toISOString();

  const { data: jobs, error: claimError } = await supabase
    .from("osint_jobs")
    .update({
      status: "processing",
      locked_by: workerId,
      locked_at: new Date().toISOString(),
      lease_expiry_at: leaseExpiry,
      last_heartbeat_at: new Date().toISOString(),
    })
    .eq("status", "pending")
    .lte("next_run_at", new Date().toISOString())
    .is("locked_by", null)
    .select("*")
    .limit(10);

  if (claimError) {
    logger.error("Failed to claim jobs", claimError);
    return new Response(JSON.stringify({ error: claimError }), { status: 500 });
  }

  if (!jobs || jobs.length === 0) {
    logger.info("No pending jobs");
    return new Response(JSON.stringify({ message: "No pending jobs" }), {
      status: 200,
    });
  }

  const osintApiKey = Deno.env.get("EXTERNAL_OSINT_API_KEY");

  for (const job of jobs) {
    try {
      // Real OSINT Provider Integrations (HIBP & DeHashed)
      const hibpApiKey = Deno.env.get("HIBP_API_KEY");
      const dehashedApiKey = Deno.env.get("DEHASHED_API_KEY");
      const dehashedEmail = Deno.env.get("DEHASHED_EMAIL");

      type Finding = {
        source: string;
        severity: string;
        data_types: string[];
        date: string;
      };
      let findings: Finding[] = [];

      if (hibpApiKey) {
        // HIBP Integration
        const hibpRes = await fetch(
          `https://haveibeenpwned.com/api/v3/breachedaccount/${job.identity_hash}?truncateResponse=false`,
          {
            headers: {
              "hibp-api-key": hibpApiKey,
              "user-agent": "E-VARA-OSINT-Engine",
            },
          },
        );

        if (hibpRes.ok) {
          const hibpData = await hibpRes.json();
          type HIBPData = {
            Name: string;
            DataClasses: string[];
            BreachDate: string;
          };
          findings = findings.concat(
            hibpData.map((b: HIBPData) => ({
              source: b.Name,
              severity: b.DataClasses.includes("Passwords") ? "high" : "medium",
              data_types: b.DataClasses,
              date: b.BreachDate,
            })),
          );
        } else if (hibpRes.status !== 404) {
          logger.warn(`HIBP API returned ${hibpRes.status}`);
        }
      }

      if (dehashedApiKey && dehashedEmail) {
        // DeHashed Integration (Example of deeper threat intelligence)
        const dehashedRes = await fetch(
          `https://api.dehashed.com/search?query=${job.identity_hash}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Basic ${btoa(`${dehashedEmail}:${dehashedApiKey}`)}`,
            },
          },
        );

        if (dehashedRes.ok) {
          const dehashedData = await dehashedRes.json();
          if (dehashedData.entries) {
            type DeHashedEntry = {
              database_name?: string;
              password?: string;
              email?: string;
            };
            findings = findings.concat(
              dehashedData.entries.map((e: DeHashedEntry) => ({
                source: e.database_name || "Dark Web Dump",
                severity: e.password ? "high" : "medium",
                data_types: [
                  e.email ? "Email" : null,
                  e.password ? "Passwords" : null,
                ].filter(Boolean) as string[],
                date: new Date().toISOString(), // DeHashed entries often lack strict dates
              })),
            );
          }
        }
      }

      // Fallback/Demo Mock Data if no keys are configured (for investor demo purposes)
      if (!hibpApiKey && !dehashedApiKey) {
        findings = [
          {
            source: "Simulated Dark Web Dump",
            severity: "high",
            data_types: ["Passwords", "Emails"],
            date: "2023-01-15",
          },
          {
            source: "Simulated Telegram Combolist",
            severity: "medium",
            data_types: ["Phone Numbers"],
            date: "2024-02-22",
          },
        ];
      }

      // Ensure jobs array is typed as jsonb
      const { error: insertError } = await supabase
        .from("identity_breaches")
        .insert(
          findings.map((f: Finding) => ({
            user_id: job.user_id,
            identity_id: job.identity_id,
            source_name: f.source,
            severity: f.severity,
            data_types: f.data_types,
            leak_date: f.date,
          })),
        );

      if (insertError) throw insertError;

      // Mark completed
      await supabase
        .from("osint_jobs")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          locked_by: null,
          lease_expiry_at: null,
        })
        .eq("id", job.id);
    } catch (error: unknown) {
      const e = error as Error;
      logger.error(`Job processing failed for job ${job.id}`, e);
      // Exponential backoff handled by Reaper, but we can set pending here if we catch it
      await supabase
        .from("osint_jobs")
        .update({
          status: "pending",
          locked_by: null,
          lease_expiry_at: null,
          error_log: e.message,
        })
        .eq("id", job.id);
    }
  }

  logger.info("Worker completed", { processed: jobs.length });
  return new Response(JSON.stringify({ processed: jobs.length }), {
    status: 200,
  });
});
