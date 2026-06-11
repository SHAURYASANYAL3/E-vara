import { Activity, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => (
  <section className="relative pt-40 pb-24 overflow-hidden">
    <div className="absolute inset-0 hud-grid opacity-[0.03] pointer-events-none" />
    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

    <div className="container mx-auto px-6 relative z-10">
      <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-8 animate-fade-in">
          <Activity className="h-3 w-3" /> System Status: Operational
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 uppercase animate-fade-in">
          Protect Everything. <br />
          <span className="text-primary tracking-tighter">Trust Nothing.</span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mb-12 font-body animate-fade-in leading-relaxed">
          Continuous detection, response and prevention. The world’s first
          autonomous identity defense platform for high-value targets.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-in">
          <Link to="/auth">
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-[14px] px-10 py-8 text-sm font-bold uppercase tracking-widest security-orange-glow">
              Initialize Secure Environment{" "}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="outline"
            className="border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 rounded-[14px] px-10 py-8 text-sm font-bold uppercase tracking-widest"
          >
            Review Whitepaper
          </Button>
        </div>
      </div>

      {/* Security Dashboard Preview */}
      <div className="mt-24 relative max-w-6xl mx-auto animate-fade-in">
        <div className="absolute -inset-1 bg-gradient-to-b from-primary/20 to-transparent rounded-[32px] blur-2xl opacity-20" />
        <div className="relative rounded-[24px] border border-white/5 bg-[#11141B] p-2 shadow-2xl overflow-hidden shadow-primary/5">
          <div className="absolute inset-0 hud-grid opacity-[0.05]" />
          <div className="rounded-[20px] border border-white/5 bg-[#050608]/50 p-6 backdrop-blur-xl flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-success animate-pulse" />
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                  Live Threat Feed_
                </span>
              </div>
              <div className="flex gap-4">
                <div className="h-1.5 w-12 rounded-full bg-white/5" />
                <div className="h-1.5 w-12 rounded-full bg-white/5" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex flex-col gap-2">
                <span className="text-[10px] font-mono text-muted-foreground uppercase">
                  Identity Matches
                </span>
                <span className="text-3xl font-bold font-mono">1,402</span>
              </div>
              <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex flex-col gap-2">
                <span className="text-[10px] font-mono text-muted-foreground uppercase">
                  Leak Detection
                </span>
                <span className="text-3xl font-bold font-mono text-primary">
                  0
                </span>
              </div>
              <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex flex-col gap-2">
                <span className="text-[10px] font-mono text-muted-foreground uppercase">
                  Network Latency
                </span>
                <span className="text-3xl font-bold font-mono">12ms</span>
              </div>
            </div>

            <div className="h-40 w-full rounded-xl border border-white/5 bg-white/[0.01] flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-[panel-scan_3s_linear_infinite]" />
              <Activity className="h-12 w-12 text-primary/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
