import { Shield, Radar, Fingerprint, SearchCode, Database } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
const ThreatDetectionPage = () => {
  useSEO({
    title: "Threat Detection Engine",
    description:
      "Deep dive into E-VARA's autonomous OSINT and Dark Web threat detection capabilities.",
    canonicalUrl: "https://e-vara.vercel.app/threat-detection",
  });

  const capabilities = [
    {
      icon: <Radar className="h-5 w-5 text-primary" />,
      title: "Continuous OSINT Sweeps",
      desc: "Our engine autonomously aggregates data from public pastes, exposed cloud buckets, and misconfigured databases.",
    },
    {
      icon: <SearchCode className="h-5 w-5 text-primary" />,
      title: "Darknet Market Indexing",
      desc: "We autonomously monitor underground forums and illicit marketplaces for mentions of your executive identifiers.",
    },
    {
      icon: <Fingerprint className="h-5 w-5 text-primary" />,
      title: "Cryptographic Anonymity",
      desc: "Identities are hashed (SHA-256) client-side. The engine only searches for cryptographic signatures, ensuring zero PII leakage.",
    },
    {
      icon: <Database className="h-5 w-5 text-primary" />,
      title: "Historical Breach Analysis",
      desc: "Cross-referencing new findings against a proprietary index of billions of historical credential leaks.",
    },
  ];
  const [copied, setCopied] = useState(false);
  const codeSnippet = `// E-VARA Detection Protocol
async function scanPerimeter(targetHash: string) {
  logger.info("Initializing vector sweep...");

  const sources = [
    await ingestDarknetFeeds(),
    await parsePublicBuckets(),
    await crossRefBreachData()
  ];

  const exposure = analyzeEntropy(sources, targetHash);

  if (exposure.severity >= SEVERITY.HIGH) {
    await triggerExecutiveAlert(exposure);
    await generateForensicPDF(exposure);
  }

  return exposure.status;
}`;
  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeSnippet);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  return (
    <div className="min-h-screen bg-[#050608] text-white selection:bg-primary/30 font-mono">
      <nav className="h-20 border-b border-white/5 bg-[#050608]/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto h-full px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg shadow-[0_0_15px_rgba(255,106,26,0.3)]">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight uppercase">
              E-VARA
            </span>
          </Link>
          <div className="flex gap-4">
            <Link to="/pricing">
              <Button
                variant="ghost"
                className="text-[10px] uppercase font-bold tracking-widest hover:bg-white/5"
              >
                Pricing
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-[14px] px-6 text-[10px] font-bold uppercase tracking-widest security-orange-glow">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
              Core Capabilities
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase mb-6 leading-none">
              The Engine <br />
              <span className="text-muted-foreground">Under The Hood</span>
            </h1>
            <p className="text-muted-foreground font-body text-lg leading-relaxed mb-8">
              Threat actors do not operate on a 9-to-5 schedule. Neither do we.
              The E-VARA detection engine operates continuously, scanning the
              perimeter of the public and deep web for your designated assets.
            </p>

            <div className="space-y-6">
              {capabilities.map((cap, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 shrink-0 p-2 bg-white/5 border border-white/10 rounded-lg">
                    {cap.icon}
                  </div>
                  <div>
                    <h4 className="font-bold uppercase tracking-widest text-sm mb-1">
                      {cap.title}
                    </h4>
                    <p className="text-xs font-body text-muted-foreground leading-relaxed">
                      {cap.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent blur-3xl rounded-full opacity-50" />
            <div className="relative rounded-[24px] border border-white/10 bg-[#0A0C12] p-8 shadow-2xl">
              <button
                onClick={handleCopy}
                className="absolute top-4 right-4 p-2 rounded-md bg-white/5 hover:bg-white/10"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
              <pre className="text-[10px] sm:text-xs text-muted-foreground overflow-x-auto">
                <code className="language-typescript">
                  {`// E-VARA Detection Protocol
async function scanPerimeter(targetHash: string) {
  logger.info("Initializing vector sweep...");
  
  const sources = [
    await ingestDarknetFeeds(),
    await parsePublicBuckets(),
    await crossRefBreachData()
  ];

  const exposure = analyzeEntropy(sources, targetHash);
  
  if (exposure.severity >= SEVERITY.HIGH) {
    await triggerExecutiveAlert(exposure);
    await generateForensicPDF(exposure);
  }

  return exposure.status;
}`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Content Cluster / Security Insights */}
      <div className="container mx-auto px-6 pb-24">
        <div className="max-w-4xl mx-auto space-y-16 border-t border-white/5 pt-20 mt-16">
          <div className="space-y-4">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">
              Deep Web Threat Intelligence & Monitoring
            </h2>
            <p className="text-muted-foreground font-body leading-relaxed">
              True digital defense extends beyond the corporate perimeter. Our
              deep web threat intelligence continuously scours underground
              forums, illicit marketplaces, and unindexed data dumps. By
              leveraging autonomous OSINT sweeps, E-VARA acts as a proactive
              early warning system, identifying exposed enterprise credentials
              and executive personal data before they can be weaponized in
              targeted phishing or ransomware attacks.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">
              Credential Stuffing Defense & Account Takeover Prevention
            </h2>
            <p className="text-muted-foreground font-body leading-relaxed">
              When third-party vendors suffer data breaches, the resulting
              credential leakage often fuels devastating credential stuffing and
              account takeover (ATO) attacks against your critical
              infrastructure. E-VARA's historical breach analysis correlates
              billions of leaked records in real-time, allowing security teams
              to enforce immediate password resets and zero-trust verification
              the moment an executive's data is exposed in the wild.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">
              Identity Access Management (IAM) Security Posture
            </h2>
            <p className="text-muted-foreground font-body leading-relaxed">
              MFA is no longer enough to stop sophisticated threat actors. To
              maintain a resilient Identity Access Management (IAM) security
              posture, organizations must integrate continuous identity threat
              detection. E-VARA's cryptographic anonymity guarantees that while
              we relentlessly pursue leaked data signatures, your actual PII
              remains entirely invisible and mathematically secured via
              zero-knowledge proofs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreatDetectionPage;
