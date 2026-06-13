import * as React from "react";
import { motion } from "framer-motion";
import { Shield, Activity, Lock, Search, AlertCircle, Globe } from "lucide-react";

const generateNodes = () => {
  return Array.from({ length: 5 }).map((_, i) => ({
    id: i,
    x: [Math.random() * 200 - 100, Math.random() * 200 - 100],
    y: [Math.random() * 100 - 50, Math.random() * 100 - 50],
  }));
};

const DashboardMockup = () => {
  const floatingNodes = React.useMemo(() => generateNodes(), []);

  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-electric-blue/20 to-purple-600/20 rounded-[32px] blur-2xl opacity-50" />
      <div className="relative rounded-[24px] border border-white/10 bg-graphite/80 backdrop-blur-xl p-8">
        <h2 className="text-white">Dashboard Mockup</h2>
        {floatingNodes.map((node) => (
          <motion.div key={node.id} animate={{ x: node.x, y: node.y }} className="absolute text-white">
            SCANNING...
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DashboardMockup;