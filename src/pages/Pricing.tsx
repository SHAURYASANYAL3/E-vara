import { useState, useEffect } from "react";
import { Shield, Target, FileText, Check, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/useSEO";

const PricingPage = () => {
  useSEO({
    title: "Executive Intelligence Services",
    description:
      "High-ticket concierge OSINT and Deepfake monitoring for PR firms, family offices, and executives.",
    canonicalUrl: "https://e-vara.vercel.app/pricing",
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
          <Link to="/auth">
            <Button
              variant="ghost"
              className="text-[10px] uppercase font-bold tracking-widest hover:bg-white/5"
            >
              Client Portal
            </Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-24">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#007AFF]/20 bg-[#007AFF]/5 text-[#007AFF] text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
            <Target className="h-3 w-3" /> Concierge Services
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase mb-6 italic">
            Executive Threat Intelligence
          </h1>
          <p className="text-muted-foreground font-body text-lg">
            We do not sell software. We sell absolute digital awareness. Fully
            managed exposure, OSINT, and synthetic media monitoring for
            high-value targets.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Audit Tier */}
          <div className="relative rounded-[32px] border border-white/5 bg-[#0A0C12] p-10 flex flex-col transition-all hover:translate-y-[-8px]">
            <div className="mb-8">
              <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground mb-4">
                One-Time Assessment
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black tracking-tighter text-white">
                  $999
                </span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground font-body">
                A highly detailed, manual OSINT deep-dive into your executive's
                digital footprint. Identifies all currently exposed
                vulnerabilities and deepfakes.
              </p>
            </div>

            <div className="space-y-4 mb-10 flex-grow">
              {[
                "Comprehensive Exposure Analysis",
                "Deepfake & Synthetic Media Footprint",
                "Public Database Leaks (PII)",
                "Detailed 15-Page PDF Dossier",
                "Manual Analyst Review",
                "Delivered in 48 Hours",
              ].map((feature, j) => (
                <div key={j} className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full flex items-center justify-center border border-white/10 bg-white/5">
                    <Check className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground tracking-tight">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <Link to="/book-demo" className="w-full">
              <Button className="w-full py-7 rounded-[16px] font-black uppercase tracking-widest text-xs transition-all bg-white/5 hover:bg-white/10 text-white border border-white/10">
                Request Audit
              </Button>
            </Link>
          </div>

          {/* Retainer Tier */}
          <div className="relative rounded-[32px] border border-[#007AFF] bg-[#007AFF]/[0.03] shadow-[0_0_50px_rgba(0,122,255,0.1)] p-10 flex flex-col transition-all hover:translate-y-[-8px]">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#007AFF] text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
              Agency Retainer
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-[#007AFF] mb-4">
                Crisis PR Radar
              </h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black tracking-tighter text-white">
                  $2,500
                </span>
                <span className="text-muted-foreground font-bold">/month</span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground font-body">
                Continuous 24/7 monitoring of up to 5 executives. We alert your
                PR team the moment a synthetic media threat or data leak hits
                dark channels.
              </p>
            </div>

            <div className="space-y-4 mb-10 flex-grow">
              {[
                "Monitor up to 5 Clients",
                "24/7 Telegram & Dark Forum Crawling",
                "Automated Synthetic Audio/Video Detection",
                "Instant SMS/Email Early Warnings",
                "Human-Verified Signal (Zero False Positives)",
                "Weekly Analyst Reports",
                "Dashboard Access for PR Team",
              ].map((feature, j) => (
                <div key={j} className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full flex items-center justify-center border border-[#007AFF]/30 bg-[#007AFF]/10">
                    <Check className="h-3 w-3 text-[#007AFF]" />
                  </div>
                  <span className="text-xs font-mono text-white tracking-tight">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <Link to="/book-demo" className="w-full">
              <Button className="w-full py-7 rounded-[16px] font-black uppercase tracking-widest text-xs transition-all bg-[#007AFF] hover:bg-[#007AFF]/90 text-white">
                Book Consultation
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-24 max-w-5xl mx-auto grid md:grid-cols-2 gap-12 p-12 rounded-[40px] border border-[#007AFF]/20 bg-[#007AFF]/[0.02]">
          <div>
            <h4 className="text-2xl font-black uppercase mb-4 text-white">
              The Intelligence Guarantee
            </h4>
            <p className="text-white/60 font-body leading-relaxed mb-6">
              Our pledge to Crisis PR Directors and Talent Managers:{" "}
              <strong>
                If we run an executive audit and find absolutely zero exposed
                vulnerabilities or synthetic footprints, you pay nothing.
              </strong>{" "}
              We are in the business of absolute truth, not software
              subscriptions.
            </p>
            <div className="flex gap-4">
              <div className="p-3 bg-[#007AFF]/10 rounded-xl border border-[#007AFF]/20">
                <Shield className="h-6 w-6 text-[#007AFF]" />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-white">
                  Strictly Confidential
                </p>
                <p className="text-xs text-white/50 mt-1 font-body">
                  All reports are securely deleted post-delivery unless retained
                  under the Crisis Radar contract.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="h-4 w-4 text-[#007AFF]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                  Actionable Reporting
                </span>
              </div>
              <p className="text-xs text-white/50 font-body">
                We provide raw intelligence, heavily filtered by our analysts,
                giving your legal team exactly what they need for immediate
                takedowns.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-3 mb-2">
                <Globe className="h-4 w-4 text-[#007AFF]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                  Dark Network Reach
                </span>
              </div>
              <p className="text-xs text-white/50 font-body">
                We crawl private Telegram groups, 4chan, and decentralized
                networks where deepfakes are born.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
