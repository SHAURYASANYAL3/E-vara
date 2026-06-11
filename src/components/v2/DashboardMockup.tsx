import { motion } from "framer-motion";
import {
  Shield,
  Activity,
  Lock,
  Search,
  AlertCircle,
  Globe,
} from "lucide-react";

const DashboardMockup = () => {
  return (
    <div className="relative group">
      {/* Background Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-electric-blue/20 to-purple-600/20 rounded-[32px] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />

      {/* Main Container */}
      <div className="relative rounded-[24px] border border-white/10 bg-graphite/80 backdrop-blur-xl p-1 overflow-hidden">
        <div className="absolute inset-0 hud-grid opacity-[0.05]" />

        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
            </div>
            <div className="h-4 w-px bg-white/10 mx-2" />
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-electric-blue" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/70">
                Secure_Node: Delta-09
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-[9px] font-mono text-success uppercase">
                System_Healthy
              </span>
            </div>
            <span className="text-[9px] font-mono text-white/60">
              10:42:15 UTC
            </span>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-4 sm:p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Key Stats */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.03] space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono text-white/60 uppercase">
                  Risk Snapshot
                </span>
                <Activity className="w-4 h-4 text-electric-blue" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold tracking-tighter">04</span>
                <span className="text-white/60 font-mono text-xs">/ 100</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "4%" }}
                  className="h-full bg-electric-blue"
                />
              </div>
              <p className="text-[10px] text-success font-mono">
                STATUS: MINIMAL_EXPOSURE
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.03] space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono text-white/60 uppercase">
                  AI Integrity Index
                </span>
                <Lock className="w-4 h-4 text-purple-500" />
              </div>
              <span className="text-3xl font-bold tracking-tighter">99.8%</span>
              <div className="grid grid-cols-8 gap-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-8 rounded-sm ${i < 7 ? "bg-electric-blue/20" : "bg-electric-blue/5"}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Center Column - Visualizations */}
          <div className="lg:col-span-8 space-y-6">
            <div className="h-[280px] rounded-2xl border border-white/5 bg-white/[0.02] relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/5 to-transparent" />
              <Search className="w-12 h-12 text-electric-blue/20 animate-pulse" />

              {/* Animated Scanning Lines */}
              <motion.div
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-px bg-electric-blue/30 shadow-[0_0_15px_rgba(0,122,255,0.5)] z-10"
              />

              {/* Floating Data Nodes */}
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    x: [Math.random() * 200 - 100, Math.random() * 200 - 100],
                    y: [Math.random() * 100 - 50, Math.random() * 100 - 50],
                  }}
                  transition={{
                    duration: 10 + i,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute p-2 rounded-lg border border-white/10 bg-black/40 backdrop-blur-md flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-electric-blue" />
                  <span className="text-[8px] font-mono text-white/60">
                    SCANNING_DATA_STREAM_{i}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.03]">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-4 h-4 text-electric-blue" />
                  <span className="text-[10px] font-mono text-white/60 uppercase">
                    Active Monitoring
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">12.4k</span>
                  <span className="text-[10px] text-white/60 font-mono">
                    sources/sec
                  </span>
                </div>
              </div>
              <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.03]">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-4 h-4 text-warning" />
                  <span className="text-[10px] font-mono text-white/60 uppercase">
                    Recent Alerts
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">0</span>
                  <span className="text-[10px] text-success font-mono">
                    clean
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMockup;
