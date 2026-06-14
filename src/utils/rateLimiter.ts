import { supabase } from "@/integrations/supabase/client";

/**
 * Evaluates request allowance against a Supabase sliding window configuration.
 * @param identifier Unique client key (e.g., ip address, user account hash, email)
 * @param maxRequests Max requests permitted inside the frame
 * @param windowSeconds Duration of the rate limit frame in seconds
 */
export async function isRateLimited(
  identifier: string,
  maxRequests: number = 60,
  windowSeconds: number = 60
): Promise<{ allowed: boolean; currentLimit: number }> {
  try {
    const { data, error } = await supabase.rpc("check_rate_limit", {
      p_identifier: identifier,
      p_max_requests: maxRequests,
      p_window_seconds: windowSeconds,
    });

    if (error) throw error;

    return {
      allowed: Boolean(data),
      currentLimit: maxRequests,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Rate limiting engine error:", errorMessage);
    return { allowed: true, currentLimit: maxRequests };
  }
}
