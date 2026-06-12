import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import {
  Search,
  Github,
  Code,
  PenTool,
  BookOpen,
  Shield,
  Users,
  Lightbulb,
  ExternalLink,
  ShieldCheck,
  FileText,
  CheckCircle2,
  Target,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { contributors } from "@/data/contributors";

const SprintBanner = () => (
  <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-black via-cyan-950/10 to-black p-8 my-16 mx-6 md:mx-auto max-w-6xl">
    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />
    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <p className="text-xs font-mono uppercase tracking-widest text-cyan-400">
            Current Sprint
          </p>
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">
          NSOC'26
        </h2>
        <p className="text-muted-foreground text-sm max-w-xl">
          Contributors who meaningfully help during the active build phase may
          be acknowledged here. We are currently focusing on core
          infrastructure, identity models, and UI architecture.
        </p>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center min-w-[120px]">
          <Target className="h-5 w-5 text-cyan-400 mb-2" />
          <p className="text-[10px] font-mono uppercase text-muted-foreground">
            Sprint Goal
          </p>
          <p className="text-sm font-bold text-white mt-1">V1 Release</p>
        </div>
        <div className="glass-panel p-4 rounded-xl flex flex-col items-center justify-center min-w-[120px]">
          <Timer className="h-5 w-5 text-emerald-400 mb-2" />
          <p className="text-[10px] font-mono uppercase text-muted-foreground">
            Status
          </p>
          <p className="text-sm font-bold text-white mt-1">In Progress</p>
        </div>
      </div>
    </div>
  </div>
);

const Hero = () => (
  <section className="relative container mx-auto px-6 pt-12 pb-16 text-center">
    <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(0,229,255,0.05),transparent_50%)]" />
    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">
      Build E-VARA <br />
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
        Together
      </span>
    </h1>
    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
      Contributors shape the future of identity intelligence through meaningful
      collaboration. No fake metrics, just impact.
    </p>
    <div className="flex flex-wrap justify-center gap-4">
      <Button className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-full px-8">
        <Github className="mr-2 h-4 w-4" /> Explore Repo
      </Button>
      <Button
        variant="outline"
        className="rounded-full px-8 border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-400"
      >
        Start Contributing
      </Button>
      <Button
        variant="ghost"
        className="rounded-full px-8 text-muted-foreground hover:text-white"
        onClick={() =>
          document
            .getElementById("wall")
            ?.scrollIntoView({ behavior: "smooth" })
        }
      >
        View Contributors
      </Button>
    </div>
  </section>
);

const ContributionTypes = () => {
  const types = [
    {
      icon: Code,
      title: "Code",
      desc: "Core logic, components, APIs, performance tuning.",
      impact: "Directly improves platform capability.",
    },
    {
      icon: PenTool,
      title: "Design",
      desc: "UI/UX, accessibility, design systems, assets.",
      impact: "Enhances the user experience.",
    },
    {
      icon: Shield,
      title: "Security",
      desc: "Audits, cryptography, threat modeling.",
      impact: "Maintains zero-trust integrity.",
    },
    {
      icon: BookOpen,
      title: "Documentation",
      desc: "Architecture, guides, developer onboarding.",
      impact: "Accelerates open-source adoption.",
    },
    {
      icon: Lightbulb,
      title: "Product",
      desc: "Feature scopes, use cases, positioning.",
      impact: "Guides the strategic roadmap.",
    },
    {
      icon: Users,
      title: "Community",
      desc: "Triage, answering questions, mentoring.",
      impact: "Fosters a healthy ecosystem.",
    },
  ];
  return (
    <section className="container mx-auto px-6 py-24 border-t border-border/50">
      <div className="mb-12">
        <h2 className="text-3xl font-black uppercase tracking-tight">
          What Contribution Means
        </h2>
        <p className="text-muted-foreground mt-2">
          More than just code. We value all forms of intellectual and creative
          input.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {types.map((t, i) => (
          <div
            key={i}
            className="glass-panel p-6 rounded-2xl hover:border-cyan-500/30 transition-colors"
          >
            <t.icon className="h-6 w-6 text-cyan-400 mb-4" />
            <h3 className="text-lg font-bold mb-2">{t.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t.desc}</p>
            <div className="text-[10px] font-mono uppercase text-cyan-500/70 bg-cyan-500/10 inline-block px-2 py-1 rounded">
              Impact: {t.impact}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const RecognitionSystem = () => (
  <section className="container mx-auto px-6 py-24 border-t border-border/50">
    <div className="grid lg:grid-cols-2 gap-16 items-center">
      <div>
        <h2 className="text-3xl font-black uppercase tracking-tight mb-6">
          How Recognition Works
        </h2>
        <p className="text-muted-foreground mb-8">
          Recognition is based entirely on meaningful contribution. We don't
          track message counts, server activity, or spam.
        </p>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-emerald-400 h-5 w-5" />
            <span>1 Merged Pull Request</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-emerald-400 h-5 w-5" />
            <span>Accepted Design Component</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-emerald-400 h-5 w-5" />
            <span>Accepted Documentation</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-emerald-400 h-5 w-5" />
            <span>Accepted Research</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center border-white/5 bg-black/20">
          <ShieldCheck className="h-8 w-8 text-cyan-400 mb-3" />
          <h4 className="font-bold text-sm">Official Badge</h4>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center border-white/5 bg-black/20">
          <FileText className="h-8 w-8 text-cyan-400 mb-3" />
          <h4 className="font-bold text-sm">Certificate</h4>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center border-white/5 bg-black/20">
          <Users className="h-8 w-8 text-cyan-400 mb-3" />
          <h4 className="font-bold text-sm">Public Wall</h4>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center border-white/5 bg-black/20">
          <ExternalLink className="h-8 w-8 text-cyan-400 mb-3" />
          <h4 className="font-bold text-sm">Portfolio Value</h4>
        </div>
      </div>
    </div>
  </section>
);

const ContributorWall = () => {
  const [search, setSearch] = useState("");
  const filtered = contributors.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <section
      className="container mx-auto px-6 py-24 border-t border-border/50"
      id="wall"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight">
            Contributor Wall
          </h2>
          <p className="text-muted-foreground mt-2">
            The minds building the identity perimeter.
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search contributors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/40 border border-border/50 rounded-full pl-10 pr-4 py-2 text-sm outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-panel border-dashed border-2 border-border/50 rounded-3xl p-16 text-center max-w-3xl mx-auto">
          <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Github className="h-8 w-8 text-cyan-400" />
          </div>
          <h3 className="text-2xl font-bold mb-2">
            We're building the first chapter.
          </h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            The codebase is taking shape. No fake statistics, no inflated
            numbers. Be the first to leave your mark.
          </p>
          <Button className="bg-cyan-500 text-black hover:bg-cyan-600 rounded-full font-bold">
            Become First Contributor
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="glass-panel p-6 rounded-2xl relative overflow-hidden group"
            >
              {c.is_founding && (
                <div className="absolute top-0 right-0 bg-cyan-500 text-black text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg">
                  Founding
                </div>
              )}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={c.avatar}
                  alt={c.name}
                  className="w-12 h-12 rounded-full ring-2 ring-border/50 bg-black/50"
                />
                <div>
                  <h4 className="font-bold">{c.name}</h4>
                  <p className="text-xs text-muted-foreground font-mono">
                    {c.level}
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-300 mb-4">{c.bio}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {c.badges.map((b) => (
                  <span
                    key={b}
                    className="text-[10px] font-mono uppercase bg-white/5 border border-white/10 px-2 py-0.5 rounded text-muted-foreground"
                  >
                    {b}
                  </span>
                ))}
              </div>

              {c.resolved_issues && c.resolved_issues.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Impact Delivered
                  </h5>
                  <div className="space-y-2">
                    {c.resolved_issues.map((issue) => (
                      <div key={issue.issueNumber} className="bg-black/30 border border-white/5 rounded-lg p-3 text-sm transition-colors hover:border-cyan-500/30">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-white text-xs leading-tight">
                            <span className="text-cyan-500 mr-1">#{issue.issueNumber}</span>
                            {issue.title}
                          </span>
                          {issue.prLink && (
                            <a href={issue.prLink} target="_blank" rel="noreferrer" className="text-cyan-500 hover:text-cyan-400 ml-2 flex-shrink-0 mt-0.5">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                        <p className="text-muted-foreground text-[11px] leading-relaxed mt-1">
                          {issue.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-border/50 flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  Joined {c.joinedAt}
                </span>
                <a
                  href={c.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-white transition-colors"
                >
                  <Github className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

const HowToStart = () => {
  const steps = [
    { title: "Explore Repo", desc: "Read the architecture docs." },
    { title: "Choose Task", desc: "Find a 'good first issue'." },
    { title: "Build", desc: "Write clean, tested code." },
    { title: "Submit", desc: "Open a detailed PR." },
    { title: "Get Recognized", desc: "Join the wall." },
  ];
  return (
    <section className="container mx-auto px-6 py-24 border-t border-border/50">
      <h2 className="text-3xl font-black uppercase tracking-tight text-center mb-16">
        How to Start
      </h2>
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 relative">
        <div className="hidden md:block absolute top-5 left-[10%] right-[10%] h-px bg-border/50 -z-10" />
        {steps.map((s, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-center bg-background px-4 z-10 w-full md:w-auto"
          >
            <div className="w-10 h-10 rounded-full bg-black border-2 border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold font-mono mb-4 shadow-[0_0_15px_rgba(0,229,255,0.1)]">
              {i + 1}
            </div>
            <h4 className="font-bold text-sm mb-1">{s.title}</h4>
            <p className="text-xs text-muted-foreground max-w-[140px]">
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

const Transparency = () => (
  <section className="container mx-auto px-6 py-24 border-t border-border/50">
    <div className="glass-panel rounded-3xl p-8 md:p-12">
      <h2 className="text-2xl font-black uppercase tracking-tight mb-8">
        Transparency & Rules
      </h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <Shield className="h-4 w-4 text-cyan-400" /> Expectation Alignment
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            E-VARA is an independent product initiative. This contribution
            program is <strong>not</strong> an employment offer, internship, or
            guaranteed pathway to hiring. It is a strictly merit-based,
            open-source recognition system designed to credit developers,
            researchers, and designers who build alongside us.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-2 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-cyan-400" /> Code of Conduct
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We operate on high-signal communication. PRs are evaluated purely on
            technical architecture, security resilience, and design execution.
            Spamming, low-effort documentation tweaks purely for commits, and
            disrespectful behavior will result in permanent exclusion.
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default function Contribution() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-cyan-500/30">
      <Navbar />
      <main className="pt-32 pb-12">
        <Hero />
        <SprintBanner />
        <ContributionTypes />
        <RecognitionSystem />
        <ContributorWall />
        <HowToStart />
        <Transparency />
      </main>
      <Footer />
    </div>
  );
}
