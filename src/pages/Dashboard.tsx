import { useState, useCallback, useMemo, useEffect } from "react";
import {
  Shield,
  LogOut,
  History,
  LayoutDashboard,
  Database,
  Activity,
  CreditCard,
} from "lucide-react";
import { useAuth, IdentityInfo } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import FaceScan from "@/components/FaceScan";
import IdentityForm, { IdentityData } from "@/components/IdentityForm";
import ToolsPanel from "@/components/ToolsPanel";
import { SearchResultsIntelligence } from "@/components/SearchResultsIntelligence";
import AlertHistory from "@/pages/AlertHistory";
import FuturisticThreatConsole from "@/components/FuturisticThreatConsole";
import CyberDashboardLoader from "@/components/CyberDashboardLoader";
import { ThreatMonitorList } from "@/components/ThreatMonitorList";
import ConnectivityStatus from "@/components/ConnectivityStatus";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import DigitalFootprintMap from "@/components/DigitalFootprintMap";
import AttackSimulationPanel from "@/components/AttackSimulationPanel";
import AIInsightPanel from "@/components/AIInsightPanel";
import NetworkTraffic from "@/components/NetworkTraffic";
import EnterpriseSLAMonitor from "@/components/EnterpriseSLAMonitor";

const Dashboard = ({ onLogout }: { onLogout: () => void }) => {
  const { user, profile, identity, logout, saveIdentity } = useAuth();
  const [showHistory, setShowHistory] = useState(false);
  const [booting, setBooting] = useState(true);

  const nodeId = profile?.node_id_stable || "INITIALIZING...";

  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const handleFaceComplete = useCallback(
    (imageData: string) => {
      if (!identity) return;
      saveIdentity({ ...identity, faceImage: imageData });
    },
    [identity, saveIdentity],
  );

  const handleIdentitySave = useCallback(
    (data: IdentityData) => {
      saveIdentity({
        ...data,
        email: data.email,
        faceImage: identity?.faceImage || null,
      });
    },
    [identity, saveIdentity],
  );

  if (booting) return <CyberDashboardLoader />;

  if (showHistory) {
    return <AlertHistory alerts={[]} onBack={() => setShowHistory(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#050810] text-foreground selection:bg-primary/30 relative overflow-hidden">
      <div className="scanline" />
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-md">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-black tracking-[0.3em] uppercase">
                E-Vara
              </h1>
              <p className="text-[9px] text-muted-foreground uppercase tracking-widest">
                Personal Defense OS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-4">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                Auth Session
              </span>
              <span className="text-xs font-mono text-primary/80">
                {user?.email}
              </span>
            </div>

            <div className="hidden lg:flex flex-col items-end mr-4 border-l border-border/40 pl-4">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
                Kernel v2.5.0-HARDENED
              </span>
              <span className="text-[9px] font-mono text-primary/50 uppercase">
                ID: {(nodeId || "").substring(0, 15)}...
              </span>
            </div>

            <div className="flex gap-2">
              <Badge
                variant="outline"
                className="mr-1 uppercase font-bold text-[9px] border-primary/40 text-primary px-3"
              >
                {profile?.tier || "TACTICAL"}_TIER
              </Badge>
              <Badge
                variant="outline"
                className={`mr-2 uppercase font-bold text-[9px] px-3 ${profile?.security_clearance === "TOP_SECRET" ? "border-destructive text-destructive" : "border-muted-foreground text-muted-foreground"}`}
              >
                {profile?.security_clearance || "UNCLASSIFIED"}
              </Badge>
              <Link to="/billing">
                <button className="p-2 rounded-md border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-all">
                  <CreditCard className="h-4 w-4" />
                </button>
              </Link>
              <button
                onClick={() => setShowHistory(true)}
                className="p-2 rounded-md border border-border/50 bg-secondary/30 hover:bg-secondary/50 transition-all"
              >
                <History className="h-4 w-4" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 rounded-md border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <aside className="space-y-6">
            <section className="space-y-6 lg:sticky lg:top-24">
              <ConnectivityStatus />
              <FaceScan
                onComplete={handleFaceComplete}
                existingImage={identity?.faceImage || null}
              />
              <IdentityForm onSave={handleIdentitySave} initial={identity} />
              <ToolsPanel identity={identity} />
            </section>
          </aside>

          <div className="space-y-8">
            <FuturisticThreatConsole alertCount={0} />
            <Tabs defaultValue="findings" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList className="bg-secondary/30 border border-border/50 p-1">
                  <TabsTrigger
                    value="findings"
                    className="gap-2 text-[10px] uppercase font-bold tracking-widest"
                  >
                    <Activity className="h-3 w-3" /> Findings
                  </TabsTrigger>
                  <TabsTrigger
                    value="intelligence"
                    className="gap-2 text-[10px] uppercase font-bold tracking-widest"
                  >
                    <Database className="h-3 w-3" /> OSINT
                  </TabsTrigger>
                  <TabsTrigger
                    value="dashboard"
                    className="gap-2 text-[10px] uppercase font-bold tracking-widest"
                  >
                    <LayoutDashboard className="h-3 w-3" /> Overview
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent
                value="findings"
                className="mt-0 focus-visible:ring-0"
              >
                <ThreatMonitorList />
              </TabsContent>

              <TabsContent
                value="intelligence"
                className="mt-0 focus-visible:ring-0 space-y-6"
              >
                <SearchResultsIntelligence
                  fullName={identity?.fullName || ""}
                  username={identity?.username || ""}
                />
              </TabsContent>

              <TabsContent
                value="dashboard"
                className="mt-0 focus-visible:ring-0 space-y-6"
              >
                <EnterpriseSLAMonitor />
                <div className="grid gap-6 md:grid-cols-2">
                  <DigitalFootprintMap
                    username={identity?.username || "identity"}
                  />
                  <AttackSimulationPanel
                    email={identity?.email || "classified"}
                  />
                </div>
                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <NetworkTraffic />
                  </div>
                  <AIInsightPanel score={65} alertCount={0} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
