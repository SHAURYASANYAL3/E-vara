import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  Shield,
  Eye,
  Loader2,
  ArrowLeft,
  Fingerprint,
  Mail,
  KeyRound,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { isWebAuthnSupported } from "@/lib/webauthn";
import { toast } from "sonner";

interface AuthPageProps {
  onAuth: () => void;
}

type AuthMethod = "passkey" | "magic-link" | "password";

const AuthPage = ({ onAuth }: AuthPageProps) => {
  const [method, setMethod] = useState<AuthMethod>("passkey");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [webAuthnAvailable, setWebAuthnAvailable] = useState(false);

  // Handshake log console states
  const [handshakeLogs, setHandshakeLogs] = useState<string[]>([]);
  const [scanning, setScanning] = useState(false);

  const { register, login, signInWithOtp, registerPasskey, loginWithPasskey } =
    useAuth();

  useEffect(() => {
    setWebAuthnAvailable(isWebAuthnSupported());
  }, []);

  const addLog = (message: string) => {
    setHandshakeLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ${message}`,
    ]);
  };

  const handlePasskeyAuth = async () => {
    if (!email) {
      setError("Please designate a target email address first.");
      return;
    }
    setError("");
    setLoading(true);
    setScanning(true);
    setHandshakeLogs([]);

    try {
      if (mode === "register") {
        addLog("Initializing WebAuthn credential registration...");
        addLog("Requesting platform authenticator attestation...");
        await registerPasskey(email);
        addLog("Cryptographic key pair generated & registered.");
        toast.success(
          "Passkey enrolled! You can now log in using this device.",
        );
        setMode("login");
      } else {
        addLog("Requesting credential assertion challenge...");
        addLog("Awaiting user biometric/PIN verification...");
        await loginWithPasskey(email);
        addLog("Attestation payload verified successfully.");
        addLog("Session established.");
        onAuth();
      }
    } catch (err) {
      const errorMsg = (err as Error).message || "Passkey operation declined.";
      addLog(`ERROR: ${errorMsg}`);
      setError(errorMsg);
    } finally {
      setLoading(false);
      setScanning(false);
    }
  };

  const handleMagicLinkAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError("");
    setLoading(true);
    try {
      await signInWithOtp(email);
    } catch (err) {
      setError((err as Error).message || "Magic Link delivery failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);

    if (mode === "register") {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }
      try {
        await register(email, password);
        setMode("login");
        setPassword("");
        setConfirmPassword("");
        toast.success("Account created successfully!");
      } catch (error) {
        const err = error as Error;
        setError(err.message || "Registration failed");
      }
    } else {
      try {
        await login(email, password);
        onAuth();
      } catch (error) {
        const err = error as Error;
        setError(err.message || "Authentication failed");
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050608] px-4 font-mono">
      <div className="absolute inset-0 hud-grid opacity-5 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[10px] uppercase font-bold text-muted-foreground hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="h-3 w-3" /> Back to Grid
        </Link>

        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg security-orange-glow">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-black text-foreground tracking-tighter uppercase">
              E-Vara
            </h1>
          </div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.4em]">
            Establishing Secure Session
          </p>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-[#11141B] p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 hud-grid opacity-[0.03] pointer-events-none" />

          {/* Segmented Controls for Auth Method */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-[#050608]/50 rounded-[14px] border border-white/5 mb-8">
            <button
              onClick={() => {
                setMethod("passkey");
                setError("");
              }}
              className={`flex flex-col items-center gap-1 py-2 text-[9px] uppercase font-bold tracking-wider rounded-[10px] transition-all ${
                method === "passkey"
                  ? "bg-primary text-white security-orange-glow"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              <Fingerprint className="h-4.5 w-4.5" />
              Passkey
            </button>
            <button
              onClick={() => {
                setMethod("magic-link");
                setError("");
              }}
              className={`flex flex-col items-center gap-1 py-2 text-[9px] uppercase font-bold tracking-wider rounded-[10px] transition-all ${
                method === "magic-link"
                  ? "bg-primary text-white security-orange-glow"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              <Mail className="h-4.5 w-4.5" />
              OTP Link
            </button>
            <button
              onClick={() => {
                setMethod("password");
                setError("");
              }}
              className={`flex flex-col items-center gap-1 py-2 text-[9px] uppercase font-bold tracking-wider rounded-[10px] transition-all ${
                method === "password"
                  ? "bg-primary text-white security-orange-glow"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              <KeyRound className="h-4.5 w-4.5" />
              Access Key
            </button>
          </div>

          <h2 className="mb-6 text-lg font-bold text-foreground uppercase tracking-tight relative z-10 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            {method === "passkey" &&
              (mode === "login"
                ? "Passkey_Authentication"
                : "Register_Passkey")}
            {method === "magic-link" && "Passwordless_Link_Protocol"}
            {method === "password" &&
              (mode === "login" ? "Identity_Verify" : "Register_Protocol")}
          </h2>

          {/* Passkey Verification Interface */}
          {method === "passkey" && (
            <div className="space-y-6 relative z-10">
              {!webAuthnAvailable && (
                <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-[10px] uppercase font-bold text-red-400 flex items-start gap-2">
                  <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <span>WebAuthn not supported by this browser.</span>
                    <p className="font-normal text-[9px] lowercase text-red-400/80 mt-1">
                      please use magic link or traditional access key.
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  Email_Designation
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-[12px] border border-white/10 bg-[#050608]/50 px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  placeholder="target@company.com"
                  maxLength={255}
                />
              </div>

              {/* Glowing Fingerprint Verification Circle */}
              <div className="flex flex-col items-center justify-center py-6">
                <button
                  type="button"
                  onClick={handlePasskeyAuth}
                  disabled={loading || !webAuthnAvailable}
                  className={`relative w-24 h-24 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    scanning
                      ? "border-primary security-orange-glow animate-pulse"
                      : "border-white/10 hover:border-primary/50 hover:security-orange-glow"
                  } bg-[#050608]/80`}
                >
                  <Fingerprint
                    className={`h-12 w-12 text-primary transition-transform duration-300 ${scanning ? "scale-110" : "hover:scale-105"}`}
                  />
                  {scanning && (
                    <div className="absolute inset-0 rounded-full border border-primary animate-ping opacity-75" />
                  )}
                </button>
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground mt-4 font-bold">
                  {scanning
                    ? "Scanning Biometrics..."
                    : "Press to Authenticate"}
                </span>
              </div>

              {/* Handshake Debug Output */}
              {handshakeLogs.length > 0 && (
                <div className="p-3 rounded-lg border border-white/5 bg-[#050608]/80 text-[9px] text-primary/80 font-mono space-y-1 max-h-32 overflow-y-auto">
                  <div className="text-[8px] text-muted-foreground uppercase tracking-widest font-bold mb-1 border-b border-white/5 pb-1">
                    System Handshake Output
                  </div>
                  {handshakeLogs.map((log, idx) => (
                    <div key={idx} className="leading-normal">
                      {log}
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 text-[10px] uppercase font-bold text-primary animate-pulse">
                  ERR: {error}
                </div>
              )}
            </div>
          )}

          {/* Magic Link Email Verification */}
          {method === "magic-link" && (
            <form
              onSubmit={handleMagicLinkAuth}
              className="space-y-6 relative z-10"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  Email_Designation
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-[12px] border border-white/10 bg-[#050608]/50 px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  placeholder="target@company.com"
                  maxLength={255}
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 text-[10px] uppercase font-bold text-primary animate-pulse">
                  ERR: {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full rounded-[14px] bg-primary py-4 text-xs font-bold text-white uppercase tracking-[0.3em] hover:bg-primary/90 transition-all security-orange-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Dispatching...
                  </>
                ) : (
                  "Send_Magic_Link"
                )}
              </button>
            </form>
          )}

          {/* Traditional Password Credentials */}
          {method === "password" && (
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  Email_Designation
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-[12px] border border-white/10 bg-[#050608]/50 px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  placeholder="target@company.com"
                  maxLength={255}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  Access_Key
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-[12px] border border-white/10 bg-[#050608]/50 px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                    placeholder="••••••••"
                    maxLength={128}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {mode === "register" && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">
                    Confirm_Access_Key
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full rounded-[12px] border border-white/10 bg-[#050608]/50 px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                    placeholder="••••••••"
                    maxLength={128}
                  />
                </div>
              )}

              {error && (
                <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 text-[10px] uppercase font-bold text-primary animate-pulse">
                  ERR: {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-[14px] bg-primary py-4 text-xs font-bold text-white uppercase tracking-[0.3em] hover:bg-primary/90 transition-all security-orange-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : mode === "login" ? (
                  "Initialize_Link"
                ) : (
                  "Establish_Protocol"
                )}
              </button>
            </form>
          )}

          {/* Footer controls for registering/logging in under current mode */}
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-2">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest text-center">
              {mode === "login"
                ? "No account designation?"
                : "Identity already verified?"}{" "}
              <button
                onClick={() => {
                  setMode(mode === "login" ? "register" : "login");
                  setError("");
                  setHandshakeLogs([]);
                }}
                className="text-primary hover:underline font-bold"
              >
                {mode === "login" ? "[Register]" : "[Sign_In]"}
              </button>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-[9px] text-muted-foreground uppercase tracking-widest leading-relaxed">
          All session data is encrypted using military-grade protocols. <br />
          Unauthorized access attempts are logged and reported.
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
