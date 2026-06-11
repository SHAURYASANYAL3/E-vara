import { Shield } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function DemoHealth() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="mb-10 border-b border-border/50 pb-6">
            <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              Demo Health Diagnostics
            </h1>
            <p className="text-muted-foreground mt-2 font-mono text-sm uppercase tracking-wider">
              Internal Vitals • {new Date().toISOString()}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="glass-panel p-4 rounded-lg">
              <p className="text-[10px] uppercase font-mono text-muted-foreground">
                Build Version
              </p>
              <p className="text-xl font-bold mt-1 text-cyan-400">RC-1.0.0</p>
            </div>
            <div className="glass-panel p-4 rounded-lg">
              <p className="text-[10px] uppercase font-mono text-muted-foreground">
                Edge Worker Queue
              </p>
              <p className="text-xl font-bold mt-1 text-emerald-400">
                0 pending
              </p>
            </div>
            <div className="glass-panel p-4 rounded-lg">
              <p className="text-[10px] uppercase font-mono text-muted-foreground">
                Snapshot Freshness
              </p>
              <p className="text-xl font-bold mt-1 text-emerald-400">Stable</p>
            </div>
            <div className="glass-panel p-4 rounded-lg">
              <p className="text-[10px] uppercase font-mono text-muted-foreground">
                Console Errors
              </p>
              <p className="text-xl font-bold mt-1 text-emerald-400">0</p>
            </div>
            <div className="glass-panel p-4 rounded-lg">
              <p className="text-[10px] uppercase font-mono text-muted-foreground">
                Offline Fallback
              </p>
              <p className="text-xl font-bold mt-1 text-emerald-400">Active</p>
            </div>
            <div className="glass-panel p-4 rounded-lg">
              <p className="text-[10px] uppercase font-mono text-muted-foreground">
                Demo Mode
              </p>
              <p className="text-xl font-bold mt-1 text-emerald-400">
                {import.meta.env.VITE_DEMO_MODE === "true" ? "ON" : "OFF"}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
