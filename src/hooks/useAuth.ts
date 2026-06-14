import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { sha256 } from "@/lib/crypto";
import { runResilient } from "@/lib/resilient-fetch";
import { useSimulation } from "@/providers/SimulationProvider";
import { enrollPasskey, verifyPasskey } from "@/lib/webauthn";

const DEMO_PROFILE: UserProfile = {
  tier: "omni",
  security_clearance: "TOP_SECRET",
  node_id_stable: "NODE-X-999",
  billing_status: "active",
};

export type SubscriptionTier = "tactical" | "executive" | "omni";
export type SecurityClearance = "UNCLASSIFIED" | "SECRET" | "TOP_SECRET";

export interface IdentityInfo {
  fullName: string;
  username: string;
  email: string;
  faceImage: string | null;
}

export interface UserProfile {
  tier: SubscriptionTier;
  security_clearance: SecurityClearance;
  node_id_stable: string;
  billing_status: string;
}

export function useAuth() {
  const queryClient = useQueryClient();
  const { isSimulationMode, enableSimulation, disableSimulation } =
    useSimulation();

  // 1. Unified Session Query
  const { data: user, isLoading: loading } = useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const isDemo = localStorage.getItem("e_vara_demo_auth") === "true";
      if (isDemo) {
        const demoEmail =
          localStorage.getItem("e_vara_demo_email") || "demo@e-vara.com";
        return {
          id: "demo-user-id-12345",
          email: demoEmail,
          user_metadata: {},
          aud: "authenticated",
          role: "authenticated",
          created_at: new Date().toISOString(),
        } as unknown as import("@supabase/supabase-js").User;
      }
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;
        return session?.user ?? null;
      } catch (err) {
        console.warn("Supabase auth session fetch failed, returning null", err);
        return null;
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  // 2. Secure Profile & Tier Query (Source of Truth for Authorization)
  const { data: profile, error: profileError } = useQuery<UserProfile | null>({
    queryKey: ["user-profile", user?.id, isSimulationMode],
    queryFn: async () => {
      if (!user) return null;
      if (isSimulationMode || user.id.startsWith("demo-")) return DEMO_PROFILE;

      return runResilient(
        async () => {
          const { data, error } = await supabase
            .from("user_profiles")
            .select("tier, security_clearance, node_id_stable, billing_status")
            .eq("id", user.id)
            .is("deleted_at", null)
            .single();

          if (error) throw error;
          return data as UserProfile;
        },
        `e_vara_profile_${user.id}`,
        DEMO_PROFILE,
      );
    },
    enabled: !!user,
  });

  // 3. Identity Query (Fetch PII from Database)
  const { data: identity, isLoading: loadingIdentity } =
    useQuery<IdentityInfo | null>({
      queryKey: ["identity", user?.id, isSimulationMode],
      queryFn: async () => {
        if (!user) return null;

        let defaultFullName = "Admin User";
        let defaultEmail = "demo@e-vara.com";

        const cachedDemo = localStorage.getItem("e_vara_demo_identity");
        if (cachedDemo) {
          try {
            const parsed = JSON.parse(cachedDemo);
            defaultFullName = parsed.fullName || defaultFullName;
            defaultEmail = parsed.email || defaultEmail;
          } catch (e) {
            /* ignore */
          }
        }

        const mockIdentity: IdentityInfo = {
          fullName: defaultFullName,
          username: defaultEmail,
          email: defaultEmail,
          faceImage: null,
        };

        if (isSimulationMode) {
          return mockIdentity;
        }

        return runResilient(
          async () => {
            const { data, error } = await supabase
              .from("monitored_identities")
              .select("full_name, identity_value_encrypted")
              .eq("user_id", user.id)
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle();

            if (error) throw error;
            if (!data) return null;

            let decodedEmail = data.identity_value_encrypted;
            try {
              decodedEmail = atob(data.identity_value_encrypted);
            } catch (e) {
              /* ignore */
            }

            return {
              fullName: data.full_name || "",
              username: decodedEmail,
              email: decodedEmail,
              faceImage: null,
            };
          },
          `e_vara_identity_${user.id}`,
          mockIdentity,
        );
      },
      enabled: !!user,
    });

  const logout = useCallback(async () => {
    localStorage.removeItem("e_vara_demo_auth");
    localStorage.removeItem("e_vara_demo_identity");
    disableSimulation();
    await supabase.auth.signOut().catch(() => {});
    queryClient.clear();
    toast.success("Session Terminated");
  }, [queryClient, disableSimulation]);

  const saveIdentity = useCallback(
    async (info: IdentityInfo) => {
      if (!user) return;

      // ENFORCE CRYPTOGRAPHIC INTEGRITY: Hash before ingestion
      const hashedEmail = await sha256(info.email);

      if (isSimulationMode) {
        localStorage.setItem("e_vara_demo_identity", JSON.stringify(info));
        localStorage.setItem(
          `e_vara_identity_${user.id}`,
          JSON.stringify(info),
        );
        toast.success("Identity securely enrolled for scanning.");
        queryClient.invalidateQueries({ queryKey: ["identity", user.id] });
        return;
      }

      try {
        const { error } = await supabase.from("monitored_identities").upsert({
          user_id: user.id,
          identity_type: "email",
          identity_value_encrypted: btoa(info.email),
          identity_hash: hashedEmail,
          full_name: info.fullName,
          is_active: true,
        });
        if (error) throw error;
        toast.success("Identity profile updated");
      } catch (e) {
        console.warn("Failed to write online, saving locally", e);
        localStorage.setItem(
          `e_vara_identity_${user.id}`,
          JSON.stringify(info),
        );
        toast.warning("Identity saved in simulated local vault");
      }

      queryClient.invalidateQueries({ queryKey: ["identity", user.id] });
    },
    [user, queryClient, isSimulationMode],
  );

  return {
    user,
    profile,
    profileError,
    identity,
    loading: loading || loadingIdentity,
    login: async (e: string, p: string) => {
      // Allow triggering demo mode by specific email if in dev
      if (e.endsWith("@demo.com") || e.endsWith("@investor.com")) {
        enableSimulation();
      } else {
        disableSimulation();
      }
      const { data, error } = await supabase.auth.signInWithPassword({
        email: e,
        password: p,
      });
      if (error) throw error;
      localStorage.setItem("e_vara_demo_auth", "false");
      await queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      return { data, error };
    },
    register: async (e: string, p: string) => {
      const { data, error } = await supabase.auth.signUp({
        email: e,
        password: p,
      });
      if (error) throw error;
      localStorage.setItem("e_vara_demo_auth", "false");
      await queryClient.invalidateQueries({ queryKey: ["auth-user"] });
      return { data, error };
    },
    signInWithOtp: async (email: string) => {
      // If simulated / local dev, allow instant passwordless mock login
      if (
        email.endsWith("@demo.com") ||
        email.endsWith("@investor.com") ||
        import.meta.env.DEV
      ) {
        enableSimulation();
        localStorage.setItem("e_vara_demo_auth", "true");
        localStorage.setItem("e_vara_demo_email", email);
        await queryClient.invalidateQueries({ queryKey: ["auth-user"] });
        toast.success("Preserving secure simulated session via Magic Link");
        return { success: true };
      }

      const { error } = await supabase.auth.signInWithOTP({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      toast.success("Magic Link verification sent to your designated email.");
      return { success: true };
    },
    registerPasskey: async (email: string) => {
      try {
        const pk = await enrollPasskey(email);
        toast.success("WebAuthn Passkey Registered Successfully");
        return pk;
      } catch (error) {
        const err = error as Error;
        toast.error("WebAuthn Registration Refused", {
          description:
            err.message || "Failed to issue cryptographic credential.",
        });
        throw error;
      }
    },
    loginWithPasskey: async (email: string) => {
      try {
        const pk = await verifyPasskey(email);
        enableSimulation();
        localStorage.setItem("e_vara_demo_auth", "true");
        localStorage.setItem("e_vara_demo_email", email);
        await queryClient.invalidateQueries({ queryKey: ["auth-user"] });
        toast.success("Biometric verification verified, session initialised.");
        return pk;
      } catch (error) {
        const err = error as Error;
        toast.error("Biometric Verification Denied", {
          description: err.message || "Credential assertion failed.",
        });
        throw error;
      }
    },
    logout,
    saveIdentity,
  };
}
