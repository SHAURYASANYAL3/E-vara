import { Shield, ArrowLeft, Cookie } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";

const CookieNotice = () => {
  useSEO({
    title: "Cookie Notice",
    description:
      "E-VARA's Cookie Notice: how we use cookies and similar technologies.",
    canonicalUrl: "https://e-vara.vercel.app/cookies",
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
              Cookie Notice
            </h1>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              Last Updated: June 2026
            </p>
          </header>

          <section className="space-y-6 text-sm leading-relaxed font-body text-muted-foreground">
            <div className="space-y-4">
              <h2 className="text-lg font-black text-foreground uppercase tracking-tight">
                Essential Cookies
              </h2>
              <p>
                We use only essential cookies required for platform operation:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-foreground">Authentication:</strong>{" "}
                  Supabase session tokens for secure login persistence.
                </li>
                <li>
                  <strong className="text-foreground">Security:</strong> CSRF
                  tokens and security state management.
                </li>
                <li>
                  <strong className="text-foreground">Preferences:</strong>{" "}
                  Theme and UI state (stored in localStorage).
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-black text-foreground uppercase tracking-tight">
                Analytics Cookies
              </h2>
              <p>
                When enabled, PostHog analytics collects anonymous usage data to
                improve the platform. Session recording masks all input fields
                by default.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-black text-foreground uppercase tracking-tight">
                Managing Cookies
              </h2>
              <p>
                You can control cookies through your browser settings. Disabling
                essential cookies may prevent login functionality.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookieNotice;
