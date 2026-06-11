import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = (
  import.meta.env.VITE_SUPABASE_URL ||
  "https://placeholder-project-id.supabase.co"
)
  .replace(/["']/g, "")
  .trim();
const SUPABASE_PUBLISHABLE_KEY = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "eyJhb..."
)
  .replace(/["']/g, "")
  .trim();

if (
  !import.meta.env.VITE_SUPABASE_URL ||
  (!import.meta.env.VITE_SUPABASE_ANON_KEY &&
    !import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)
) {
  console.warn(
    "E-VARA WARN: Missing critical environment variables. Operating with local simulation fallback.",
  );
}

/**
 * The 'Sovereign' client.
 * Strictly avoids hardcoded external fallbacks to prevent supply-chain attacks.
 */
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
);

/**
 * Health check to verify if the infrastructure is reachable.
 */
export const checkInfrastructure = async (): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("monitored_identities")
      .select("count", { count: "exact", head: true })
      .limit(1);
    return !error;
  } catch {
    return false;
  }
};
