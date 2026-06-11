interface ScanStepProps {
  text: string;
  active: boolean;
  done: boolean;
}

const ScanStep = ({ text, active, done }: ScanStepProps) => (
  <div
    className={`rounded-md border px-3 py-2 text-xs tracking-wide transition-all ${active ? "border-cyan-300 bg-cyan-500/10 text-cyan-100 shadow-[0_0_18px_rgba(0,229,255,0.25)]" : done ? "border-cyan-500/40 bg-cyan-500/5 text-cyan-200" : "border-slate-700 bg-slate-900/60 text-slate-400"}`}
  >
    {text}
  </div>
);

export default ScanStep;
