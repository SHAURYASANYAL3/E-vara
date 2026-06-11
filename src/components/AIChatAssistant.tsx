import { useEffect, useMemo, useState } from "react";
import { Bot, MessageSquare, X } from "lucide-react";

const PRESETS = ["Where am I most exposed?", "How can I reduce my risk?"];

const RESPONSES: Record<string, string> = {
  "Where am I most exposed?":
    "Your highest exposure is from reused identifiers across GitHub, Instagram, and legacy breach records. Prioritize alias separation and profile privacy hardening.",
  "How can I reduce my risk?":
    "Start with unique emails per platform, rotate weak credentials, enable MFA everywhere, and remove old public profile metadata linking accounts.",
};

export const AIChatAssistant = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; text: string }[]
  >([]);
  const [typing, setTyping] = useState(false);

  const headerDot = useMemo(
    () => (open ? "bg-[hsl(var(--severity-low))]" : "bg-primary"),
    [open],
  );

  const ask = (question: string) => {
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setTyping(true);
    const reply =
      RESPONSES[question] ||
      "I can provide a focused risk summary based on your monitoring telemetry.";
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
      setTyping(false);
    }, 900);
  };

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          text: "I am E-Vara AI. Ask me about exposure paths or mitigation steps.",
        },
      ]);
    }
  }, [open, messages.length]);

  return (
    <div className="fixed bottom-4 right-4 z-30">
      {open && (
        <div className="mb-3 w-[320px] rounded-xl border border-primary/35 bg-card/80 p-3 backdrop-blur-md neon-panel">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-primary" />
              <p className="text-xs font-semibold text-foreground">
                Ask E-Vara
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
            {messages.map((m, idx) => (
              <div
                key={`${m.role}-${idx}`}
                className={`rounded-md px-2 py-1.5 text-xs ${m.role === "assistant" ? "bg-secondary/60 text-foreground" : "ml-6 bg-primary/20 text-primary"}`}
              >
                {m.text}
              </div>
            ))}
            {typing && (
              <div className="rounded-md bg-secondary/60 px-2 py-1.5 text-xs text-muted-foreground">
                E-Vara AI is typing...
              </div>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {PRESETS.map((preset) => (
              <button
                disabled={typing}
                key={preset}
                onClick={() => ask(preset)}
                className="rounded-md border border-border px-2 py-1 text-[11px] text-muted-foreground hover:border-primary/40 hover:text-foreground disabled:opacity-50"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="neon-button inline-flex items-center gap-2 rounded-full border border-primary/40 bg-card/80 px-4 py-2 text-xs font-semibold text-foreground backdrop-blur-md"
      >
        <span className={`h-2 w-2 animate-pulse rounded-full ${headerDot}`} />
        <MessageSquare className="h-4 w-4 text-primary" /> Ask E-Vara
      </button>
    </div>
  );
};
