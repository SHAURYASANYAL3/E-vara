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

  const ask = async (questionText: string) => {
    if (!questionText.trim()) return;

    const newMessages = [...messages, { role: "user" as const, text: questionText }];
    setMessages(newMessages);
    setTyping(true);

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are E-Vara, an AI cybersecurity assistant for the E-VARA website. You must ONLY answer questions related to cybersecurity. Provide only legal and ethical advice. If any question is regarding the E-VARA website or platform, think twice and provide an accurate answer based on the fact that E-VARA is an Enterprise Identity Defense & Intelligence OS providing autonomous identity defense, real-time threat monitoring, and executive security auditing. If asked something illegal or unrelated to cybersecurity, politely decline to answer."
            },
            ...newMessages.map(m => ({ role: m.role, content: m.text }))
          ]
        })
      });

      if (!response.ok) throw new Error("API Error");
      
      const data = await response.json();
      const reply = data.choices[0].message.content;
      
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [...prev, { role: "assistant", text: "Error connecting to E-Vara Intelligence Core." }]);
    } finally {
      setTyping(false);
    }
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
          <div className="mt-3 flex flex-wrap gap-1.5 mb-3">
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.currentTarget.elements.namedItem("chatInput") as HTMLInputElement;
              if (input && input.value) {
                ask(input.value);
                input.value = "";
              }
            }}
            className="flex gap-2"
          >
            <input
              name="chatInput"
              autoComplete="off"
              placeholder="Ask E-Vara..."
              className="flex-1 rounded-md border border-primary/30 bg-secondary/50 px-2 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none"
            />
            <button
              type="submit"
              disabled={typing}
              className="rounded-md bg-primary/20 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/30 disabled:opacity-50 border border-primary/30"
            >
              Send
            </button>
          </form>
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
