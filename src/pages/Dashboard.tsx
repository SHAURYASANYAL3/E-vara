import { useState, useCallback } from "react";
import { Shield, LogOut, History, Sun, Moon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import FaceScan from "@/components/FaceScan";
import IdentityForm from "@/components/IdentityForm";
import MonitoringFeed, { type AlertItem } from "@/components/MonitoringFeed";
import ToolsPanel from "@/components/ToolsPanel";
import StatsCards from "@/components/StatsCards";
import AlertHistory from "@/pages/AlertHistory";

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard = ({ onLogout }: DashboardProps) => {
  const { user, logout, getIdentity, saveIdentity } = useAuth();
  const { theme, toggle: toggleTheme } = useTheme();
  const [identity, setIdentity] = useState(getIdentity());
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [scanCount, setScanCount] = useState(() => {
    const id = getIdentity();
    return id?.faceImage ? 1 : 0;
  });
  const [monitoringActive, setMonitoringActive] = useState(false);
  const [monitoringStart, setMonitoringStart] = useState<Date | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const handleFaceComplete = useCallback((imageData: string) => {
    const current = getIdentity();
    const updated = { ...(current || { fullName: "", username: "", socialLink: "", keywords: "" }), faceImage: imageData };
    saveIdentity(updated);
    setIdentity(updated);
    setScanCount(c => c + 1);
  }, [getIdentity, saveIdentity]);

  const handleIdentitySave = useCallback((data: { fullName: string; username: string; socialLink: string; keywords: string }) => {
    const current = getIdentity();
    const updated = { ...data, faceImage: current?.faceImage || null };
    saveIdentity(updated);
    setIdentity(updated);
  }, [getIdentity, saveIdentity]);

  const handleAlertsChange = useCallback((newAlerts: AlertItem[]) => {
    setAlerts(newAlerts);
  }, []);

  const handleMonitoringChange = useCallback((active: boolean, startTime: Date | null) => {
    setMonitoringActive(active);
    setMonitoringStart(startTime);
  }, []);

  const isSetupComplete = identity?.faceImage && identity?.fullName;

  if (showHistory) {
    return <AlertHistory alerts={alerts} onBack={() => setShowHistory(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2 min-w-0">
            <Shield className="h-5 w-5 shrink-0 text-primary" />
            <h1 className="text-sm font-mono font-bold text-foreground tracking-tight truncate">E-Vara</h1>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-1 sm:gap-1.5 rounded-md border border-border bg-secondary px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-mono text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
            </button>
            <button
              onClick={() => setShowHistory(true)}
              className="inline-flex items-center gap-1 sm:gap-1.5 rounded-md border border-border bg-secondary px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-mono text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
            >
              <History className="h-3 w-3" />
              <span className="hidden sm:inline">History</span>
            </button>
            <span className="text-xs font-mono text-muted-foreground hidden lg:inline">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 sm:gap-1.5 rounded-md border border-border bg-secondary px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-mono text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
            >
              <LogOut className="h-3 w-3" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-4 sm:py-6 sm:px-6">
        <div className="mb-4 sm:mb-6">
          <StatsCards
            alertCount={alerts.length}
            scanCount={scanCount}
            monitoringActive={monitoringActive}
            monitoringStartTime={monitoringStart}
          />
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-[360px_1fr]">
          <div className="space-y-4 lg:sticky lg:top-[57px] lg:self-start">
            <FaceScan onComplete={handleFaceComplete} existingImage={identity?.faceImage || null} />
            <IdentityForm onSave={handleIdentitySave} initial={identity} />
            <ToolsPanel identity={identity} />
          </div>

          <div className="space-y-4">
            {isSetupComplete ? (
              <MonitoringFeed
                fullName={identity!.fullName}
                username={identity!.username}
                keywords={identity!.keywords || ""}
                onAlertsChange={handleAlertsChange}
                onMonitoringChange={handleMonitoringChange}
              />
            ) : (
              <div className="rounded-lg border border-border bg-card p-8 sm:p-12 text-center">
                <Shield className="mx-auto mb-4 h-8 w-8 text-muted-foreground" />
                <p className="text-xs sm:text-sm font-mono text-muted-foreground">
                  Complete identity verification and information to activate monitoring.
                </p>
              </div>
            )}

            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs font-body text-muted-foreground leading-relaxed text-center">
                E-Vara is a prototype monitoring tool designed to help users identify potential identity misuse online.
                No real web scraping occurs during this demonstration.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
