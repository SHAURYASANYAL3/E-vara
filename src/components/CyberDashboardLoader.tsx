import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield } from "lucide-react";

const CyberDashboardLoader = () => {
  const [logs, setLogs] = useState<string[]>([]);

  const bootLogs = useMemo(
    () => [
      "INITIALIZING_KERNEL_V2.5.0",
      "ESTABLISHING_ENCRYPTED_TUNNEL",
      "MAPPING_GLOBAL_THREAT_GRAPH",
      "SYNCING_BIOMETRIC_REGISTRY",
      "LOAD_COMPLETE: SECURE_ENVIRONMENT_READY",
    ],
    [],
  );

  useEffect(() => {
    let currentLog = 0;
    const interval = setInterval(() => {
      if (currentLog < bootLogs.length) {
        setLogs((prev) => [...prev, bootLogs[currentLog]]);
        currentLog++;
      } else {
        clearInterval(interval);
      }
    }, 400);
    return () => clearInterval(interval);
  }, [bootLogs]);

  return (
    <div className="fixed inset-0 z-[1000] bg-[#050505] flex flex-col items-center justify-center p-6 overflow-hidden">
      <div className="absolute inset-0 hud-grid opacity-10" />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative mb-12"
      >
        <div className="absolute -inset-8 bg-[#007AFF]/20 blur-[60px] rounded-full animate-pulse" />
        <Shield className="w-24 h-24 text-[#007AFF] relative z-10" />
      </motion.div>

      <div className="w-full max-w-sm space-y-3 font-mono">
        <AnimatePresence>
          {logs.map((log, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[10px] text-[#007AFF] tracking-widest"
            >
              <span className="text-white/40">
                [{new Date().toLocaleTimeString()}]
              </span>{" "}
              {log}
            </motion.p>
          ))}
        </AnimatePresence>

        {logs.length === bootLogs.length && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            className="h-px bg-gradient-to-r from-transparent via-[#007AFF] to-transparent mt-8"
          />
        )}
      </div>

      <div className="absolute bottom-10 left-0 right-0 text-center">
        <span className="text-[9px] font-mono text-white/10 uppercase tracking-[0.5em]">
          E-Vara_Sovereign_OS
        </span>
      </div>
    </div>
  );
};

export default CyberDashboardLoader;
