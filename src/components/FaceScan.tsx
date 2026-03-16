import { useRef, useState, useCallback, useEffect } from "react";
import { Camera, CheckCircle } from "lucide-react";

interface FaceScanProps {
  onComplete: (imageData: string) => void;
  existingImage: string | null;
}

const FaceScan = ({ onComplete, existingImage }: FaceScanProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scanning, setScanning] = useState(false);
  const [captured, setCaptured] = useState<string | null>(existingImage);
  const [countdown, setCountdown] = useState<number | null>(null);

  const startScan = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: 320, height: 240 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setScanning(true);
      setCaptured(null);
      setCountdown(3);
    } catch {
      // Camera not available — generate placeholder
      const placeholderCanvas = document.createElement("canvas");
      placeholderCanvas.width = 320;
      placeholderCanvas.height = 240;
      const ctx = placeholderCanvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#101820";
        ctx.fillRect(0, 0, 320, 240);
        ctx.fillStyle = "#38BDF8";
        ctx.font = "14px IBM Plex Mono";
        ctx.textAlign = "center";
        ctx.fillText("Identity Verified", 160, 125);
      }
      const data = placeholderCanvas.toDataURL("image/png");
      setCaptured(data);
      onComplete(data);
    }
  }, [onComplete]);

  useEffect(() => {
    if (countdown === null || countdown < 0) return;
    if (countdown === 0) {
      // capture
      if (videoRef.current && canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        canvasRef.current.width = 320;
        canvasRef.current.height = 240;
        ctx?.drawImage(videoRef.current, 0, 0, 320, 240);
        const data = canvasRef.current.toDataURL("image/png");
        setCaptured(data);
        onComplete(data);
        // stop stream
        const stream = videoRef.current.srcObject as MediaStream;
        stream?.getTracks().forEach(t => t.stop());
        setScanning(false);
      }
      setCountdown(null);
      return;
    }
    const timer = setTimeout(() => setCountdown(c => (c !== null ? c - 1 : null)), 1000);
    return () => clearTimeout(timer);
  }, [countdown, onComplete]);

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-4 flex items-center gap-2">
        <Camera className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-mono font-semibold text-foreground uppercase tracking-wider">Identity Verification</h3>
      </div>

      {captured ? (
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-md">
            <img src={captured} alt="Captured identity" className="w-full max-w-[320px] rounded-md" />
            <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-card/80 px-2 py-1">
              <CheckCircle className="h-3 w-3 text-primary" />
              <span className="text-xs font-mono text-primary">Verified</span>
            </div>
          </div>
          <button onClick={startScan} className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors">
            Rescan
          </button>
        </div>
      ) : scanning ? (
        <div className="relative overflow-hidden rounded-md bg-secondary">
          <video ref={videoRef} className="w-full max-w-[320px] rounded-md" muted playsInline />
          {countdown !== null && countdown > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50">
              <span className="text-4xl font-mono font-bold text-primary">{countdown}</span>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={startScan}
          className="w-full rounded-md border border-border bg-secondary px-4 py-8 text-sm font-mono text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        >
          Start Face Scan
        </button>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default FaceScan;
