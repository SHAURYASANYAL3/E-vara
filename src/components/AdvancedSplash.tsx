import { useEffect, useMemo, useState } from "react";

const SPLASH_STEPS = [
  "Initializing System...",
  "Loading Security Modules...",
  "Establishing Secure Environment...",
  "System Ready",
];

const AdvancedSplash = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev >= SPLASH_STEPS.length - 1) {
          clearInterval(interval);
          setTimeout(onComplete, 600);
          return prev;
        }
        return prev + 1;
      });
      setPulse((v) => !v);
    }, 1100);

    return () => clearInterval(interval);
  }, [onComplete]);

  const progress = useMemo(
    () => ((step + 1) / SPLASH_STEPS.length) * 100,
    [step],
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0f1c] text-[#00e5ff]">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(#00e5ff22 1px, transparent 1px), linear-gradient(90deg, #00e5ff22 1px, transparent 1px)",
          backgroundSize: "38px 38px",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,#00e5ff33_50%,transparent_100%)] bg-[length:100%_220px] animate-[pulse_2.8s_ease-in-out_infinite]" />
      <div className="absolute inset-0 animate-[spin_12s_linear_infinite]">
        <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#00e5ff66] shadow-[0_0_30px_#00e5ff44]" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#00e5ff44]" />
      </div>
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
        <div
          className={`rounded-full border border-[#00e5ff66] px-7 py-4 font-mono text-2xl tracking-[0.4em] transition-all ${pulse ? "shadow-[0_0_35px_#00e5ff]" : "shadow-[0_0_18px_#00e5ff66]"}`}
        >
          E-VARA
        </div>
        <p className="font-mono text-sm text-[#d9faff]">{SPLASH_STEPS[step]}</p>
        <div className="h-1.5 w-full max-w-sm overflow-hidden rounded bg-[#11243f]">
          <div
            className="h-full bg-[#00e5ff] transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdvancedSplash;
