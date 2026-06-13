import { motion } from "framer-motion";

interface Blip {
  label: string;
  value: string;
  angle: number;
  distance: number;
  delay: number;
}

const blips: Blip[] = [
  {
    label: "Dark Networks",
    value: "4,500+",
    angle: 25,
    distance: 38,
    delay: 0,
  },
  {
    label: "False Positive",
    value: "0.0%",
    angle: 145,
    distance: 52,
    delay: 1.5,
  },
  {
    label: "Early Warning",
    value: "24-48h",
    angle: 230,
    distance: 42,
    delay: 3,
  },
  {
    label: "Threats Blocked",
    value: "1,247",
    angle: 315,
    distance: 55,
    delay: 2,
  },
];

function polarToPercent(angle: number, distance: number) {
  const rad = (angle * Math.PI) / 180;
  const r = distance * 0.5;
  return {
    left: `${50 + r * Math.cos(rad)}%`,
    top: `${50 + r * Math.sin(rad)}%`,
  };
}

function labelPosition(angle: number, distance: number) {
  const rad = (angle * Math.PI) / 180;
  const r = distance * 0.5 + 28;
  return {
    left: `${50 + r * Math.cos(rad)}%`,
    top: `${50 + r * Math.sin(rad)}%`,
  };
}

const RadarSweep = () => {
  return (
    <div className="relative w-[500px] h-[500px] mx-auto">
      {/* Rings */}
      <div className="absolute inset-0 rounded-full border border-primary/15" />
      <div className="absolute inset-[20%] rounded-full border border-primary/10" />
      <div className="absolute inset-[40%] rounded-full border border-primary/10" />
      <div className="absolute inset-[60%] rounded-full border border-primary/10" />

      {/* Crosshairs */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
      <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-8 bg-primary/5" />
      <div className="absolute top-1/2 left-0 right-0 h-px translate-y-8 bg-primary/5" />
      <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-8 bg-primary/5" />
      <div className="absolute left-1/2 top-0 bottom-0 w-px translate-x-8 bg-primary/5" />

      {/* Angle markers */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
        const pos = polarToPercent(a, 96);
        return (
          <div
            key={a}
            className="absolute w-1 h-1 rounded-full bg-primary/30"
            style={{
              left: pos.left,
              top: pos.top,
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}

      {/* Sweeping beam */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute top-1/2 left-1/2 w-1/2 h-px bg-gradient-to-r from-primary/60 via-primary/20 to-transparent origin-left -translate-y-1/2" />
      </motion.div>

      {/* Center dot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary shadow-[0_0_20px_hsl(var(--primary)/0.5)]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-primary/20" />

      {/* Blips */}
      {blips.map((blip) => {
        const pos = polarToPercent(blip.angle, blip.distance);
        return (
          <div
            key={blip.label}
            className="absolute"
            style={{
              left: pos.left,
              top: pos.top,
              transform: "translate(-50%, -50%)",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
              transition={{
                duration: 2.5,
                delay: blip.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary)/0.9)]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 0.4, 0], scale: [0, 3, 0] }}
              transition={{
                duration: 2.5,
                delay: blip.delay,
                repeat: Infinity,
                ease: "easeOut",
              }}
              className="absolute inset-0 rounded-full border border-primary/50"
            />
          </div>
        );
      })}

      {/* Labels */}
      {blips.map((blip) => {
        const pos = labelPosition(blip.angle, blip.distance);
        const isRight = blip.angle < 90 || blip.angle > 270;
        return (
          <div
            key={`l-${blip.label}`}
            className="absolute"
            style={{
              left: pos.left,
              top: pos.top,
              transform: "translate(-50%, -50%)",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: blip.delay, ease: "easeOut" }}
              className={`${isRight ? "text-left" : "text-right"}`}
            >
              <p className="text-[11px] font-bold text-primary tracking-tight leading-none mb-0.5">
                {blip.value}
              </p>
              <p className="text-[7px] font-mono text-muted-foreground uppercase tracking-widest leading-none">
                {blip.label}
              </p>
            </motion.div>
          </div>
        );
      })}

      {/* Bottom label */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
        <p className="text-[8px] font-mono text-muted-foreground uppercase tracking-[0.3em]">
          REAL-TIME THREAT RADAR
        </p>
      </div>
    </div>
  );
};

export default RadarSweep;
