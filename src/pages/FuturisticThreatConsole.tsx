import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ThreatFinding {
  vector: string;
  score: number;
}

const FuturisticThreatConsole = () => {
  const [threats, setThreats] = useState<ThreatFinding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThreats = async () => {
      try {
        setLoading(true);
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const res = await fetch("/functions/v1/risk-engine", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user?.id }),
        });

        const data = await res.json();
        if (data.success) {
          setThreats(data.findings);
        } else {
          throw new Error(data.error?.message || "Risk engine failed");
        }
      } catch (err: unknown) {
        toast({
          title: "Threat Console Error",
          description:
            err instanceof Error ? err.message : "Unable to load live threats.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchThreats();
  }, []);

  if (loading) return <p>Loading live threats...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold">Live Threat Vectors</h2>
      {loading ? (
        <p>Loading live threats...</p>
      ) : (
        <ul>
          {threats.map((t, i) => (
            <li key={i} className="p-2 border-b">
              <span className="font-semibold">{t.vector}</span> — Risk Score:{" "}
              {t.score}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FuturisticThreatConsole;
