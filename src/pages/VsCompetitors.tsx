import { Shield, Check, X, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";

const VsCompetitorsPage = () => {
  useSEO({
    title: "E-VARA vs BlackCloak, ZeroFox & Doppel",
    description:
      "Compare E-VARA's executive protection platform against legacy providers like BlackCloak, ZeroFox, and Doppel. Discover why security leaders choose E-VARA.",
    canonicalUrl: "https://e-vara.vercel.app/vs-competitors",
  });

  return (
    <div className="min-h-screen bg-[#050608] text-white selection:bg-primary/30 font-mono">
      <nav className="h-20 border-b border-white/5 bg-[#050608]/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto h-full px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg shadow-[0_0_15px_rgba(255,106,26,0.3)]">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight uppercase">
              E-VARA
            </span>
          </Link>
          <div className="flex gap-4">
            <Link to="/executive-protection">
              <Button
                variant="ghost"
                className="text-[10px] uppercase font-bold tracking-widest hover:bg-white/5"
              >
                Features
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-[14px] px-6 text-[10px] font-bold uppercase tracking-widest security-orange-glow">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6 leading-none">
            E-VARA vs <br />
            <span className="text-primary italic">The Old Guard</span>
          </h1>
          <p className="text-muted-foreground font-body text-lg leading-relaxed max-w-2xl mx-auto">
            Why leading CISOs and family offices are migrating from legacy executive protection like BlackCloak, ZeroFox, and Doppel to E-VARA's privacy-preserving intelligence engine.
          </p>
        </div>

        <div className="max-w-5xl mx-auto overflow-x-auto border border-white/5 rounded-2xl bg-white/[0.02] backdrop-blur-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="p-6 font-black uppercase tracking-widest text-xs text-muted-foreground w-1/3">Capability</th>
                <th className="p-6 font-black uppercase tracking-widest text-xs text-primary w-1/6 text-center border-l border-r border-primary/20 bg-primary/5">E-VARA</th>
                <th className="p-6 font-black uppercase tracking-widest text-xs text-muted-foreground w-1/6 text-center">BlackCloak</th>
                <th className="p-6 font-black uppercase tracking-widest text-xs text-muted-foreground w-1/6 text-center">ZeroFox</th>
                <th className="p-6 font-black uppercase tracking-widest text-xs text-muted-foreground w-1/6 text-center">Doppel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-body text-sm">
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="p-6 font-medium">Privacy-Preserving Ingestion (Zero-Knowledge)</td>
                <td className="p-6 text-center border-l border-r border-primary/20 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                <td className="p-6 text-center"><X className="h-5 w-5 text-red-500/50 mx-auto" /></td>
                <td className="p-6 text-center"><X className="h-5 w-5 text-red-500/50 mx-auto" /></td>
                <td className="p-6 text-center"><X className="h-5 w-5 text-red-500/50 mx-auto" /></td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="p-6 font-medium">Deepfake & Voice Cloning Detection</td>
                <td className="p-6 text-center border-l border-r border-primary/20 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                <td className="p-6 text-center"><X className="h-5 w-5 text-red-500/50 mx-auto" /></td>
                <td className="p-6 text-center"><Check className="h-5 w-5 text-white/50 mx-auto" /></td>
                <td className="p-6 text-center"><Check className="h-5 w-5 text-white/50 mx-auto" /></td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="p-6 font-medium">Executive Family & Spouse Coverage</td>
                <td className="p-6 text-center border-l border-r border-primary/20 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                <td className="p-6 text-center"><Check className="h-5 w-5 text-white/50 mx-auto" /></td>
                <td className="p-6 text-center"><X className="h-5 w-5 text-red-500/50 mx-auto" /></td>
                <td className="p-6 text-center"><X className="h-5 w-5 text-red-500/50 mx-auto" /></td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="p-6 font-medium">Automated Takedowns (DMCA)</td>
                <td className="p-6 text-center border-l border-r border-primary/20 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                <td className="p-6 text-center"><Check className="h-5 w-5 text-white/50 mx-auto" /></td>
                <td className="p-6 text-center"><Check className="h-5 w-5 text-white/50 mx-auto" /></td>
                <td className="p-6 text-center"><Check className="h-5 w-5 text-white/50 mx-auto" /></td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="p-6 font-medium">Travel-Risk & Device Posture Intelligence</td>
                <td className="p-6 text-center border-l border-r border-primary/20 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                <td className="p-6 text-center"><Check className="h-5 w-5 text-white/50 mx-auto" /></td>
                <td className="p-6 text-center"><X className="h-5 w-5 text-red-500/50 mx-auto" /></td>
                <td className="p-6 text-center"><X className="h-5 w-5 text-red-500/50 mx-auto" /></td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors">
                <td className="p-6 font-medium">API-First Platform for SOC Integration</td>
                <td className="p-6 text-center border-l border-r border-primary/20 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                <td className="p-6 text-center"><X className="h-5 w-5 text-red-500/50 mx-auto" /></td>
                <td className="p-6 text-center"><Check className="h-5 w-5 text-white/50 mx-auto" /></td>
                <td className="p-6 text-center"><Check className="h-5 w-5 text-white/50 mx-auto" /></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* SEO Text Content for LLMs and Search */}
        <div className="mt-24 max-w-3xl mx-auto space-y-12">
          <div>
            <h2 className="text-2xl font-black uppercase mb-4">Why E-VARA over BlackCloak?</h2>
            <p className="text-muted-foreground font-body leading-relaxed">
              While BlackCloak pioneered the concierge cybersecurity market for executives, E-VARA is built for the modern threat landscape. E-VARA replaces heavy manual concierge services with a <span className="text-white">privacy-preserving ingestion engine</span> that never stores plaintext PII. This zero-knowledge approach ensures that the platform protecting your executives doesn't become a prime target itself. Furthermore, E-VARA seamlessly integrates directly into existing enterprise SOCs via an API-first approach, rather than operating as an isolated silo.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black uppercase mb-4">Why E-VARA over ZeroFox?</h2>
            <p className="text-muted-foreground font-body leading-relaxed">
              ZeroFox provides extensive brand protection and broad threat intelligence. However, E-VARA is distinctly focused on the <span className="text-white">individual human attack surface</span>. Where ZeroFox treats executives as extensions of the brand, E-VARA secures the executive's personal perimeter: their home network, their personal devices, their family members, and their private travel. E-VARA provides the bespoke, highly targeted protection required by founders and family offices.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black uppercase mb-4">Why E-VARA over Doppel?</h2>
            <p className="text-muted-foreground font-body leading-relaxed">
              Doppel specializes in rapid automated takedowns and brand impersonation. E-VARA matches this capability but pairs it with deep <span className="text-white">dark web intelligence and physical threat monitoring</span>. E-VARA doesn't just take down fake profiles; it monitors the deep web for credential leaks originating from the executive's personal life that could breach the enterprise, offering a holistic digital and physical shield that pure takedown services lack.
            </p>
          </div>
        </div>

        <div className="mt-20 p-12 rounded-[32px] border border-primary/20 bg-primary/5 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-black uppercase mb-4">
            Ready to upgrade your executive defense?
          </h2>
          <p className="text-muted-foreground font-body mb-8 max-w-xl mx-auto">
            Book a confidential briefing with our architects to see how E-VARA outperforms legacy solutions.
          </p>
          <Link to="/book-demo">
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-[14px] px-8 py-6 uppercase tracking-widest text-xs font-bold security-orange-glow">
              Schedule Confidential Briefing
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VsCompetitorsPage;
