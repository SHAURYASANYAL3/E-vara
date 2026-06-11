import { useEffect } from "react";
import { Link } from "react-router-dom";
import Hero from "@/components/v2/Hero";
import Workflow from "@/components/v2/Workflow";
import DashboardMockup from "@/components/v2/DashboardMockup";
import InvestorSection from "@/components/v2/InvestorSection";
import { Shield } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSEO } from "@/hooks/useSEO";

gsap.registerPlugin(ScrollTrigger);

const PremiumNavbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-[100] bg-black/50 backdrop-blur-2xl border-b border-white/5">
    <div className="container mx-auto px-6 h-20 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-3">
        <Shield className="w-8 h-8 text-[#007AFF]" />
        <span className="text-xl font-bold tracking-tighter text-white uppercase italic">
          E-vara
        </span>
      </Link>
      <div className="hidden md:flex items-center gap-8">
        <Link
          to="/solutions"
          className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/60 hover:text-[#007AFF] transition-colors"
        >
          Solutions
        </Link>
        <Link
          to="/pricing"
          className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/60 hover:text-[#007AFF] transition-colors"
        >
          Pricing
        </Link>
        <Link
          to="/docs"
          className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/60 hover:text-[#007AFF] transition-colors"
        >
          Documentation
        </Link>
        <Link
          to="/resources"
          className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/60 hover:text-[#007AFF] transition-colors"
        >
          Resources
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/book-demo" aria-label="Book Demo">
          <button className="hidden sm:block px-6 py-2.5 rounded-full bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-[#007AFF] hover:text-white transition-all">
            Book Demo
          </button>
        </Link>
        <Link to="/auth" aria-label="Login / Register">
          <button className="px-6 py-2.5 rounded-full bg-[#007AFF] text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
            Login / Register
          </button>
        </Link>
      </div>
    </div>
  </nav>
);

const LandingPage = () => {
  useSEO({
    title: "Autonomous Identity Defense",
    description:
      "E-VARA provides military-grade cyber intelligence and autonomous identity monitoring for high-value targets, protecting against deepfakes and digital surface threats.",
    canonicalUrl: "https://e-vara.vercel.app/",
  });

  useEffect(() => {
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
    <div className="bg-[#050505] text-white selection:bg-[#007AFF]/30 selection:text-white">
      <div className="scanline" />
      <PremiumNavbar />

      <main>
        <Hero />

        {/* The Problem Section */}
        <section className="py-20 lg:py-40 container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-tighter mb-8 lg:mb-10 leading-[0.85]">
                The Digital <br />{" "}
                <span className="text-[#007AFF] italic">Trust</span> Crisis
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl text-white/60 font-light leading-relaxed mb-10 lg:mb-12 max-w-xl">
                Generative AI has weaponized digital identity. Organizations and
                individuals are now targets of 900% more sophisticated deepfakes
                than in 2024.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10">
                <div className="p-10 rounded-[32px] bg-white/[0.02] border border-white/10 backdrop-blur-xl">
                  <p className="text-5xl font-bold text-[#007AFF] mb-3">900%</p>
                  <p className="text-[11px] font-mono text-white/60 uppercase tracking-widest">
                    Deepfake Growth_
                  </p>
                </div>
                <div className="p-10 rounded-[32px] bg-white/[0.02] border border-white/10 backdrop-blur-xl">
                  <p className="text-5xl font-bold text-[#007AFF] mb-3">
                    $12.4B
                  </p>
                  <p className="text-[11px] font-mono text-white/60 uppercase tracking-widest">
                    Reputation Loss_
                  </p>
                </div>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 bg-[#007AFF]/10 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative p-1 rounded-[48px] bg-gradient-to-br from-white/10 to-transparent">
                <div className="bg-black rounded-[46px] p-16 overflow-hidden">
                  <div className="absolute inset-0 hud-grid opacity-20" />
                  <div className="space-y-10 relative z-10">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono text-[#007AFF]">
                        SCAN_SEQUENCE: INITIALIZED
                      </span>
                      <div className="w-2 h-2 rounded-full bg-[#007AFF] animate-pulse" />
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-[#007AFF] animate-[panel-scan_4s_linear_infinite]" />
                    </div>
                    <div className="space-y-4">
                      <div className="h-3 w-3/4 bg-white/5 rounded-full" />
                      <div className="h-3 w-1/2 bg-white/5 rounded-full" />
                      <div className="h-3 w-2/3 bg-white/5 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Workflow />

        <section className="py-20 lg:py-40 container mx-auto px-4 sm:px-6 bg-[radial-gradient(circle_at_50%_50%,#007AFF05,transparent_70%)] overflow-hidden">
          <div className="max-w-4xl mx-auto text-center mb-16 lg:mb-24">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-tighter mb-6 lg:mb-10 italic">
              The Interface
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-white/60 font-light max-w-2xl mx-auto">
              Institutional-grade monitoring. Designed for the high-end security
              professional.
            </p>
          </div>
          <DashboardMockup />
        </section>

        <InvestorSection />

        <section className="py-20 lg:py-40 bg-black border-y border-white/5">
          <div className="container mx-auto px-4 sm:px-6 text-center mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight text-white mb-6 uppercase">
              Core Technology_
            </h2>
            <div className="w-24 h-1 bg-[#007AFF] mx-auto" />
          </div>
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
              {[
                {
                  t: "Computer Vision",
                  d: "Proprietary biometric mapping of facial landmarks.",
                },
                {
                  t: "Neural Classification",
                  d: "Real-time integrity scoring of visual data streams.",
                },
                {
                  t: "Web Intelligence",
                  d: "Distributed crawlers monitoring the dark & surface web.",
                },
                {
                  t: "Threat Graphs",
                  d: "Vector analysis of reputation-damaging content clusters.",
                },
              ].map((tech, i) => (
                <div
                  key={i}
                  className="group p-12 rounded-[40px] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-[#007AFF]/30 transition-all duration-500"
                >
                  <p className="text-2xl font-bold text-white mb-6 tracking-tight group-hover:text-[#007AFF] transition-colors">
                    {tech.t}
                  </p>
                  <p className="text-base text-white/60 leading-relaxed font-light">
                    {tech.d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-24 border-t border-white/5 bg-[#050505]">
        <div className="container mx-auto px-6 grid md:grid-cols-4 gap-20">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-10">
              <Shield className="w-10 h-10 text-[#007AFF]" />
              <span className="text-3xl font-bold tracking-tighter text-white uppercase italic">
                E-vara
              </span>
            </div>
            <p className="text-white/60 max-w-md font-light leading-relaxed mb-12">
              Building the world's most advanced autonomous digital reputation
              defense platform. Protecting digital sovereignty in the age of
              synthetic media.
            </p>
            <div className="flex gap-6">
              {["X", "LinkedIn", "GitHub", "Discord"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-xs font-mono text-white/50 hover:text-[#007AFF] transition-colors uppercase tracking-widest"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-mono text-white mb-8 uppercase tracking-[0.2em]">
              Platform
            </p>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/solutions"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Solutions
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/resources"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Resources
                </Link>
              </li>
              <li>
                <Link
                  to="/docs"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-mono text-white mb-8 uppercase tracking-[0.2em]">
              Company
            </p>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/auth"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Console Login
                </Link>
              </li>
              <li>
                <Link
                  to="/book-demo"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Ask Demo
                </Link>
              </li>
              <li>
                <a
                  href="#security"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Security
                </a>
              </li>
              <li>
                <Link
                  to="/support"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-mono text-white/50 uppercase tracking-[0.3em]">
            © 2026 E-VARA SECURITY SYSTEMS. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-10">
            <a
              href="#"
              className="text-[10px] font-mono text-white/60 hover:text-white uppercase"
            >
              Privacy_Policy
            </a>
            <a
              href="#"
              className="text-[10px] font-mono text-white/60 hover:text-white uppercase"
            >
              Terms_of_Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
