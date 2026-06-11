import { useMemo, useState, useEffect, useRef } from "react";

interface AttackSimulationPanelProps {
  email?: string;
}

const steps = [
  "Email enumeration from public footprint",
  "Pivot to GitHub account through commit metadata",
  "Correlate alias with Instagram bio link",
  "Match handle in known leaked dataset",
];

const AttackSimulationPanel = ({ email }: AttackSimulationPanelProps) => {
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  const personalizedSteps = useMemo(() => {
    const base = [
      "Target Identification",
      "Credential Pivot",
      "Cross-Platform Correlation",
      "Final Exposure Vector",
    ];
    if (!email) return base;

    const domain = email.split("@")[1] || "unknown";
    const user = email.split("@")[0] || "identity";

    return [
      `Initializing search for target: ${user}`,
      `Intercepting MX records for ${domain}`,
      `Correlating metadata from ${user}@public_nodes`,
      `Verified identity link: ${email} -> Active_Leak`,
    ];
  }, [email]);

  const riskSummary = useMemo(() => {
    if (!active) return "Simulation idle. Run to inspect trace path.";
    return stepIndex >= personalizedSteps.length - 1
      ? `Risk Summary: Identity ${email || "target"} can be traced across 4 linked surfaces; weak point is reusable credentials.`
      : "Simulation running... analyzing traversal path.";
  }, [active, stepIndex, personalizedSteps, email]);

  const runSimulation = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }
    setActive(true);
    setStepIndex(0);
    let idx = 0;
    intervalRef.current = window.setInterval(() => {
      idx += 1;
      setStepIndex(Math.min(idx, personalizedSteps.length - 1));
      if (idx >= personalizedSteps.length - 1) {
        if (intervalRef.current) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, 1200);
  };

  return (
    <section className="neon-panel rounded-xl border border-primary/20 p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-sm font-mono font-semibold uppercase tracking-wider text-foreground">
          Identity Traversal Simulation
        </h3>
        <button
          disabled={active}
          onClick={runSimulation}
          className="bg-primary/20 hover:bg-primary/30 border border-primary/40 text-primary text-[10px] font-bold uppercase py-1.5 px-4 rounded-md transition-all disabled:opacity-50"
        >
          Run Simulation
        </button>
      </div>

      <div className="space-y-2">
        {personalizedSteps.map((step, idx) => {
          const reached = active && idx <= stepIndex;
          const weakPoint = idx === personalizedSteps.length - 1;
          return (
            <div
              key={step}
              className={`rounded-md border px-3 py-2 text-[11px] font-mono transition-all duration-500 ${reached ? "translate-x-0 opacity-100" : "translate-x-1 opacity-20"} ${weakPoint && reached ? "border-alert/60 bg-alert/10 text-alert" : "border-white/5 bg-white/[0.02] text-muted-foreground"}`}
            >
              <span className="text-[9px] opacity-50 mr-2">0{idx + 1}</span>
              {step}
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-[10px] font-mono text-muted-foreground bg-black/40 p-2 rounded border border-white/5">
        {riskSummary}
      </p>
    </section>
  );
};

export default AttackSimulationPanel;
