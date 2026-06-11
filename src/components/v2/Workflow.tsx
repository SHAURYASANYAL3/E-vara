import { motion } from "framer-motion";
import { Camera, Search, Cpu, Bell, ShieldCheck } from "lucide-react";

const Workflow = () => {
  const steps = [
    {
      title: "Face Registration",
      desc: "Secure cryptographic enrollment of facial biometric markers.",
      icon: Camera,
    },
    {
      title: "AI Monitoring",
      desc: "Autonomous agents crawl surface and deep web 24/7.",
      icon: Search,
    },
    {
      title: "Content Analysis",
      desc: "Neural networks classify content integrity in real-time.",
      icon: Cpu,
    },
    {
      title: "Threat Detection",
      desc: "Immediate identification of deepfakes and morphs.",
      icon: ShieldCheck,
    },
    {
      title: "Instant Alerts",
      desc: "Real-time notifications via secure enterprise channels.",
      icon: Bell,
    },
  ];

  return (
    <section className="py-32 bg-graphite-dark">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-5xl lg:text-7xl font-bold tracking-tighter text-white mb-12">
              How E-vara <br />{" "}
              <span className="text-electric-blue italic">Protects</span> You
            </h2>
            <div className="space-y-12">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-8 group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-electric-blue group-hover:border-electric-blue transition-all duration-500">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-widest">
                      {step.title}
                    </h3>
                    <p className="text-white/60 leading-relaxed max-w-sm">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/2 w-full relative">
            <div className="absolute inset-0 bg-electric-blue/10 blur-[100px] rounded-full" />
            <div className="relative p-1 rounded-[40px] border border-white/5 bg-white/[0.02] backdrop-blur-3xl overflow-hidden aspect-square flex items-center justify-center">
              <div className="absolute inset-0 hud-grid opacity-10" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-2/3 h-2/3 border border-dashed border-electric-blue/30 rounded-full flex items-center justify-center"
              >
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="w-1/2 h-1/2 border border-electric-blue/20 rounded-full flex items-center justify-center"
                >
                  <ShieldCheck className="w-16 h-16 text-electric-blue animate-pulse" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Workflow;
