import { motion } from "framer-motion";
import { TrendingUp, Users, Target, BarChart3 } from "lucide-react";

const InvestorSection = () => {
  const marketStats = [
    {
      label: "TAM",
      val: "$42.5B",
      sub: "Total Addressable Market",
      icon: Globe,
    },
    {
      label: "SAM",
      val: "$8.2B",
      sub: "Serviceable Addressable Market",
      icon: Target,
    },
    {
      label: "SOM",
      val: "$1.4B",
      sub: "Serviceable Obtainable Market",
      icon: BarChart3,
    },
  ];

  return (
    <section className="py-32 bg-graphite-dark relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-electric-blue/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8"
          >
            <TrendingUp className="w-3 h-3 text-electric-blue" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white/60">
              Investor_Portal
            </span>
          </motion.div>
          <h2 className="text-5xl lg:text-7xl font-bold tracking-tighter text-white mb-8">
            A Venture-Scale <br /> Opportunity
          </h2>
          <p className="text-xl text-white/60 font-light">
            E-vara is positioned at the intersection of Generative AI growth and
            the digital trust crisis.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {marketStats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-10 rounded-[32px] border border-white/5 bg-white/[0.02] backdrop-blur-xl group hover:border-electric-blue/30 transition-all"
            >
              <p className="text-[10px] font-mono text-white/60 uppercase tracking-[0.3em] mb-4">
                {stat.label}
              </p>
              <p className="text-6xl font-bold text-white mb-4 tracking-tighter group-hover:text-electric-blue transition-colors">
                {stat.val}
              </p>
              <p className="text-sm text-white/60 leading-relaxed">
                {stat.sub}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="p-1 rounded-[32px] bg-gradient-to-br from-white/10 to-transparent">
          <div className="bg-graphite-light rounded-[28px] p-12 lg:p-16 flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2 space-y-8">
              <h3 className="text-4xl font-bold text-white tracking-tight">
                Revenue Model & Scalability
              </h3>
              <div className="space-y-6">
                {[
                  {
                    title: "Enterprise Licensing",
                    desc: "Annual recurring revenue from corporate reputation management.",
                  },
                  {
                    title: "Government Partnerships",
                    desc: "Digital sovereignty and misinformation defense contracts.",
                  },
                  {
                    title: "API Integrations",
                    desc: "Usage-based billing for social platforms and media houses.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="w-12 h-12 rounded-xl bg-electric-blue/10 flex items-center justify-center shrink-0">
                      <Users className="w-6 h-6 text-electric-blue" />
                    </div>
                    <div>
                      <p className="font-bold text-white mb-1 uppercase text-xs tracking-widest">
                        {item.title}
                      </p>
                      <p className="text-sm text-white/60">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 w-full h-[400px] rounded-2xl bg-black/40 border border-white/5 p-8 flex flex-col justify-end relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-electric-blue/10 to-transparent" />
              <div className="relative z-10">
                <p className="text-[10px] font-mono text-electric-blue uppercase mb-2">
                  Growth_Projection_2026-2030
                </p>
                <div className="flex items-end gap-2 h-40">
                  {[30, 45, 60, 85, 100].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      transition={{ delay: i * 0.1, duration: 1 }}
                      className="flex-1 bg-electric-blue rounded-t-lg relative group"
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        {2026 + i}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import { Globe } from "lucide-react";
export default InvestorSection;
