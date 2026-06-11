import React, { Component, ErrorInfo, ReactNode } from "react";
import {
  AlertOctagon,
  RefreshCw,
  Terminal,
  Home,
  AlertCircle,
} from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    localStorage.removeItem("e_vara_simulation_mode");
    localStorage.removeItem("e_vara_demo_auth");
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = "/";
  };

  private handleSimulate = () => {
    localStorage.setItem("e_vara_simulation_mode", "true");
    localStorage.setItem("e_vara_demo_auth", "true");
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#05060a] text-[#ff453a] font-mono p-4 overflow-y-auto">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,69,58,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,69,58,0.15) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/5 to-transparent pointer-events-none animate-pulse" />

          <div className="max-w-xl w-full border border-[#ff453a]/30 bg-[#0c0f16]/95 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-[0_0_50px_rgba(255,69,58,0.15)]">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-500 via-orange-500 to-red-500 animate-pulse" />

            <div className="mb-6 flex items-center gap-4">
              <div className="p-3 bg-[#ff453a]/10 border border-[#ff453a]/40 rounded-xl text-[#ff453a] animate-pulse">
                <AlertOctagon className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-sm font-black tracking-[0.25em] uppercase text-white">
                  Cyber Command Alert
                </h1>
                <p className="text-[9px] text-[#ff453a]/70 uppercase tracking-widest font-bold">
                  Resiliency layer engaged
                </p>
              </div>
            </div>

            <div className="border border-[#ff453a]/20 bg-black/40 rounded-lg p-4 mb-6 text-xs text-red-200 overflow-x-auto max-h-48">
              <div className="flex items-center gap-1.5 text-[9px] text-red-400 font-bold uppercase tracking-wider mb-2 border-b border-[#ff453a]/10 pb-1">
                <Terminal className="h-3 w-3" /> System Diagnostics
              </div>
              <p className="font-bold mb-1">
                {this.state.error?.name}: {this.state.error?.message}
              </p>
              <pre className="text-[10px] leading-relaxed text-[#ff8e88] font-mono whitespace-pre-wrap">
                {this.state.error?.stack || "No trace available"}
              </pre>
            </div>

            <p className="text-xs text-muted-foreground font-body leading-relaxed mb-6">
              A critical failure occurred inside the system pipeline. E-VARA's
              universal self-healing layer has intercepted the crash to prevent
              browser blackout.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center gap-2 bg-[#ff453a]/10 hover:bg-[#ff453a]/25 border border-[#ff453a]/40 text-[#ff453a] py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Reset & Recover
              </button>
              <button
                onClick={this.handleSimulate}
                className="flex-1 flex items-center justify-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-400 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
              >
                <AlertCircle className="h-3.5 w-3.5" /> Bypass to Simulator
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
