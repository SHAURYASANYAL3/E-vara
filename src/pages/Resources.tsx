import { Shield, FileText, PlayCircle, BookOpen, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";

const ResourcesPage = () => {
  useSEO({
    title: "Resources & Insights",
    description: "Cybersecurity research, whitepapers, and guides from E-VARA.",
    canonicalUrl: "https://e-vara.vercel.app/resources",
  });

  const resources = [
    {
      category: "Whitepaper",
      title: "The State of Executive Identity Threats 2026",
      desc: "A comprehensive analysis of how threat actors are bypassing MFA through targeted OSINT harvesting.",
      icon: <FileText className="h-5 w-5 text-primary" />,
    },
    {
      category: "Guide",
      title: "Implementing Zero-Knowledge Architecture",
      desc: "Technical implementation details for securing PII before it reaches cloud databases.",
      icon: <BookOpen className="h-5 w-5 text-primary" />,
    },
    {
      category: "Webinar",
      title: "Autonomous Defense vs. Reactive Security",
      desc: "Watch our security architects break down the ROI of proactive identity monitoring.",
      icon: <PlayCircle className="h-5 w-5 text-primary" />,
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
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h1 className="text-5xl font-black tracking-tighter uppercase mb-6 italic">
            Intelligence Hub
          </h1>
          <p className="text-muted-foreground font-body text-lg">
            Research, technical specifications, and strategic guidance for
            modern security operations centers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24">
          {resources.map((item, i) => (
            <div
              key={i}
              className="flex flex-col p-6 rounded-2xl border border-white/5 bg-[#0A0C12] hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded">
                  {item.category}
                </span>
                {item.icon}
              </div>
              <h3 className="text-lg font-bold leading-snug mb-3">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground font-body flex-grow mb-6">
                {item.desc}
              </p>
              <Button
                variant="outline"
                className="w-full border-white/10 hover:bg-white/5 uppercase tracking-widest text-[10px] font-bold"
              >
                <Download className="mr-2 h-3 w-3" /> Access Asset
              </Button>
            </div>
          ))}
        </div>

        {/* SEO Content Cluster / Security Insights */}
        <div className="max-w-4xl mx-auto space-y-16 border-t border-white/5 pt-20">
          <div className="space-y-4">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">
              Digital Footprint & OSINT Intelligence
            </h2>
            <p className="text-muted-foreground font-body leading-relaxed">
              Open-Source Intelligence (OSINT) is the foundation of modern
              cybersecurity defense. By mapping your digital footprint across
              public databases, dark web forums, and social graph APIs, E-VARA
              neutralizes threats before they materialize. Executive security is
              no longer confined to physical space; it requires autonomous
              monitoring of email exposures, DNS metadata, and identity
              fragments.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">
              Executive Identity Protection
            </h2>
            <p className="text-muted-foreground font-body leading-relaxed">
              High-net-worth individuals and corporate executives face targeted
              social engineering and deepfake campaigns. E-VARA’s identity
              protection suite utilizes cryptographic hashing to verify breach
              data without ever exposing personally identifiable information
              (PII) to the cloud. This Zero-Knowledge Architecture ensures
              compliance while delivering enterprise-grade threat surface
              mapping.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">
              Breach Awareness & Proactive Defense
            </h2>
            <p className="text-muted-foreground font-body leading-relaxed">
              Reactive security is obsolete. Modern cyber defense requires an
              active intelligence engine capable of scanning millions of records
              per second. By cross-referencing compromised credential databases
              and historical leaks, organizations can enforce credential
              rotation protocols before threat actors can exploit the data.
              E-VARA transforms reactive IT logs into proactive intelligence
              dossiers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;
