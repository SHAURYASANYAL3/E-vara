import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/landing/Navbar";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";

const TrustCenter = () => {
  const { user } = useAuth();

  const handleExportData = async () => {
    if (!user) {
      toast({ title: "Authentication required", variant: "destructive" });
      return;
    }
    toast({ title: "Export Initiated", description: "Your data is being prepared." });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-32 container mx-auto px-4">
        <h1 className="text-4xl font-black">Trust Center</h1>
        <Button onClick={handleExportData} className="mt-4">
          <Download className="mr-2 h-4 w-4" /> EXPORT MY DATA
        </Button>
      </div>
    </div>
  );
};

export default TrustCenter;