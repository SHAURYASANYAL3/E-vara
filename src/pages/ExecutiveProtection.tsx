import {
  Shield,
  Home,
  Plane,
  UserX,
  Database,
  Users,
  VideoOff,
  UserCheck
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";

const ExecutiveProtectionPage = () => {
  useSEO({
    title: "Executive & Founder Protection",
    description:
      "World-class executive digital protection platform. Defend founders, family offices, and executives from digital and physical threats.",
    canonicalUrl: "https://e-vara.vercel.app/executive-protection",
  });

  const capabilities = [
    {
      icon: <UserCheck className="h-6 w-6 text-primary" />,
      title: "Founder Protection",
      description:
        "Comprehensive digital shielding for high-visibility founders, mitigating targeted social engineering and doxxing risks.",
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Family-Office & Spousal Protection",
      description:
        "Extend the security perimeter to protect spouses, children, and family-office staff from secondary-targeting cyber threats.",
    },
    {
      icon: <VideoOff className="h-6 w-6 text-primary" />,
      title: "Deepfake Monitoring",
      description:
        "Continuous AI-driven scanning to detect and alert on unauthorized synthetic media or voice cloning of key executives.",
    },
    {
      icon: <Database className="h-6 w-6 text-primary" />,
      title: "Personal Data Broker Removal",
      description:
        "Automated opt-outs and legal takedowns to scrub executive PII, addresses, and family details from 180+ data brokers.",
    },
    {
      icon: <UserX className="h-6 w-6 text-primary" />,
      title: "Executive Impersonation Takedowns",
      description:
        "Instant detection and DMCA takedowns of fake LinkedIn, X (Twitter), and Meta profiles impersonating leadership.",
    },
    {
      icon: <Home className="h-6 w-6 text-primary" />,
      title: "Home-Network Security for CEOs",
      description:
        "Bridging the gap between the enterprise and the living room with continuous vulnerability assessments of executive home networks.",
    },
    {
      icon: <Plane className="h-6 w-6 text-primary" />,
      title: "Travel-Risk Intelligence",
      description:
        "Real-time geographical threat intelligence and device security postures tailored for founders traveling to high-risk zones.",
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Executive Digital Footprint Monitoring",
      description:
        "24/7 dark web and OSINT surveillance to detect credential leaks, exposed access tokens, and targeted threat chatter.",
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
            Executive <br />
            <span className="text-primary italic">Protection</span>
          </h1>
          <p className="text-muted-foreground font-body text-lg leading-relaxed">
            World-class digital executive protection. We secure the personal attack surface of founders, CEOs, and their families against targeted intelligence operations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
          {capabilities.map((cap, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {cap.icon}
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-3">
                {cap.title}
              </h3>
              <p className="text-muted-foreground font-body text-sm leading-relaxed">
                {cap.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 p-12 rounded-[32px] border border-primary/20 bg-primary/5 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl font-black uppercase mb-4">
            Is Your Leadership Team Exposed?
          </h2>
          <p className="text-muted-foreground font-body mb-8 max-w-xl mx-auto">
            Threat actors bypass corporate firewalls by targeting the personal digital lives of executives. Secure your apex targets today.
          </p>
          <Link to="/book-demo">
            <Button className="bg-primary hover:bg-primary/90 text-white rounded-[14px] px-8 py-6 uppercase tracking-widest text-xs font-bold security-orange-glow">
              Request Executive Audit
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveProtectionPage;
