import { Shield, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";

const PrivacyPolicy = () => {
  useSEO({
    title: "Privacy Policy",
    description:
      "E-VARA's Privacy Policy: how we collect, use, and protect your data under our Sovereign Data architecture.",
    canonicalUrl: "https://e-vara.vercel.app/privacy",
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
          <Link to="/legal">
            <Button
              variant="ghost"
              className="text-[10px] uppercase font-bold tracking-widest hover:bg-white/5"
            >
              <ArrowLeft className="h-3 w-3 mr-2" /> Legal Hub
            </Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto space-y-12">
          <header className="border-l-4 border-primary pl-8 py-4 bg-primary/5 rounded-r-2xl">
            <h1 className="text-4xl font-black tracking-tighter uppercase mb-4">
              Privacy Policy
            </h1>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              Last Updated: June 2026
            </p>
          </header>

          <section className="space-y-6 text-sm leading-relaxed font-body text-muted-foreground">
            <div className="space-y-4">
              <h2 className="text-lg font-black text-foreground uppercase tracking-tight">
                1. Data Collection
              </h2>
              <p>
                E-VARA operates on a{" "}
                <strong className="text-foreground">Zero-Knowledge</strong> data
                model. We collect:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-foreground">Account Data:</strong>{" "}
                  Email address and authentication credentials (hashed).
                </li>
                <li>
                  <strong className="text-foreground">Identity Markers:</strong>{" "}
                  SHA-256 hashes of identity markers you submit for monitoring.
                  We never store plaintext PII.
                </li>
                <li>
                  <strong className="text-foreground">Usage Data:</strong>{" "}
                  Anonymous page views, feature usage, and performance metrics
                  via PostHog (with masked inputs).
                </li>
                <li>
                  <strong className="text-foreground">Technical Data:</strong>{" "}
                  Browser type, OS, IP address (for security audit logs only).
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-black text-foreground uppercase tracking-tight">
                2. Data Usage
              </h2>
              <p>Your data is used exclusively to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Provide identity defense and threat monitoring services.
                </li>
                <li>Generate security intelligence reports.</li>
                <li>Improve platform reliability and performance.</li>
                <li>Comply with legal obligations.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-black text-foreground uppercase tracking-tight">
                3. Data Protection
              </h2>
              <p>Data integrity is maintained by:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Client-side SHA-256 hashing before transmission.</li>
                <li>TLS 1.3 encryption in transit.</li>
                <li>
                  PostgreSQL Row Level Security (RLS) ensuring tenant isolation.
                </li>
                <li>Supabase infrastructure with SOC 2 Type II compliance.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-black text-foreground uppercase tracking-tight">
                4. Your Rights
              </h2>
              <p>
                Under GDPR and applicable regulations, you have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-foreground">Access:</strong> Request a
                  copy of your data.
                </li>
                <li>
                  <strong className="text-foreground">Erasure:</strong> Request
                  complete deletion of your account and data.
                </li>
                <li>
                  <strong className="text-foreground">Portability:</strong>{" "}
                  Export your data in machine-readable format.
                </li>
                <li>
                  <strong className="text-foreground">Rectification:</strong>{" "}
                  Correct inaccurate data.
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-black text-foreground uppercase tracking-tight">
                5. Data Retention
              </h2>
              <p>
                We retain your data only for as long as your account is active.
                Upon account deletion, all associated data is permanently
                removed within 30 days.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-black text-foreground uppercase tracking-tight">
                6. Contact
              </h2>
              <p>For privacy inquiries, data deletion requests, or concerns:</p>
              <p className="text-foreground font-bold">privacy@e-vara.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
