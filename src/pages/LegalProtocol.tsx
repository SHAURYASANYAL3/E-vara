import { Shield, Lock, FileText, Scale, Eye, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";

const LegalProtocol = () => {
  useSEO({
    title: "Legal Protocol & Compliance",
    description:
      "Review E-VARA's strict Sovereign Data architecture, operational ethics, and compliance frameworks.",
    canonicalUrl: "https://e-vara.vercel.app/legal",
  });

  return (
    <div className="min-h-screen bg-[#050608] text-foreground font-mono selection:bg-primary/30">
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
          <Link to="/">
            <Button
              variant="ghost"
              className="text-[10px] uppercase font-bold tracking-widest hover:bg-white/5"
            >
              Return to Grid
            </Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto space-y-20">
          {/* Header */}
          <header className="border-l-4 border-primary pl-8 py-4 bg-primary/5 rounded-r-2xl">
            <h1 className="text-5xl font-black tracking-tighter uppercase mb-4">
              Legal Protocol & Compliance
            </h1>
            <p className="text-muted-foreground font-body text-lg leading-relaxed">
              E-VARA operates under a strict Sovereign Data architecture. This
              document outlines our operational ethics, cryptographic mandates,
              and the legal framework governing autonomous identity defense.
            </p>
          </header>

          {/* Section: Data Privacy */}
          <section id="data-privacy" className="space-y-8">
            <div className="flex items-center gap-4 border-b border-white/10 pb-4">
              <Eye className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-black uppercase tracking-tight">
                Data Privacy Directive
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8 text-sm leading-relaxed font-body text-muted-foreground">
              <div className="space-y-4">
                <h3 className="font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
                  <Lock className="h-4 w-4 text-secondary" /> Zero-Knowledge
                  Mandate
                </h3>
                <p>
                  E-VARA utilizes client-side SHA-256 hashing. Your actual
                  identifiers never touch our ingestion pipeline in plaintext.
                  We only store and analyze cryptographic signatures, ensuring
                  absolute PII immunity.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
                  <Shield className="h-4 w-4 text-secondary" /> RLS Isolation
                </h3>
                <p>
                  Every data byte is shielded by Row Level Security (RLS).
                  Cross-tenant access is physically impossible at the database
                  level. Your threat findings are mathematically bound to your
                  authenticated UUID.
                </p>
              </div>
            </div>
          </section>

          {/* Section: Terms of Use */}
          <section id="terms" className="space-y-8">
            <div className="flex items-center gap-4 border-b border-white/10 pb-4">
              <FileText className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-black uppercase tracking-tight">
                Terms of Operational Use
              </h2>
            </div>
            <div className="space-y-6 text-sm leading-relaxed font-body text-muted-foreground bg-white/[0.02] p-8 rounded-2xl border border-white/5">
              <p>
                By engaging the E-VARA Kernel, you acknowledge that this is an
                **Autonomous Intelligence System**. Analytical results are
                derived from OSINT (Open Source Intelligence) and proprietary
                entropy models.
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  <span className="text-foreground font-bold uppercase">
                    Authorization:
                  </span>{" "}
                  You warrant that all monitored identifiers are owned by you or
                  your legal designated entity.
                </li>
                <li>
                  <span className="text-foreground font-bold uppercase">
                    No Guarantee:
                  </span>{" "}
                  Intelligence is non-exhaustive. Absence of findings does not
                  guarantee identity immunity.
                </li>
                <li>
                  <span className="text-foreground font-bold uppercase">
                    Liability:
                  </span>{" "}
                  E-VARA is a defense tool. Final security decisions rest with
                  the executive node.
                </li>
              </ul>
            </div>
          </section>

          {/* Section: Refund Policy */}
          <section id="refunds" className="space-y-8">
            <div className="flex items-center gap-4 border-b border-white/10 pb-4">
              <Scale className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-black uppercase tracking-tight">
                Subscription & Refund Policy
              </h2>
            </div>
            <div className="space-y-6 text-sm leading-relaxed font-body text-muted-foreground bg-white/[0.02] p-8 rounded-2xl border border-white/5">
              <p>
                E-VARA operates on a strictly prepaid subscription model
                (Monthly or Annual). Due to the high computational costs of
                real-time OSINT scanning and encryption overhead,{" "}
                <strong>all payments are final and non-refundable.</strong>
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  <span className="text-foreground font-bold uppercase">
                    No Partial Refunds:
                  </span>{" "}
                  There are no refunds or credits for partial months of service,
                  downgrades, or unused time on an active account.
                </li>
                <li>
                  <span className="text-foreground font-bold uppercase">
                    Cancellation:
                  </span>{" "}
                  You may cancel your subscription at any time through the
                  Billing Portal. Your identity monitoring will remain active
                  until the end of your current billing cycle.
                </li>
              </ul>
            </div>
          </section>

          {/* Section: Security Ethics */}
          <section id="ethics" className="space-y-8">
            <div className="flex items-center gap-4 border-b border-white/10 pb-4">
              <Scale className="h-8 w-8 text-primary" />
              <h2 className="text-2xl font-black uppercase tracking-tight">
                Security Ethics & Compliance
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "GDPR Compliance",
                  desc: "Native right-to-erasure and data portability via the Encrypted Vault interface.",
                },
                {
                  title: "Ethical OSINT",
                  desc: "No unauthorized intrusions. We only aggregate data from verified leak databases and public technical headers.",
                },
                {
                  title: "Audit Integrity",
                  desc: "Every system operation generates a deterministic audit log for legal forensic verification.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-6 rounded-xl border border-white/5 bg-[#11141B]"
                >
                  <h4 className="text-xs font-bold uppercase text-primary mb-3 tracking-widest">
                    {item.title}
                  </h4>
                  <p className="text-[12px] text-muted-foreground leading-relaxed font-body">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Footer Note */}
          <div className="p-8 rounded-2xl border border-alert/20 bg-alert/5 flex gap-6 items-center">
            <AlertCircle className="h-10 w-10 text-alert shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase text-alert mb-1 tracking-[0.2em]">
                Operational Warning
              </p>
              <p className="text-sm text-muted-foreground font-body">
                Simulation Mode is active when environment variables are
                uninitialized. Findings in simulation mode are synthetic and
                intended for architectural validation only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalProtocol;
