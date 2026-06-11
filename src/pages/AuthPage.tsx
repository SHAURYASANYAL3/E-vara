import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Shield, Eye, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface AuthPageProps {
  onAuth: () => void;
}

const AuthPage = ({ onAuth }: AuthPageProps) => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, login } = useAuth();

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

          <h2 className="mb-8 text-xl font-bold text-foreground uppercase tracking-tight relative z-10">
            {mode === "login" ? "Identity_Verify" : "Register_Protocol"}
          </h2>

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

          <p className="mt-8 text-center text-[10px] text-muted-foreground uppercase tracking-widest">
            {mode === "login"
              ? "No account designation?"
              : "Identity already verified?"}{" "}
            <button
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
              }}
              className="text-primary hover:underline font-bold"
            >
              {mode === "login" ? "[Register]" : "[Sign_In]"}
            </button>
          </p>
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
