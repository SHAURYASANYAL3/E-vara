import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

export const useDeviceTrust = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["trusted-devices", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trusted_devices")
        .select("*")
        .order("last_seen_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};
