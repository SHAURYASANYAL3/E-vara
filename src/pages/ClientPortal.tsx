import {
  Shield,
  Lock,
  Settings,
  HelpCircle,
  LogOut,
  ArrowRight,
  User,
  Terminal,
  Database,
  Bell,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const ClientPortal = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Session Terminated", {
      description: "Secure logout sequence complete.",
    });
    navigate("/");
  };

  const portalActions = [
    {
      title: "Security Dashboard",
      desc: "Access real-time threat monitoring and identity maps.",
      icon: <Terminal className="h-6 w-6 text-primary" />,
      link: "/dashboard",
      color: "border-primary/20 bg-primary/5",
    },
    {
      title: "Identity Records",
      desc: "Manage monitored emails, handles, and digital assets.",
      icon: <Database className="h-6 w-6 text-secondary" />,
      link: "/identity-records",
      color: "border-secondary/20 bg-secondary/5",
    },
    {
      title: "Subscription & Billing",
      desc: "Review your operational tier and billing history.",
      icon: <CreditCard className="h-6 w-6 text-yellow-500" />,
      link: "/billing",
      color: "border-yellow-500/20 bg-yellow-500/5",
    },
    {
      title: "Support Protocol",
      desc: "Establish secure contact with your dedicated account lead.",
      icon: <HelpCircle className="h-6 w-6 text-success" />,
      link: "/support",
      color: "border-success/20 bg-success/5",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050608] text-foreground selection:bg-primary/30 overflow-x-hidden font-mono">
      {/* 01 Navigation */}
      <nav className="h-20 border-b border-white/5 bg-[#050608]/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto h-full px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight uppercase">
              E-VARA
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end border-r border-white/10 pr-6">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                Active Client
              </span>
              <span className="text-xs text-primary/80">
                {user?.email || "Anonymous_User"}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-muted-foreground hover:text-alert transition-colors"
              title="Terminate Session"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <header className="mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
              <Lock className="h-3 w-3" /> Secure Client Portal
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4">
              Welcome Back,{" "}
              <span className="text-primary">
                {user?.email?.split("@")[0] || "Client"}
              </span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl font-body">
              Your perimeter is currently secure. Review your active
              intelligence modules and threat surface analytics below.
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-6">
            {portalActions.map((action) => (
              <Link key={action.title} to={action.link}>
                <div
                  className={`p-8 rounded-[24px] border ${action.color} hover:scale-[1.02] transition-all duration-300 cursor-pointer group h-full flex flex-col justify-between`}
                >
                  <div>
                    <div className="p-3 w-fit rounded-xl bg-white/5 mb-6 group-hover:security-orange-glow transition-all">
                      {action.icon}
                    </div>
                    <h3 className="text-xl font-bold uppercase tracking-tight mb-4">
                      {action.title}
                    </h3>
                    <p className="text-sm text-muted-foreground font-body leading-relaxed">
                      {action.desc}
                    </p>
                  </div>
                  <div className="mt-8 flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Initialize Connection <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 p-8 rounded-[24px] border border-white/5 bg-[#11141B] relative overflow-hidden">
            <div className="absolute inset-0 hud-grid opacity-[0.05]" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                <div className="h-16 w-16 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center">
                  <Bell className="h-8 w-8 text-primary animate-pulse" />
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-widest">
                    Global Threat Feed
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 font-body">
                    0 active critical alerts detected in your sector over the
                    last 24h.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="border-white/10 text-[10px] uppercase font-bold tracking-widest px-8"
              >
                View Feed
              </Button>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-12 border-t border-white/5 mt-20">
        <div className="container mx-auto px-6 text-center">
          <p className="text-[10px] font-mono uppercase text-muted-foreground tracking-[0.4em]">
            © 2026 E-VARA SECURITY SYSTEMS • ENCRYPTED SESSION • SG-0182-ACTIVE
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ClientPortal;
