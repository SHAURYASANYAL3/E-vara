import { useEffect, useMemo, useState } from "react";

const stages = [
  "Initializing System...",
  "Loading Security Modules...",
  "Establishing Secure Environment...",
  "System Ready",
];

interface FuturisticSplashProps {
  onDone: () => void;
}

const FuturisticSplash = ({ onDone }: FuturisticSplashProps) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStage((prev) => Math.min(prev + 1, stages.length - 1));
    }, 1300);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (stage === stages.length - 1) {
      const timeout = setTimeout(onDone, 900);
      return () => clearTimeout(timeout);
    }
  }, [stage, onDone]);

  const progress = useMemo(() => ((stage + 1) / stages.length) * 100, [stage]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#0a0f1c] text-[#00e5ff]">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,229,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.15) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
      <div className="scan-lines absolute inset-0" />

      <div className="relative flex h-full flex-col items-center justify-center px-4">
        <div className="hud-ring relative mb-8 h-36 w-36 rounded-full border border-cyan-300/40">
          <div className="logo-pulse absolute inset-[28%] rounded-full border border-cyan-300/40" />
        </div>
        <h1 className="mb-3 text-4xl font-semibold tracking-[0.25em]">
          E-VARA
        </h1>
        <p className="mb-6 min-h-6 text-sm tracking-[0.12em] text-cyan-100">
          {stages[stage]}
        </p>
        <div className="h-1 w-full max-w-sm overflow-hidden rounded bg-cyan-950">
          <div
            className="h-full bg-[#00e5ff] shadow-[0_0_14px_#00e5ff] transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <style>{`
        .scan-lines::before {content:"";position:absolute;inset:0;background:linear-gradient(to bottom, transparent 0%, rgba(0,229,255,.2) 48%, transparent 52%, transparent 100%);animation:scan 2.6s linear infinite;}
        .hud-ring {animation:spin 8s linear infinite; box-shadow:0 0 24px rgba(0,229,255,.35);}
        .logo-pulse {animation:pulse 1.8s ease-in-out infinite;}
        @keyframes scan {0%{transform:translateY(-100%)}100%{transform:translateY(100%)}}
        @keyframes spin {from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes pulse {0%,100%{box-shadow:0 0 8px rgba(0,229,255,.3)}50%{box-shadow:0 0 26px rgba(0,229,255,.85)}}
      `}</style>
    </div>
  );
};

export default FuturisticSplash;
