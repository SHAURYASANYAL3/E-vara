import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

export const useIdentityTwin = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["identity-twin", user?.id],
    queryFn: async () => {
      // 1. Fetch latest risk snapshot
      const { data: snapshots, error: snapError } = await supabase
        .from("risk_snapshots")
        .select("*")
        .eq("user_id", user?.id)
        .order("calculated_at", { ascending: false })
        .limit(1);

      if (snapError) throw snapError;

      const latestSnapshot = snapshots?.[0];

      // 2. Determine Freshness
      let scoreStatus = "unavailable";
      if (latestSnapshot) {
        const expiresAt = new Date(latestSnapshot.expires_at).getTime();
        const now = Date.now();
        if (now > expiresAt) {
          scoreStatus = "stale";
        } else {
          scoreStatus = "fresh";
        }
      }

      // 3. Fetch Events
      const { data: events, error: evError } = await supabase
        .from("identity_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (evError) throw evError;

      return {
        score: latestSnapshot?.score ?? null, // NEVER default to 100
        confidence: latestSnapshot?.confidence ?? null,
        factors: latestSnapshot?.factors ?? [],
        lastUpdated: latestSnapshot?.calculated_at ?? null,
        status: scoreStatus,
        recentEvents: events,
      };
    },
    enabled: !!user,
  });
};
