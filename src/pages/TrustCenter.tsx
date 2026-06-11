import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Database,
  Shield,
  Key,
  EyeOff,
  CheckCircle2,
  History,
  XCircle,
  Download,
  FileText,
  Trash2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/landing/Navbar";

const TrustCenter = () => {
  const handleExport = () => {
    toast({
      title: "Data Export Initiated",
      description:
        "An encrypted archive will be securely delivered within 1 hour.",
    });
  };

  const handleDelete = () => {
    toast({
      variant: "destructive",
      title: "Deletion Requested",
      description: "30-day cryptographic cooling-off period initiated.",
    });
  };

  const handleWithdrawConsent = () => {
    toast({
      variant: "destructive",
      title: "Consent Withdrawn",
      description: "Active monitoring paused. Identity OS disabled.",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navbar />
      <div className="pt-32 pb-20 container mx-auto px-4 max-w-4xl">
        <div className="mb-12 space-y-4">
          <div className="flex items-center gap-3 text-primary mb-2">
            <Shield className="h-6 w-6" />
            <span className="font-mono text-sm tracking-widest uppercase">
              E-Vara Privacy Architecture
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">
            Trust Center
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Transparency is the foundation of our Executive Identity
            Intelligence Platform. Review exactly how your data is handled and
            maintain cryptographic control.
          </p>
        </div>

        <div className="grid gap-8">
          {/* What We Collect vs Never Collect */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-border/50 bg-white/[0.02]">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <CardTitle>What We Collect</CardTitle>
                </div>
                <CardDescription>
                  Strictly operational telemetry.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 font-mono text-sm text-muted-foreground">
                <ul className="space-y-2 list-disc pl-4">
                  <li>
                    Cryptographic hashes of monitored identifiers (SHA-256)
                  </li>
                  <li>Platform usage and session analytics</li>
                  <li>Anomalous signal metadata (anonymized)</li>
                  <li>Exposure context (encrypted at rest)</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-[hsl(var(--severity-high)/0.2)] bg-[hsl(var(--severity-high)/0.02)]">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <EyeOff className="h-5 w-5 text-[hsl(var(--severity-high))]" />
                  <CardTitle>What We Never Collect</CardTitle>
                </div>
                <CardDescription>
                  We minimize storage of raw identifiers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 font-mono text-sm text-muted-foreground">
                <ul className="space-y-2 list-disc pl-4">
                  <li>Plaintext passwords or biometrics</li>
                  <li>Contents of private communications</li>
                  <li>Browsing history outside of threat intelligence</li>
                  <li>Raw financial transaction data</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Actionable Controls */}
          <Card className="border-border/50 bg-black/40">
            <CardHeader>
              <CardTitle>Data Sovereignty Controls</CardTitle>
              <CardDescription>
                Execute your rights under GDPR and CCPA directly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-border/50">
                <div>
                  <p className="font-medium text-sm">Export My Data</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Download a cryptographic archive of your metadata.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  className="font-mono text-xs"
                >
                  <Download className="h-3 w-3 mr-2" />
                  EXPORT
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-border/50">
                <div>
                  <p className="font-medium text-sm">Withdraw Consent</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Pause active monitoring and OSINT gathering.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleWithdrawConsent}
                  className="font-mono text-xs border-amber-500/50 text-amber-500 hover:bg-amber-500/10 hover:text-amber-400"
                >
                  WITHDRAW
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-red-500/20 bg-red-500/5">
                <div>
                  <p className="font-medium text-sm text-red-500">
                    Delete My Identity
                  </p>
                  <p className="text-xs text-red-500/70 mt-1">
                    Permanently scrub all stored data and baseline models.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  className="font-mono text-xs"
                >
                  <XCircle className="h-3 w-3 mr-2" />
                  DELETE
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Data Lifecycle */}
          <Card className="border-border/50 bg-black/40">
            <CardHeader>
              <CardTitle>Data Lifecycle</CardTitle>
              <CardDescription>
                Collected → Processed → Retained → Deleted
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border/50 overflow-hidden">
                <table className="w-full text-sm text-left font-mono">
                  <thead className="bg-white/[0.02] border-b border-border/50 text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-medium">Data</th>
                      <th className="px-4 py-3 font-medium">Retention</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr className="hover:bg-white/[0.01]">
                      <td className="px-4 py-3">Device Metadata</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        90 days
                      </td>
                    </tr>
                    <tr className="hover:bg-white/[0.01]">
                      <td className="px-4 py-3">Risk Snapshots</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        30 days
                      </td>
                    </tr>
                    <tr className="hover:bg-white/[0.01]">
                      <td className="px-4 py-3">Events</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        180 days
                      </td>
                    </tr>
                    <tr className="hover:bg-white/[0.01]">
                      <td className="px-4 py-3">Queue Logs</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        7 days
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Consent History */}
          <Card className="border-border/50 bg-black/40">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-4 w-4" /> Consent History
                  </CardTitle>
                  <CardDescription>
                    Immutable log of your privacy agreements.
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  <FileText className="h-4 w-4 mr-2" /> View Full Log
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    date: "2026-06-11",
                    action: "Accepted Terms of Service v2.4",
                  },
                  {
                    date: "2026-06-11",
                    action: "Granted Exposure Intelligence scan permission",
                  },
                  { date: "2026-06-10", action: "Initial Account Creation" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-2 border-b border-border/50 last:border-0 font-mono text-sm"
                  >
                    <span className="text-muted-foreground">{item.date}</span>
                    <span className="text-right">{item.action}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TrustCenter;
