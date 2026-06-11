import { useEffect } from "react";
import Hero from "@/components/v2/Hero";
import Workflow from "@/components/v2/Workflow";
import DashboardMockup from "@/components/v2/DashboardMockup";
import InvestorSection from "@/components/v2/InvestorSection";
import { Shield, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PremiumNavbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-[100] bg-black/50 backdrop-blur-2xl border-b border-white/5">
    <div className="container mx-auto px-6 h-20 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Shield className="w-8 h-8 text-electric-blue" />
        <span className="text-xl font-bold tracking-tighter text-white uppercase">
          E-vara
        </span>
      </div>
      <div className="hidden md:flex items-center gap-8">
        {["Technology", "Solutions", "Investors", "Security"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors"
          >
            {item}
          </a>
        ))}
      </div>
      <button className="px-6 py-2.5 rounded-full bg-electric-blue text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
        Launch Console
      </button>
    </div>
  </nav>
);

const LandingPageV2 = () => {
  useEffect(() => {
    // Premium GSAP animations for sections
    gsap.utils.toArray<HTMLElement>("section").forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );
    });
  }, []);

  return (
    <div className="bg-[#050505] text-white selection:bg-electric-blue/30 selection:text-white">
      <PremiumNavbar />

      <main>
        <Hero />

        {/* The Problem Section */}
        <section className="py-32 container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl lg:text-7xl font-bold tracking-tighter mb-8">
                The Digital <br /> Trust Crisis
              </h2>
              <p className="text-xl text-white/60 font-light leading-relaxed mb-12">
                Deepfakes and AI manipulation are growing at 900% annually.
                Organizations are losing billions to sophisticated digital
                impersonation.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-4xl font-bold text-electric-blue mb-2">
                    900%
                  </p>
                  <p className="text-[10px] font-mono text-white/60 uppercase">
                    Annual Deepfake Growth
                  </p>
                </div>
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-4xl font-bold text-electric-blue mb-2">
                    $12.4B
                  </p>
                  <p className="text-[10px] font-mono text-white/60 uppercase">
                    Reputation Loss Index
                  </p>
                </div>
              </div>
            </div>
            <div className="relative p-1 rounded-3xl border border-white/5 bg-white/[0.02]">
              <div className="p-12 space-y-8">
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em]">
                  Case_Study_Analysis
                </p>
                <div className="h-2 w-2/3 bg-electric-blue/20 rounded-full" />
                <div className="h-2 w-1/2 bg-white/5 rounded-full" />
                <div className="h-2 w-3/4 bg-white/5 rounded-full" />
              </div>
            </div>
          </div>
        </section>

        <Workflow />

        {/* Dashboard Showcase */}
        <section className="py-32 container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h2 className="text-5xl lg:text-7xl font-bold tracking-tighter mb-8 italic">
              The Command Center
            </h2>
            <p className="text-xl text-white/60 font-light">
              Institutional-grade monitoring at your fingertips.
            </p>
          </div>
          <DashboardMockup />
        </section>

        <InvestorSection />

        {/* Core Technology */}
        <section className="py-32 bg-black">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8">
              {[
                "Computer Vision",
                "Neural Classification",
                "Web Intelligence",
                "Threat Graphs",
              ].map((tech, i) => (
                <div
                  key={i}
                  className="p-10 rounded-3xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all"
                >
                  <p className="text-xl font-bold text-white mb-4 tracking-tight">
                    {tech}
                  </p>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Enterprise-grade {tech.toLowerCase()} modules powering the
                    E-vara engine.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-white/5 bg-[#050505]">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-electric-blue" />
            <span className="text-xl font-bold tracking-tighter text-white uppercase">
              E-vara
            </span>
          </div>
          <div className="flex gap-12">
            {["Privacy", "Terms", "Security", "Contact"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-[10px] font-mono text-white/60 uppercase tracking-widest hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
          <p className="text-[10px] font-mono text-white/40 uppercase">
            © 2026 E-vara Security Systems. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPageV2;
