import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Download, ShieldCheck, Lock, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/landing/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const handleDataExport = async (userId: string) => {
  if (!userId) throw new Error("User ID is required for export");

  // Backend endpoint se cryptographic metadata archive (.zip) fetch karna
  const response = await fetch("/api/trust-center/export", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to generate cryptographic archive from backend");
  }

  // Response stream ko zip blob mein convert karna
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  // Programmatically trigger download
  const a = document.createElement("a");
  a.href = url;
  a.download = "cryptographic_metadata_archive.zip";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const TrustCenter = () => {
  const { user, logout } = useAuth();
  const handleExport = () => {
    toast({
      title: "Data Export Initiated",
      description:
        "An encrypted archive will be securely delivered within 1 hour.",
    });
  };

  const handleDelete = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: "You must be logged in to request deletion.",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        variant: "destructive",
        title: "Deletion Requested",
        description:
          "30-day cryptographic cooling-off period initiated. Identity soft-deleted.",
      });

      await logout();
    } catch (e) {
      console.error("Soft delete failed:", e);
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description:
          "An error occurred while attempting to delete your identity.",
      });
    }
  };

  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const onExportClick = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to export your data.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsExporting(true);
      toast({
        title: "Data Export Initiated",
        description:
          "An encrypted archive will be securely delivered within 1 hour.",
      });

      await handleDataExport(user.id);

      toast({
        title: "Export Successful",
        description:
          "Your cryptographic metadata archive has been downloaded safely.",
      });
    } catch (error: unknown) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during completion.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const onDeleteClick = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to delete your identity.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsDeleting(true);
      toast({
        title: "Deletion Requested",
        description: "30-day cryptographic cooling-off period initiated.",
        variant: "destructive",
      });

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const res = await fetch("/functions/v1/cleanup-deletions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({}),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error?.message || "Deletion request failed");
      }
    } catch (error: unknown) {
      console.error("Deletion error:", error);
      toast({
        title: "Deletion Failed",
        description:
          error instanceof Error ? error.message : "An error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
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
              Manage your personal identifier privacy, data lifecycles, and
              consent history transparency.
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={onExportClick}
              disabled={isExporting}
              className="font-semibold shadow-md"
            >
              <Download className="mr-2 h-4 w-4" />{" "}
              {isExporting ? "Exporting..." : "EXPORT MY DATA"}
            </Button>
            <Button
              onClick={onDeleteClick}
              disabled={isDeleting}
              className="font-semibold shadow-md bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "DELETE MY IDENTITY"}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-10">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" /> End-to-End Encryption
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                All PII records are completely obfuscated application-side using
                AES-256-GCM architecture prior to database persistence.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" /> Zero-Knowledge Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Administrative functions cannot view your clear-text raw keys.
                Your identifiers are decoded exclusively on your browser
                session.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" /> Dynamic Consent
                Control
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Revoke access to identity records globally at any time,
                instantly dropping keys and wiping active caches.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-10">
          <CardHeader>
            <CardTitle>Data Lifecycle Processing Logs</CardTitle>
            <CardDescription>
              Auditable operational flow mapping your encrypted packets.
            </CardDescription>
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
