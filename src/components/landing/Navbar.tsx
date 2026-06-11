import { Shield, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface NavbarProps {
  isScrolled: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const Navbar = ({
  isScrolled,
  mobileMenuOpen,
  setMobileMenuOpen,
}: NavbarProps) => (
  <nav
    className={`fixed top-0 left-0 right-0 z-[100] h-20 transition-all duration-300 ${isScrolled ? "bg-[#050608]/80 backdrop-blur-xl border-b border-white/5" : "bg-transparent"}`}
  >
    <div className="container mx-auto h-full px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-primary rounded-lg security-orange-glow">
          <Shield className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-black tracking-tight uppercase font-mono">
          E-VARA
        </span>
      </div>

      <div className="hidden md:flex items-center gap-10">
        <Link
          to="/solutions"
          className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider font-mono"
        >
          Solutions
        </Link>
        <Link
          to="/threat-detection"
          className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider font-mono"
        >
          Threat Detection
        </Link>
        <Link
          to="/pricing"
          className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider font-mono"
        >
          Pricing
        </Link>
        <Link
          to="/resources"
          className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider font-mono"
        >
          Resources
        </Link>
        <Link
          to="/docs"
          className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider font-mono"
        >
          Docs
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/book-demo">
          <Button
            variant="ghost"
            className="hidden sm:inline-flex uppercase tracking-widest text-[10px] font-bold"
          >
            Book Demo
          </Button>
        </Link>
        <Link to="/client-portal">
          <Button
            variant="outline"
            className="hidden lg:inline-flex border-white/10 text-[10px] uppercase font-bold tracking-widest"
          >
            Client Portal
          </Button>
        </Link>
        <Link to="/auth">
          <Button className="bg-primary hover:bg-primary/90 text-white rounded-[14px] px-8 py-6 uppercase tracking-widest text-[10px] font-bold security-orange-glow">
            Start Free
          </Button>
        </Link>
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </div>
  </nav>
);

export default Navbar;
