import {
  Shield,
  Lock,
  Check,
  ArrowUpRight,
  Zap,
  Building,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const BillingPage = () => {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-[#050608] text-foreground font-mono selection:bg-primary/30">
      <nav className="h-20 border-b border-white/5 bg-[#050608]/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/client-portal" className="flex items-center gap-2">
              <div className="p-2 bg-primary rounded-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight uppercase">
                E-VARA
              </span>
            </Link>
          </div>
          <Link to="/client-portal">
            <Button
              variant="ghost"
              className="text-[10px] uppercase font-bold tracking-widest hover:bg-white/5"
            >
              Back to Portal
            </Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
              <Clock className="h-3 w-3" /> Early Access Phase
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">
              Account Status
            </h1>
            <p className="text-muted-foreground font-body">
              Review your operational tier and platform access state.
            </p>
          </header>

          <div className="grid gap-8 mb-12">
            <div className="p-8 rounded-[24px] border border-primary/20 bg-primary/5 relative overflow-hidden">
              <div className="absolute inset-0 hud-grid opacity-[0.05] pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/80 mb-2">
                    Current Protocol
                  </p>
                  <h2 className="text-3xl font-black uppercase mb-4">
                    {profile?.tier || "Tactical"} Defense
                  </h2>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed mb-8 max-w-sm">
                    You are currently enrolled in the E-VARA Early Access
                    program. Core OSINT capabilities are unlocked.
                  </p>
                  <div className="flex gap-4">
                    <Button
                      disabled
                      className="bg-white/5 border border-white/10 text-muted-foreground rounded-[12px] px-6 text-[10px] font-bold uppercase tracking-widest cursor-not-allowed"
                    >
                      Payments On Hold
                    </Button>
                  </div>
                </div>
                <div className="text-left md:text-right flex flex-col justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-1">
                      Status
                    </p>
                    <p className="text-2xl font-black text-white">
                      Active (Waitlist)
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase mt-8 md:mt-0">
                    <Lock className="h-3 w-3" /> Zero-Knowledge Mode
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/5 bg-[#11141B] p-8 text-center max-w-2xl mx-auto">
            <Shield className="h-12 w-12 text-primary/50 mx-auto mb-6" />
            <h3 className="text-lg font-black uppercase mb-4">
              Commercial Operations Paused
            </h3>
            <p className="text-sm text-muted-foreground font-body leading-relaxed mb-8">
              To ensure maximum infrastructure stability and compliance before
              full public availability, we are not accepting new commercial
              payments at this time. All users are currently granted early
              access privileges.
            </p>
            <p className="text-xs font-bold uppercase text-primary tracking-widest">
              You will be notified prior to V1.0 Launch.
            </p>
          </div>

          <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-8 p-8 rounded-[24px] border border-white/5 bg-white/[0.01]">
            <div className="flex items-center gap-4">
              <Building className="h-6 w-6 text-muted-foreground" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest">
                  Enterprise Rollout
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Require immediate dedicated infrastructure deployment?
                </p>
              </div>
            </div>
            <Link to="/book-demo">
              <Button
                variant="outline"
                className="border-white/10 rounded-[12px] text-[10px] uppercase font-bold tracking-widest"
              >
                Contact Command <ArrowUpRight className="ml-2 h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
