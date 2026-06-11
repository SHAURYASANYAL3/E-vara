import { useState } from "react";
import {
  Shield,
  Calendar,
  Users,
  Building,
  Mail,
  ChevronRight,
  CheckCircle2,
  Globe,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";
import { supabase } from "@/integrations/supabase/client";
import { log } from "@/lib/observability";

const BookDemo = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    timeframe: "As soon as possible",
  });

  useSEO({
    title: "Schedule a Demo",
    description:
      "Establish your defense perimeter. Schedule a technical demonstration of the E-VARA Identity Defense Engine.",
    canonicalUrl: "https://e-vara.vercel.app/book-demo",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const { error } = await supabase.from("agency_leads").insert({
        name: formData.name,
        email: formData.email,
        organization: formData.organization,
        timeframe: formData.timeframe,
      });

      if (error) {
        log("error", "Supabase Error in BookDemo", { error });
        alert(`Transmission failed: ${error.message}`);
      } else {
        setSubmitted(true);
      }
    } catch (error) {
      log("error", "Network protocol error in BookDemo", { error });
      alert("Network protocol error. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#050608] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full p-12 rounded-[24px] border border-success/20 bg-success/5 backdrop-blur-xl animate-fade-in security-orange-glow">
          <div className="p-4 bg-success/10 rounded-full w-fit mx-auto mb-6">
            <CheckCircle2 className="h-12 w-12 text-success" />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">
            Protocol Established
          </h2>
          <p className="text-muted-foreground font-mono text-sm leading-relaxed mb-8">
            Your intelligence briefing has been queued. An operative will
            contact you within 2 business hours to establish secure
            communications.
          </p>
          <Link to="/">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-[14px] py-6 font-bold uppercase tracking-widest text-xs">
              Return to Grid
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050608] text-foreground selection:bg-primary/30 overflow-x-hidden">
      {/* Navigation */}
      <nav className="h-20 border-b border-white/5 bg-[#050608]/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto h-full px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight uppercase font-mono">
              E-VARA
            </span>
          </Link>
          <Link to="/client-portal">
            <Button
              variant="outline"
              className="border-white/10 rounded-[12px] text-[10px] uppercase font-bold tracking-widest"
            >
              Client Portal
            </Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-20 items-center max-w-6xl mx-auto">
          {/* Content side */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
              <Globe className="h-3 w-3" /> Global Intelligence Briefing
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] mb-8">
              Establish Your <br />
              <span className="text-primary">Defense Perimeter.</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-12 font-body leading-relaxed max-w-lg">
              Schedule a technical demonstration of the E-Vara Identity Defense
              Engine. See how we protect high-value targets in real-time.
            </p>

            <div className="space-y-8">
              {[
                {
                  icon: <Clock className="text-secondary" />,
                  title: "30-Minute Briefing",
                  desc: "A tailored walkthrough of your current threat surface.",
                },
                {
                  icon: <Users className="text-secondary" />,
                  title: "Executive Consultation",
                  desc: "Strategy session for high-net-worth identity protection.",
                },
                {
                  icon: <ShieldCheck className="text-secondary" />,
                  title: "Full System Audit",
                  desc: "Live demonstration of our automated PDF dossier generation.",
                },
              ].map((item, i) => (
                <div key={i} className="flex gap-6">
                  <div className="mt-1 h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0 border border-secondary/20">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg uppercase tracking-wide">
                      {item.title}
                    </h4>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form side */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-[32px] blur-3xl opacity-30" />
            <div className="relative rounded-[24px] border border-white/10 bg-[#11141B] p-8 md:p-12 shadow-2xl overflow-hidden shadow-primary/5">
              <div className="absolute inset-0 hud-grid opacity-[0.05] pointer-events-none" />

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                      Full Designation
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
                      <input
                        name="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                        className="w-full pl-10 rounded-[12px] border border-white/10 bg-[#050608]/50 px-4 py-3 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                        placeholder="John Wick"
                        maxLength={100}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                      Work Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                        className="w-full pl-10 rounded-[12px] border border-white/10 bg-[#050608]/50 px-4 py-3 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                        placeholder="target@company.com"
                        maxLength={255}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                    Organization Details
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
                    <input
                      name="organization"
                      value={formData.organization}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          organization: e.target.value,
                        })
                      }
                      required
                      className="w-full pl-10 rounded-[12px] border border-white/10 bg-[#050608]/50 px-4 py-3 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                      placeholder="Continental Corp"
                      maxLength={150}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                    Preferred Timeframe
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40" />
                    <select
                      name="timeframe"
                      value={formData.timeframe}
                      onChange={(e) =>
                        setFormData({ ...formData, timeframe: e.target.value })
                      }
                      className="w-full pl-10 appearance-none rounded-[12px] border border-white/10 bg-[#050608]/50 px-4 py-3 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                    >
                      <option>As soon as possible</option>
                      <option>Next 24 hours</option>
                      <option>This week</option>
                      <option>Next week</option>
                    </select>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-[14px] py-8 text-sm font-bold uppercase tracking-[0.3em] security-orange-glow transition-all"
                >
                  {loading
                    ? "Establishing Link..."
                    : "Initialize Briefing Request"}{" "}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>

                <p className="text-[9px] text-center text-muted-foreground uppercase tracking-widest leading-relaxed">
                  By submitting, you agree to establish secure identity
                  monitoring protocols and encrypted data exchange.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDemo;
