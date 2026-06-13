import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Download, ShieldCheck, Lock, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/landing/Navbar";

export const handleDataExport = async (userId: string) => {
  if (!userId) throw new Error("User ID is required for export");
  
  const { data, error } = await supabase
    .from("identity_records")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;
  
  const blob = new Blob([JSON.stringify(data || [], null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `e-vara-user-data-${userId}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const TrustCenter = () => {
  const { user } = useAuth();
  const [isExporting, setIsExporting] = useState(false);

  const onExportClick = async () => {
    if (!user) {
      toast({ title: "Authentication required", description: "Please sign in to export your data.", variant: "destructive" });
      return;
    }

    try {
      setIsExporting(true);
      toast({ title: "Export Initiated", description: "Gathering your database records..." });
      await handleDataExport(user.id);
      toast({ title: "Export Successful", description: "Your data history has been downloaded safely." });
    } catch (error: any) {
      console.error("Export error:", error);
      toast({ title: "Export Failed", description: error.message || "An error occurred during completion.", variant: "destructive" });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-32 container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b pb-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight flex items-center gap-2">
              <Shield className="h-9 w-9 text-primary" /> Trust Center
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your personal identifier privacy, data lifecycles, and consent history transparency.
            </p>
          </div>
          <Button onClick={onExportClick} disabled={isExporting} className="font-semibold shadow-md">
            <Download className="mr-2 h-4 w-4" /> {isExporting ? "Exporting..." : "EXPORT MY DATA"}
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-10">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Lock className="h-5 w-5 text-primary" /> End-to-End Encryption</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>All PII records are completely obfuscated application-side using AES-256-GCM architecture prior to database persistence.</CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Eye className="h-5 w-5 text-primary" /> Zero-Knowledge Access</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Administrative functions cannot view your clear-text raw keys. Your identifiers are decoded exclusively on your browser session.</CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> Dynamic Consent Control</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Revoke access to identity records globally at any time, instantly dropping keys and wiping active caches.</CardDescription>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-10">
          <CardHeader>
            <CardTitle>Data Lifecycle Processing Logs</CardTitle>
            <CardDescription>Auditable operational flow mapping your encrypted packets.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="p-3 bg-muted rounded-md flex justify-between">
              <span>Client Entry Verification (Cleartext Data)</span>
              <span>Inbound {"\u2192"} AES-GCM Transform Engine</span>
            </div>
            <div className="p-3 bg-muted rounded-md flex justify-between">
              <span>Secure Persistence Layer (Supabase Hex Storage)</span>
              <span>Encrypted String {"\u2192"} Encoded Table Target</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrustCenter;
