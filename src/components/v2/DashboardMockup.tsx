import * as React from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Activity,
  Lock,
  Search,
  AlertCircle,
  Globe,
  Terminal,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const DashboardMockup = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative group w-full max-w-5xl mx-auto"
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-electric-blue/20 to-purple-600/20 rounded-[32px] blur-2xl opacity-50 transition duration-1000 group-hover:opacity-100 group-hover:duration-200" />

      <div className="relative rounded-[24px] border border-white/10 bg-black/80 backdrop-blur-xl p-6 md:p-8 flex flex-col gap-6 overflow-hidden shadow-2xl">
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <Shield className="h-6 w-6 text-electric-blue" />
            </motion.div>
            <h2 className="text-xl font-bold tracking-widest uppercase text-white">
              Threat Intelligence
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="hidden sm:inline text-xs font-mono text-green-400 uppercase tracking-widest">
              Active Monitoring
            </span>
          </div>
        </div>

        {/* Grid Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Main Scanner Feed */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 flex flex-col gap-4"
          >
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden flex-1 h-full min-h-[200px] shadow-inner group-hover:border-white/20 transition-colors">
              <div className="flex items-center gap-2 mb-6">
                <Terminal className="h-4 w-4 text-purple-400" />
                <h3 className="text-sm font-mono text-white/70 uppercase">
                  Live Terminal Feed
                </h3>
              </div>
              <div className="space-y-4 font-mono text-xs sm:text-sm text-white/60">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex gap-4"
                >
                  <span className="text-electric-blue shrink-0">[SYSTEM]</span>
                  <span>Initiating deep web scan protocols...</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex gap-4"
                >
                  <span className="text-purple-400 shrink-0">[SCANNING]</span>
                  <span>
                    Enumerating exposed credentials for targeted identities.
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4 }}
                  className="flex gap-4"
                >
                  <span className="text-purple-400 shrink-0">[SCANNING]</span>
                  <span>
                    Cross-referencing dark web forums and data leak sites...
                  </span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2.0, type: "spring" }}
                  className="flex gap-4 text-green-400 mt-2 bg-green-400/10 p-2 rounded-md border border-green-400/20"
                >
                  <span className="shrink-0">[CLEAN]</span>
                  <span>No critical breaches found in the last 24h.</span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Side Metrics */}
          <div className="flex flex-col gap-4">
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center gap-4 cursor-default shadow-sm hover:shadow-electric-blue/10 hover:border-electric-blue/30 transition-all"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              >
                <Globe className="h-6 w-6 text-electric-blue shrink-0" />
              </motion.div>
              <div>
                <div className="text-xs text-white/50 uppercase tracking-wider mb-1">
                  Nodes Active
                </div>
                <div className="font-mono text-xl text-white">1,402</div>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center gap-4 cursor-default shadow-sm hover:shadow-orange-400/10 hover:border-orange-400/30 transition-all"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <AlertCircle className="h-6 w-6 text-orange-400 shrink-0" />
              </motion.div>
              <div>
                <div className="text-xs text-white/50 uppercase tracking-wider mb-1">
                  Anomalies Detected
                </div>
                <div className="font-mono text-xl text-white">0</div>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center gap-4 cursor-default shadow-sm hover:shadow-green-400/10 hover:border-green-400/30 transition-all"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 3, delay: 1 }}
              >
                <Lock className="h-6 w-6 text-green-400 shrink-0" />
              </motion.div>
              <div>
                <div className="text-xs text-white/50 uppercase tracking-wider mb-1">
                  Security Posture
                </div>
                <div className="font-mono text-xl text-green-400">Optimal</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardMockup;
