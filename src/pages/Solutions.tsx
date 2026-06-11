import {
  Shield,
  Building2,
  Briefcase,
  GraduationCap,
  Server,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";

const SolutionsPage = () => {
  useSEO({
    title: "Enterprise Solutions",
    description:
      "Explore E-VARA's autonomous identity defense solutions tailored for financial, legal, and enterprise sectors.",
    canonicalUrl: "https://e-vara.vercel.app/solutions",
  });

  const solutions = [
    {
      icon: <Building2 className="h-6 w-6 text-primary" />,
      title: "Financial Institutions",
      description:
        "Protect C-suite executives and portfolio managers from targeted spear-phishing and credential stuffing attacks that bypass traditional MFA.",
    },
    {
      icon: <Briefcase className="h-6 w-6 text-primary" />,
      title: "Legal Practices",
      description:
        "Ensure attorney-client privilege is maintained by monitoring the dark web footprints of managing partners and senior counsel.",
    },
    {
      icon: <Server className="h-6 w-6 text-primary" />,
      title: "Managed Service Providers (MSPs)",
      description:
        "White-label the E-VARA engine to offer autonomous identity protection to your entire client portfolio with zero overhead.",
    },
    {
      icon: <GraduationCap className="h-6 w-6 text-primary" />,
      title: "Public Sector & Defense",
      description:
        "Comply with stringent sovereign data requirements while monitoring the exposure of key government personnel and contractors.",
    },
  ];

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
            <Link to="/pricing">
              <Button
                variant="ghost"
                className="text-[10px] uppercase font-bold tracking-widest hover:bg-white/5"
              >
                Pricing
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
        <div className="max-w-3xl mb-16">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6 leading-none">
            Sector-Specific <br />
            <span className="text-primary italic">Defense</span>
          </h1>
          <p className="text-muted-foreground font-body text-lg leading-relaxed">
            Standard perimeter defense is obsolete. E-VARA provides
            sector-specific, zero-knowledge identity monitoring tailored to the
            unique threat models of high-liability industries.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl">
          {solutions.map((sol, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {sol.icon}
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-3">
                {sol.title}
              </h3>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">
                {sol.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 p-12 rounded-[32px] border border-primary/20 bg-primary/5 text-center max-w-5xl">
          <h2 className="text-2xl font-black uppercase mb-4">
            Require a Custom Architecture?
          </h2>
          <p className="text-muted-foreground font-body mb-8 max-w-xl mx-auto">
            Our Omni-Layer tier supports dedicated edge nodes, custom SIEM
            integrations, and on-premise data vaults.
          </p>
          <Link to="/book-demo">
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-[14px] px-8 py-6 uppercase tracking-widest text-xs font-bold security-orange-glow">
              Consult an Architect
            </Button>
          </Link>
        </div>

        {/* SEO Content Cluster / Security Insights */}
        <div className="mt-24 max-w-4xl mx-auto space-y-16 border-t border-white/5 pt-20">
          <div className="space-y-4">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">
              Zero-Trust Identity Security Frameworks
            </h2>
            <p className="text-muted-foreground font-body leading-relaxed">
              In an era where the traditional network perimeter has dissolved,
              organizations must adopt a Zero-Trust security model. E-VARA's
              enterprise solutions empower financial institutions and legal
              practices to continuously verify the digital integrity of their
              high-value targets. By integrating autonomous identity monitoring
              directly into your risk management framework, you eliminate the
              blind spots exploited by advanced persistent threats (APTs).
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">
              Sovereign Data Protection & Compliance
            </h2>
            <p className="text-muted-foreground font-body leading-relaxed">
              For public sector entities and defense contractors, data
              sovereignty and regulatory compliance are non-negotiable. E-VARA
              operates on a strict zero-knowledge architecture, meaning
              client-side cryptographic hashing ensures that PII never traverses
              the cloud in plaintext. This allows organizations to aggressively
              monitor the dark web for executive exposure without violating
              GDPR, CCPA, or localized sovereign data mandates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionsPage;
