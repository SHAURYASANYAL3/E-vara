import { ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";
import { IdentitySignal, getRiskEmoji } from "@/lib/identity-analysis";

interface IdentityIntelligenceCardProps {
  signal: IdentitySignal;
}

const RISK_COLORS: Record<string, string> = {
  "High Risk":
    "border-[hsl(var(--severity-high))] bg-[hsl(var(--severity-high)/0.05)]",
  "Medium Risk":
    "border-[hsl(var(--severity-medium))] bg-[hsl(var(--severity-medium)/0.05)]",
  "Low Risk":
    "border-[hsl(var(--severity-low))] bg-[hsl(var(--severity-low)/0.05)]",
  Ignore: "border-border bg-secondary",
};

const CONFIDENCE_COLORS = {
  high: "text-[hsl(var(--severity-high))]",
  medium: "text-[hsl(var(--severity-medium))]",
  low: "text-[hsl(var(--severity-low))]",
};

function getConfidenceLevel(
  confidence: number,
): keyof typeof CONFIDENCE_COLORS {
  if (confidence >= 80) return "high";
  if (confidence >= 50) return "medium";
  return "low";
}

export const IdentityIntelligenceCard = ({
  signal,
}: IdentityIntelligenceCardProps) => {
  const [copied, setCopied] = useState(false);
  const confidenceLevel = getConfidenceLevel(signal.confidence);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(signal.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <article className={`rounded-lg border-2 p-4 ${RISK_COLORS[signal.risk]}`}>
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="min-w-0 flex items-center gap-3">
          {signal.imageUrl && (
            <img
              src={signal.imageUrl}
              alt={`${signal.platform} avatar`}
              className="h-10 w-10 rounded-full border border-border object-cover bg-secondary"
              onError={(e) => {
                // Hide if it fails to load
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              🔍 Type
            </p>
            <h4 className="truncate text-sm font-semibold text-foreground">
              {getRiskEmoji(signal.risk)} {signal.type}
            </h4>
          </div>
        </div>

        <div className="shrink-0 text-right">
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            📊 Confidence
          </p>
          <p
            className={`text-lg font-bold ${CONFIDENCE_COLORS[confidenceLevel]}`}
          >
            {signal.confidence}%
          </p>
        </div>
      </div>

      <div className="mb-3 grid gap-2 sm:grid-cols-2">
        <div className="rounded-md bg-secondary px-2 py-1.5 text-xs">
          <span className="font-mono text-muted-foreground">🌐 Platform: </span>
          <span className="font-semibold text-foreground">
            {signal.platform ?? "Unknown"}
          </span>
        </div>
        <div className="rounded-md bg-secondary px-2 py-1.5 text-xs">
          <span className="font-mono text-muted-foreground">⚠️ Risk: </span>
          <span className="font-semibold text-foreground">{signal.risk}</span>
        </div>
      </div>

      <p className="mb-2 text-xs text-muted-foreground line-clamp-2">
        {signal.snippet}
      </p>
      <p className="mb-3 rounded-md bg-secondary/50 px-2 py-2 text-xs text-foreground">
        <span className="font-semibold">🧠 Reason:</span> {signal.reason}
      </p>

      {signal.metadata && Object.keys(signal.metadata).length > 0 && (
        <div className="mb-3 space-y-1 text-[10px] font-mono text-muted-foreground">
          {signal.metadata.exactMatch && <p>✓ Exact match detected</p>}
          {signal.metadata.partialMatch && <p>✓ Partial match detected</p>}
          {typeof signal.metadata.similarityScore === "number" && (
            <p>✓ Similarity score: {signal.metadata.similarityScore}%</p>
          )}
          {signal.metadata.platformVerified && <p>✓ Platform verified</p>}
        </div>
      )}

      <div className="flex items-center gap-2">
        <a
          href={signal.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-1 rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
        >
          🔗 View Source
          <ExternalLink className="h-3.5 w-3.5" />
        </a>

        <button
          type="button"
          onClick={copyToClipboard}
          className="rounded-md border border-border bg-secondary px-2 py-2 text-muted-foreground hover:text-foreground"
          title="Copy source link"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-primary" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </article>
  );
};
