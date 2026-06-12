import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="py-20 border-t border-white/5">
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-5 gap-12 mb-20">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-primary rounded-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight uppercase font-mono">
              E-VARA
            </span>
          </div>
          <p className="text-muted-foreground max-w-sm font-body leading-relaxed">
            Autonomous identity intelligence and threat containment for the
            modern executive. Built in the grid, verified by the source.
          </p>
        </div>
        <div>
          <h4 className="font-bold uppercase tracking-widest text-xs mb-6">
            Core Systems
          </h4>
          <ul className="space-y-4 text-sm text-muted-foreground font-mono uppercase tracking-tighter">
            <li>
              <Link
                to="/client-portal"
                className="hover:text-primary transition-colors"
              >
                Client Portal
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard"
                className="hover:text-primary transition-colors"
              >
                Neural Net Scan
              </Link>
            </li>
            <li>
              <Link
                to="/identity-records"
                className="hover:text-primary transition-colors"
              >
                Identity Engine
              </Link>
            </li>
            <li>
              <Link
                to="/client-portal"
                className="hover:text-primary transition-colors"
              >
                Threat Surface
              </Link>
            </li>
            <li>
              <Link
                to="/support"
                className="hover:text-primary transition-colors"
              >
                API Keys
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold uppercase tracking-widest text-xs mb-6">
            Legal Protocol
          </h4>
          <ul className="space-y-4 text-sm text-muted-foreground font-mono uppercase tracking-tighter">
            <li>
              <Link
                to="/legal#data-privacy"
                className="hover:text-primary transition-colors"
              >
                Data Privacy
              </Link>
            </li>
            <li>
              <Link
                to="/trust-center"
                className="hover:text-primary transition-colors"
              >
                Trust Center
              </Link>
            </li>
            <li>
              <Link
                to="/legal#terms"
                className="hover:text-primary transition-colors"
              >
                Terms of Use
              </Link>
            </li>
            <li>
              <Link
                to="/legal#ethics"
                className="hover:text-primary transition-colors"
              >
                Security Ethics
              </Link>
            </li>
            <li>
              <Link
                to="/legal"
                className="hover:text-primary transition-colors"
              >
                Compliance
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold uppercase tracking-widest text-xs mb-6">
            Resources
          </h4>
          <ul className="space-y-4 text-sm text-muted-foreground font-mono uppercase tracking-tighter">
            <li>
              <Link
                to="/blog"
                className="hover:text-primary transition-colors"
              >
                Intelligence Blog
              </Link>
            </li>
            <li>
              <Link
                to="/resources"
                className="hover:text-primary transition-colors"
              >
                Whitepapers
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-12 border-t border-white/5 text-[10px] font-mono uppercase text-muted-foreground tracking-[0.2em]">
        <span>© 2026 E-VARA SECURITY SYSTEMS. ALL RIGHTS RESERVED.</span>
        <div className="flex gap-8">
          <span>LATENCY: 12ms</span>
          <span className="text-success">NODE: SG-0182-ACTIVE</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
