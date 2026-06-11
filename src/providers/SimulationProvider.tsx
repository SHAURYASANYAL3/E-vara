import React, { createContext, useContext, useState, useEffect } from "react";

interface SimulationContextType {
  isSimulationMode: boolean;
  enableSimulation: () => void;
  disableSimulation: () => void;
  getSimulatedFindings: (
    userId: string,
    identityId: string,
  ) => Record<string, unknown>[];
}

const SimulationContext = createContext<SimulationContextType | undefined>(
  undefined,
);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isSimulationMode, setIsSimulationMode] = useState(false);

  useEffect(() => {
    // Feature flag: Ensure simulation is strictly explicitly enabled
    const flag = localStorage.getItem("e_vara_simulation_mode");
    if (flag === "true" && import.meta.env.DEV) {
      setIsSimulationMode(true);
    }
  }, []);

  const enableSimulation = () => {
    if (!import.meta.env.DEV) return;
    localStorage.setItem("e_vara_simulation_mode", "true");
    setIsSimulationMode(true);
  };

  const disableSimulation = () => {
    localStorage.removeItem("e_vara_simulation_mode");
    setIsSimulationMode(false);
  };

  const getSimulatedFindings = (userId: string, identityId: string) => {
    return [
      {
        id: crypto.randomUUID(),
        user_id: userId,
        identity_id: identityId,
        source_name: "Cleartext Password Dump (Telegram)",
        leak_date: new Date().toISOString().split("T")[0],
        severity: "high",
        data_types: ["email", "passwords", "phone"],
        description:
          "High-value executive credential dump found in private Telegram channels.",
        found_at: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        user_id: userId,
        identity_id: identityId,
        source_name: "Dark Web Ransomware Extortion",
        leak_date: new Date(Date.now() - 86400000 * 5)
          .toISOString()
          .split("T")[0],
        severity: "critical",
        data_types: ["metadata", "financial", "documents"],
        description:
          "Cryptographic signature matches documents indexed in ransomware leak site.",
        found_at: new Date().toISOString(),
      },
      {
        id: crypto.randomUUID(),
        user_id: userId,
        identity_id: identityId,
        source_name: "Underground Forum (Breached.vc)",
        leak_date: new Date(Date.now() - 86400000 * 30)
          .toISOString()
          .split("T")[0],
        severity: "medium",
        data_types: ["email", "metadata"],
        description:
          "Associated email hashes found in massive scraped dataset.",
        found_at: new Date().toISOString(),
      },
    ];
  };

  return (
    <SimulationContext.Provider
      value={{
        isSimulationMode,
        enableSimulation,
        disableSimulation,
        getSimulatedFindings,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error("useSimulation must be used within a SimulationProvider");
  }
  return context;
};
