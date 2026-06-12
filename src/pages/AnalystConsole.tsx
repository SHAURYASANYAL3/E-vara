import { useState } from "react";
import { Shield, ShieldAlert, CheckCircle, FileDown, AlertTriangle, XCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { useSEO } from "@/hooks/useSEO";

const dummyThreats = [
  { id: "T-892", type: "Deepfake Video (Voice Clone)", target: "CEO", platform: "Telegram (Dark Channel)", status: "pending", date: "2026-06-12", severity: "Critical" },
  { id: "T-891", type: "Credential Leak (PII)", target: "CFO", platform: "BreachForums", status: "pending", date: "2026-06-11", severity: "High" },
  { id: "T-890", type: "Impersonation Account", target: "Founder", platform: "X/Twitter", status: "verified", date: "2026-06-10", severity: "Medium" }
];

export default function AnalystConsole() {
  useSEO({
    title: "Internal Analyst SOC",
    description: "E-VARA internal Security Operations Center",
  });

  const [threats, setThreats] = useState(dummyThreats);

  const verifyThreat = (id: string) => {
    setThreats(threats.map(t => t.id === id ? { ...t, status: "verified" } : t));
    toast.success("Threat marked as Verified. Pushed to Client Dashboard.");
  };

  const markFalsePositive = (id: string) => {
    setThreats(threats.filter(t => t.id !== id));
    toast.info("Threat dismissed as False Positive. Erased from DB.");
  };

  const generateDMCA = (threat: typeof dummyThreats[0]) => {
    const doc = new jsPDF();
    
    // Branding
    doc.setFillColor(5, 6, 8); // Dark bg
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 106, 26); // E-VARA Orange
    doc.setFontSize(24);
    doc.text("E-VARA LEGAL OPERATIONS", 20, 25);

    // Document Body
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text("FORMAL NOTICE OF LEGAL INFRINGEMENT", 20, 60);
    
    doc.setFontSize(11);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 75);
    doc.text(`Threat ID: ${threat.id}`, 20, 82);
    doc.text(`Infringement Type: ${threat.type}`, 20, 89);
    doc.text(`Target Platform: ${threat.platform}`, 20, 96);
    doc.text(`Severity: ${threat.severity}`, 20, 103);
    
    doc.text("To the Abuse/Legal Department of the Hosting Provider:", 20, 120);
    doc.text("I am writing on behalf of my client to officially notify you of an unauthorized and", 20, 130);
    doc.text("malicious use of their likeness, identity, or proprietary data on your platform.", 20, 137);
    
    doc.text("Under the Digital Millennium Copyright Act (17 U.S.C. § 512), and applicable privacy", 20, 150);
    doc.text("laws, we demand the immediate and permanent removal of the offending material.", 20, 157);
    
    doc.text("I have a good faith belief that the use of the material in the manner complained of", 20, 170);
    doc.text("is not authorized by the intellectual property owner, its agent, or the law.", 20, 177);
    
    doc.text("Failure to comply within 24 hours will result in immediate injunctive relief.", 20, 190);
    
    doc.setFontSize(12);
    doc.text("Signed,", 20, 210);
    doc.text("E-VARA Threat Intelligence & Legal Team", 20, 217);

    doc.save(`E-VARA-Takedown-${threat.id}.pdf`);
    toast.success("Automated Legal Notice Generated!");
  };

  return (
    <div className="min-h-screen bg-[#050608] text-white font-mono p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-widest text-[#007AFF] flex items-center gap-3">
              <ShieldAlert className="h-8 w-8" />
              Human-in-the-Loop SOC
            </h1>
            <p className="text-white/50 text-sm mt-2">Zero False Positives Queue - Internal Analyst Portal</p>
          </div>
          <div className="px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <span className="h-2 w-2 bg-primary rounded-full animate-pulse"></span>
            {threats.filter(t => t.status === 'pending').length} Threats Pending Review
          </div>
        </div>

        <div className="grid gap-4">
          {threats.map(threat => (
            <div key={threat.id} className="bg-white/[0.02] border border-white/5 p-6 rounded-xl flex items-center justify-between transition-all hover:bg-white/[0.04]">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-center w-24">
                  <span className="text-xs text-white/50 block mb-1">ID</span>
                  <span className="font-bold text-white tracking-widest">{threat.id}</span>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                    {threat.type}
                    {threat.status === 'verified' && <CheckCircle className="h-4 w-4 text-green-500" />}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    <span className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> {threat.target}</span>
                    <span>|</span>
                    <span>{threat.platform}</span>
                    <span>|</span>
                    <span className={threat.severity === 'Critical' ? 'text-red-400' : 'text-yellow-400'}>{threat.severity}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {threat.status === 'pending' ? (
                  <>
                    <Button 
                      onClick={() => markFalsePositive(threat.id)}
                      variant="ghost" 
                      className="text-white/50 hover:text-white hover:bg-white/10"
                    >
                      <XCircle className="h-4 w-4 mr-2" /> False Positive
                    </Button>
                    <Button 
                      onClick={() => verifyThreat(threat.id)}
                      className="bg-[#007AFF] hover:bg-[#007AFF]/80 text-white"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" /> Verify Threat
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={() => generateDMCA(threat)}
                    className="bg-primary hover:bg-primary/80 text-white shadow-[0_0_15px_rgba(255,106,26,0.3)]"
                  >
                    <FileDown className="h-4 w-4 mr-2" /> Generate Takedown PDF
                  </Button>
                )}
              </div>
            </div>
          ))}
          {threats.length === 0 && (
            <div className="text-center py-20 text-white/30">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Queue is empty. No active threats.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
