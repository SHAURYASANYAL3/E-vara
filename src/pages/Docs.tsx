import { useState, useEffect } from "react";
import { Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";

const docSections = [
  {
    id: "introduction",
    title: "Introduction",
    content:
      "Welcome to E-VARA Documentation. This guide helps you understand our core systems and how to leverage them to secure your digital footprint proactively. We believe in Zero-Knowledge architectures and absolute data privacy.",
  },
  {
    id: "authentication",
    title: "Authentication",
    content:
      "E-VARA utilizes Supabase Auth to provide secure, encrypted session management. We strongly recommend enabling Multi-Factor Authentication (MFA) to prevent unauthorized access to your identity dashboard.",
  },
  {
    id: "adding-identities",
    title: "Adding Identities",
    content:
      "To monitor your threat surface, you must first verify ownership of your digital assets. Navigate to your dashboard and input your emails, handles, and phone numbers. Once verified, our engine will map them across the open and dark web.",
  },
  {
    id: "threat-severity",
    title: "Threat Severity",
    content:
      "Our Threat Engine categorizes risks from Low to Critical. Critical threats mean your PII is actively circulating in verified breaches or dump files, requiring immediate remediation and password rotations.",
  },
  {
    id: "report-generation",
    title: "Report Generation",
    content:
      "Generate automated PDF or JSON reports of your digital footprint. These reports are strictly confidential, encrypted at rest, and only accessible by authorized account owners.",
  },
  {
    id: "rbac-permissions",
    title: "RBAC & Permissions",
    content:
      "If you are managing a family or organization account, you can use Role-Based Access Control to limit what connected users can view and modify. Admins can enforce strict reading boundaries on threat reports.",
  },
];

const DocsPage = () => {
  useSEO({
    title: "Documentation | E-VARA",
    description: "Official documentation and guides for the E-VARA platform.",
    canonicalUrl: "https://e-vara.vercel.app/docs",
  });

  const [activeSection, setActiveSection] = useState("introduction");

  useEffect(() => {
    const sectionIds = docSections.map((s) => s.id);

    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 100;

      if (nearBottom) {
        setActiveSection(sectionIds[sectionIds.length - 1]);
        return;
      }

      let currentSection = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 200) {
          currentSection = id;
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Offset for fixed header
      const y = element.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

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

      <div className="container mx-auto px-6 py-16 flex flex-col md:flex-row gap-12 items-start relative">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0 sticky top-28 hidden md:block">
          <div className="mb-8">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Getting Started
            </h4>
            <ul className="space-y-1">
              {["introduction", "authentication", "adding-identities"].map(
                (id) => (
                  <li key={id}>
                    <button
                      onClick={() => scrollToSection(id)}
                      className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${activeSection === id ? "bg-primary/10 text-primary font-bold border-l-2 border-primary" : "text-white/60 hover:bg-white/5 hover:text-white border-l-2 border-transparent"}`}
                    >
                      {docSections.find((s) => s.id === id)?.title}
                    </button>
                  </li>
                ),
              )}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Core Concepts
            </h4>
            <ul className="space-y-1">
              {["threat-severity", "report-generation", "rbac-permissions"].map(
                (id) => (
                  <li key={id}>
                    <button
                      onClick={() => scrollToSection(id)}
                      className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${activeSection === id ? "bg-primary/10 text-primary font-bold border-l-2 border-primary" : "text-white/60 hover:bg-white/5 hover:text-white border-l-2 border-transparent"}`}
                    >
                      {docSections.find((s) => s.id === id)?.title}
                    </button>
                  </li>
                ),
              )}
            </ul>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 max-w-3xl pb-32">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-6">
            Documentation
          </h1>
          <p className="text-muted-foreground font-body text-lg mb-16 pb-8 border-b border-white/10">
            Learn how to deploy, configure, and scale E-VARA to secure your
            digital footprint and operations.
          </p>

          <div className="space-y-24">
            {docSections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-32"
              >
                <h2 className="text-2xl font-bold uppercase tracking-tight mb-6">
                  {section.title}
                </h2>
                <div className="prose prose-invert prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:font-body max-w-none">
                  <p>{section.content}</p>
                  <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 text-sm">
                    <strong className="text-primary">Important Note:</strong>{" "}
                    This module is configured according to the latest Zero-Trust
                    standards. Always ensure you are on the latest verified
                    release.
                  </div>
                </div>
              </section>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocsPage;
