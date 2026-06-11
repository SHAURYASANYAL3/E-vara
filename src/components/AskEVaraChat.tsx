import { MessageSquare, Send } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const presets = ["Where am I most exposed?", "How can I reduce my risk?"];

const responses: Record<string, string> = {
  "Where am I most exposed?":
    "You're most exposed on Instagram and Reddit where username correlation and profile metadata overlap with breach records.",
  "How can I reduce my risk?":
    "Rotate reused emails, hide public contact metadata, and separate usernames between social and developer platforms.",
};

const AskEVaraChat = () => {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState(presets[0]);
  const [displayed, setDisplayed] = useState("");

  const answer = useMemo(
    () =>
      responses[prompt] ??
      "I can provide exposure guidance from your active telemetry.",
    [prompt],
  );

  useEffect(() => {
    if (!open) return;
    setDisplayed("");
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setDisplayed(answer.slice(0, i));
      if (i >= answer.length) window.clearInterval(id);
    }, 18);
    return () => window.clearInterval(id);
  }, [answer, open]);

  return (
    <div className="fixed bottom-5 right-5 z-30">
      {open && (
        <div className="neon-panel mb-3 w-[320px] rounded-xl border border-primary/25 p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-mono font-semibold text-foreground">
              Ask E-Vara
            </p>
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          </div>
          <div className="mb-2 flex flex-wrap gap-1.5">
            {presets.map((item) => (
              <button
                key={item}
                onClick={() => setPrompt(item)}
                className="rounded border border-border px-2 py-1 text-[10px] font-mono text-muted-foreground hover:text-foreground"
              >
                {item}
              </button>
            ))}
          </div>
          <p className="min-h-16 rounded-md border border-border/70 bg-secondary/35 p-2 text-xs text-muted-foreground">
            {displayed}
          </p>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="neon-button flex items-center gap-2 rounded-full border border-primary/30 bg-card/80 px-4 py-2 text-xs font-mono text-primary"
      >
        <MessageSquare className="h-3.5 w-3.5" /> Ask E-Vara{" "}
        <Send className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export default AskEVaraChat;
