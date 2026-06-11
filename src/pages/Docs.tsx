import { Shield, Book, Terminal, Code2, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";

const DocsPage = () => {
  useSEO({
    title: "Documentation",
    description:
      "Official developer documentation and API reference for the E-VARA platform.",
    canonicalUrl: "https://e-vara.vercel.app/docs",
  });

  const sections = [
    {
      icon: <Terminal className="h-5 w-5 text-primary" />,
      title: "Quick Start",
      desc: "Initialize your first monitoring node and understand the dashboard architecture.",
    },
    {
      icon: <Code2 className="h-5 w-5 text-primary" />,
      title: "API Reference",
      desc: "Integrate E-VARA threat data directly into your internal SIEM or SOC dashboards.",
    },
    {
      icon: <Layers className="h-5 w-5 text-primary" />,
      title: "Architecture",
      desc: "Deep dive into our edge-based scanning mechanisms and Supabase integration.",
    },
    {
      icon: <Book className="h-5 w-5 text-primary" />,
      title: "Security & Compliance",
      desc: "Review our SOC2 frameworks, data residency policies, and cryptographic standards.",
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

      <div className="container mx-auto px-6 py-24 flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Getting Started
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="text-primary cursor-pointer hover:underline">
                Introduction
              </li>
              <li className="cursor-pointer hover:text-white transition-colors">
                Authentication
              </li>
              <li className="cursor-pointer hover:text-white transition-colors">
                Adding Identities
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Core Concepts
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="cursor-pointer hover:text-white transition-colors">
                Threat Severity
              </li>
              <li className="cursor-pointer hover:text-white transition-colors">
                Report Generation
              </li>
              <li className="cursor-pointer hover:text-white transition-colors">
                RBAC & Permissions
              </li>
            </ul>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-6">
            Documentation
          </h1>
          <p className="text-muted-foreground font-body text-lg mb-12">
            Everything you need to deploy, configure, and scale E-VARA within
            your organizational infrastructure.
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            {sections.map((sec, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-white/5 bg-[#0A0C12] hover:border-primary/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform">
                    {sec.icon}
                  </div>
                  <h3 className="font-bold text-sm uppercase tracking-widest">
                    {sec.title}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground font-body leading-relaxed">
                  {sec.desc}
                </p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocsPage;
