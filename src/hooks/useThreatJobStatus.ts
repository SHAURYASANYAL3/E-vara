import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

export const useThreatJobStatus = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["threat-job-status", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("osint_jobs")
        .select("status, next_run_at, updated_at")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        if (error.code === "PGRST116") return { status: "idle" }; // no job found
        throw error;
      }
      return data;
    },
    enabled: !!user,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "pending" || status === "processing" ? 2000 : false;
    },
  });
};
