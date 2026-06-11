import {
  Lock,
  Globe,
  Fingerprint,
  Activity,
  ShieldCheck,
  BarChart3,
  ArrowRight,
} from "lucide-react";

const FeatureGrid = () => (
  <section className="py-32 bg-[#08090C]">
    <div className="container mx-auto px-6">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h2 className="text-4xl font-black tracking-tighter uppercase mb-6">
          Omni-Layer Defense
        </h2>
        <p className="text-muted-foreground">
          Every entry point monitored. Every packet analyzed. Every identity
          verified.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            icon: <Lock />,
            title: "Identity Security",
            desc: "Protecting your most valuable asset: who you are.",
          },
          {
            icon: <Globe />,
            title: "API Protection",
            desc: "Enterprise-grade security for your internal systems.",
          },
          {
            icon: <Fingerprint />,
            title: "Behavior Analytics",
            desc: "Detecting anomalies before they become breaches.",
          },
          {
            icon: <Activity />,
            title: "Audit Logs",
            desc: "Immutable, timestamped proof of operational integrity.",
          },
          {
            icon: <ShieldCheck />,
            title: "Cloud Defense",
            desc: "Multi-cloud infrastructure hardening and monitoring.",
          },
          {
            icon: <BarChart3 />,
            title: "Threat Intel",
            desc: "Global collective intelligence updated every minute.",
          },
        ].map((feature, i) => (
          <div
            key={i}
            className="group p-8 rounded-[24px] border border-white/5 bg-[#11141B] hover:border-primary/40 transition-all duration-300 hover:scale-[1.02] cursor-default"
          >
            <div className="p-3 w-fit rounded-xl bg-white/5 mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold uppercase tracking-tight mb-4">
              {feature.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {feature.desc}
            </p>
            <div className="mt-8 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest">
              Initialize Module <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeatureGrid;
