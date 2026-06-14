import { useCallback, useRef, useState } from "react";
import {
  ShieldCheck,
  ShieldX,
  AlertTriangle,
  HelpCircle,
  Upload,
  Loader2,
  ExternalLink,
  RotateCcw,
  FileText,
  Lock,
  X,
} from "lucide-react";
import {
  useVirusTotalScan,
  VERDICT_CONFIG,
  ScanVerdict,
} from "@/hooks/useVirusTotalScan";

// ── Constants ─────────────────────────────────────────────────────────────────
const MAX_FILE_SIZE_MB = 650;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function VerdictIcon({
  verdict,
  size = 20,
}: {
  verdict: ScanVerdict;
  size?: number;
}) {
  const props = { size, style: { color: VERDICT_CONFIG[verdict].color } };
  switch (verdict) {
    case "clean":
      return <ShieldCheck {...props} />;
    case "malicious":
      return <ShieldX {...props} />;
    case "suspicious":
      return <AlertTriangle {...props} />;
    default:
      return <HelpCircle {...props} />;
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
const FileScanner = () => {
  const { status, result, error, scanFile, reset } = useVirusTotalScan();
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setFileError(null);
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setFileError(`File too large. Maximum size is ${MAX_FILE_SIZE_MB} MB.`);
        return;
      }
      setPendingFile(file);
      await scanFile(file);
    },
    [scanFile],
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      // Reset input so the same file can be re-selected after a reset
      e.target.value = "";
    },
    [handleFile],
  );

  const handleReset = () => {
    reset();
    setPendingFile(null);
    setFileError(null);
  };

  const isScanning = status === "hashing" || status === "scanning";

  // ── Status label ────────────────────────────────────────────────────────────
  const statusLabel =
    status === "hashing"
      ? "Computing SHA-256 hash…"
      : status === "scanning"
        ? "Querying VirusTotal database…"
        : null;

  return (
    <div
      id="file-scanner-panel"
      className="rounded-xl border border-[#244163] bg-[#0a1224] p-5 space-y-4 animate-fade-in"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-[#00e5ff]" />
          <h3 className="text-sm font-mono font-semibold text-[#b7f8ff] uppercase tracking-wider">
            File Threat Scanner
          </h3>
        </div>
        {(status === "done" || status === "error") && (
          <button
            id="file-scanner-reset-btn"
            onClick={handleReset}
            className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground hover:text-[#00e5ff] transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            Scan another
          </button>
        )}
      </div>

      <p className="text-[11px] font-body text-muted-foreground leading-relaxed">
        Drop any file to check its{" "}
        <span className="text-[#b7f8ff] font-mono">SHA-256</span> hash against
        70+ antivirus engines via VirusTotal.{" "}
        <span className="text-[#00e5ff]/70">
          The file never leaves your device.
        </span>
      </p>

      {/* Drop Zone — hide when done */}
      {status !== "done" && (
        <div
          id="file-scanner-dropzone"
          role="button"
          tabIndex={0}
          aria-label="Drop a file to scan or click to browse"
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => !isScanning && inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
          className={[
            "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-8 text-center cursor-pointer transition-all duration-200 select-none",
            dragOver
              ? "border-[#00e5ff] bg-[#00e5ff]/5 scale-[1.01]"
              : isScanning
                ? "border-[#244163] bg-[#0d1b30] cursor-not-allowed"
                : "border-[#244163] bg-[#0d1b30] hover:border-[#3da4ff]/60 hover:bg-[#0d1b30]/80",
          ].join(" ")}
        >
          <input
            ref={inputRef}
            type="file"
            id="file-scanner-input"
            className="sr-only"
            onChange={onInputChange}
            disabled={isScanning}
            aria-label="Select file to scan"
          />

          {isScanning ? (
            <>
              <Loader2 className="h-8 w-8 text-[#00e5ff] animate-spin mb-3" />
              <p className="text-xs font-mono text-[#00e5ff] animate-pulse">
                {statusLabel}
              </p>
              {pendingFile && (
                <p className="mt-1 text-[10px] font-mono text-muted-foreground truncate max-w-[200px]">
                  {pendingFile.name}
                </p>
              )}
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-[#3da4ff]/60 mb-3" />
              <p className="text-xs font-mono text-[#b7f8ff]">
                Drop a file or{" "}
                <span className="text-[#00e5ff] underline underline-offset-2">
                  click to browse
                </span>
              </p>
              <p className="mt-1 text-[10px] font-mono text-muted-foreground">
                Max {MAX_FILE_SIZE_MB} MB · Any file type
              </p>
            </>
          )}
        </div>
      )}

      {/* File size error */}
      {fileError && (
        <div className="flex items-center gap-2 rounded-md border border-[hsl(var(--severity-high)/0.3)] bg-[hsl(var(--severity-high)/0.08)] px-3 py-2">
          <X className="h-3.5 w-3.5 shrink-0 text-[hsl(var(--severity-high))]" />
          <p className="text-[11px] font-mono text-[hsl(var(--severity-high))]">
            {fileError}
          </p>
        </div>
      )}

      {/* Edge-function / network error */}
      {status === "error" && error && (
        <div className="flex items-center gap-2 rounded-md border border-[hsl(var(--severity-high)/0.3)] bg-[hsl(var(--severity-high)/0.08)] px-3 py-2">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-[hsl(var(--severity-high))]" />
          <p className="text-[11px] font-mono text-[hsl(var(--severity-high))]">
            {error === "ERR_RATE_LIMIT_EXCEEDED"
              ? "Rate limit reached. Please wait a minute before scanning again."
              : error === "ERR_VT_KEY_NOT_CONFIGURED"
                ? "VirusTotal API key not configured. Contact the administrator."
                : `Scan failed: ${error}`}
          </p>
        </div>
      )}

      {/* ── Result Card ──────────────────────────────────────────────────────── */}
      {status === "done" &&
        result &&
        (() => {
          const cfg = VERDICT_CONFIG[result.verdict as ScanVerdict];
          return (
            <div
              id="file-scanner-result-card"
              className="rounded-lg border p-4 space-y-4 transition-all animate-fade-in"
              style={{
                borderColor: cfg.borderColor,
                backgroundColor: cfg.bgColor,
              }}
            >
              {/* Verdict header */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <VerdictIcon
                    verdict={result.verdict as ScanVerdict}
                    size={22}
                  />
                  <div>
                    <p
                      className="text-base font-mono font-bold"
                      style={{ color: cfg.color }}
                    >
                      {cfg.label}
                    </p>
                    <p className="text-[10px] font-mono text-muted-foreground">
                      {result.cached
                        ? "Result from cache"
                        : "Live VirusTotal lookup"}
                    </p>
                  </div>
                </div>
                {result.vt_link && (
                  <a
                    href={result.vt_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    id="file-scanner-vt-link"
                    className="flex items-center gap-1 text-[10px] font-mono text-[#00e5ff] hover:text-[#3da4ff] transition-colors"
                  >
                    View on VT
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                )}
              </div>

              {/* Engine stats */}
              {result.total_engines > 0 && (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      {
                        label: "Malicious",
                        value: result.malicious,
                        color: "hsl(var(--severity-high))",
                      },
                      {
                        label: "Suspicious",
                        value: result.suspicious,
                        color: "hsl(var(--severity-medium))",
                      },
                      {
                        label: "Clean",
                        value: result.undetected,
                        color: "hsl(var(--severity-low))",
                      },
                    ].map(({ label, value, color }) => (
                      <div
                        key={label}
                        className="rounded-md border border-[#244163] bg-[#0a1224] py-2 text-center"
                      >
                        <p
                          className="text-lg font-mono font-bold"
                          style={{ color }}
                        >
                          {value}
                        </p>
                        <p className="text-[9px] font-mono text-muted-foreground uppercase">
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-mono text-muted-foreground">
                      <span>Engine Coverage</span>
                      <span>{result.total_engines} engines</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-[#244163] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${(result.malicious / result.total_engines) * 100}%`,
                          backgroundColor: "hsl(var(--severity-high))",
                        }}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* File metadata */}
              <div className="rounded-md border border-[#1e3350] bg-[#0d1b30] p-3 space-y-1.5">
                <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
                  <FileText className="h-3 w-3 shrink-0" />
                  <span className="truncate text-[#b7f8ff]">
                    {result.file_name}
                  </span>
                  <span className="shrink-0 ml-auto">
                    {formatBytes(result.file_size)}
                  </span>
                </div>
                <p className="text-[9px] font-mono text-muted-foreground break-all">
                  SHA-256: {result.sha256_hash}
                </p>
                <p className="text-[9px] font-mono text-muted-foreground">
                  Scanned: {new Date(result.scanned_at).toLocaleString()}
                </p>
              </div>

              {/* Warning for malicious/suspicious */}
              {(result.verdict === "malicious" ||
                result.verdict === "suspicious") && (
                <div className="flex gap-2 rounded-md border border-[hsl(var(--severity-high)/0.3)] bg-[hsl(var(--severity-high)/0.07)] px-3 py-2.5">
                  <ShieldX className="h-3.5 w-3.5 shrink-0 mt-0.5 text-[hsl(var(--severity-high))]" />
                  <p className="text-[10px] font-mono text-[hsl(var(--severity-high))] leading-relaxed">
                    {result.verdict === "malicious"
                      ? "This file has been flagged as malicious by multiple antivirus engines. Do NOT execute or open it."
                      : "This file was flagged as suspicious by at least one engine. Exercise caution."}
                  </p>
                </div>
              )}

              {/* Unknown verdict explanation */}
              {result.verdict === "unknown" && (
                <p className="text-[10px] font-mono text-muted-foreground text-center">
                  This file is not yet in the VirusTotal database. It may be new
                  or very rare. This does <em>not</em> mean it is safe.
                </p>
              )}
            </div>
          );
        })()}

      {/* Privacy notice */}
      <p className="text-[9px] font-mono text-muted-foreground/60 text-center">
        🔒 Only the SHA-256 hash is transmitted. Your file bytes never leave
        your device.
      </p>
    </div>
  );
};

export default FileScanner;
