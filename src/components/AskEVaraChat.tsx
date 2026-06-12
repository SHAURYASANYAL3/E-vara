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

  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<{ role: string, content: string }[]>([
    { role: "assistant", content: "I can provide exposure guidance from your active telemetry. Ask me anything." }
  ]);

  const askQuestion = async (questionText: string) => {
    if (!questionText.trim()) return;

    const newMessages = [...messages, { role: "user", content: questionText }];
    setMessages(newMessages);
    setTyping(true);
    setDisplayed("");

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
            ...newMessages
          ]
        })
      });

      if (!response.ok) throw new Error("API Error");
      
      const data = await response.json();
      const reply = data.choices[0].message.content;
      
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      // Simple typing effect for the newest message
      let i = 0;
      const id = window.setInterval(() => {
        i += 1;
        setDisplayed(reply.slice(0, i));
        if (i >= reply.length) window.clearInterval(id);
      }, 10);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [...prev, { role: "assistant", content: "Error connecting to AI backend." }]);
      setDisplayed("Error connecting to AI backend.");
    } finally {
      setTyping(false);
    }
  };

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
          
          <div className="max-h-48 space-y-2 overflow-y-auto mb-3 pr-1">
             {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`rounded-md px-2 py-1.5 text-xs ${m.role === "assistant" ? "bg-secondary/60 text-foreground" : "ml-6 bg-primary/20 text-primary"}`}
                >
                  {m.role === "assistant" && idx === messages.length - 1 && !typing ? displayed || m.content : m.content}
                </div>
              ))}
              {typing && (
                <div className="rounded-md bg-secondary/60 px-2 py-1.5 text-xs text-muted-foreground animate-pulse">
                  E-Vara is typing...
                </div>
              )}
          </div>

          <div className="mb-2 flex flex-wrap gap-1.5">
            {presets.map((item) => (
              <button
                key={item}
                disabled={typing}
                onClick={() => askQuestion(item)}
                className="rounded border border-border px-2 py-1 text-[10px] font-mono text-muted-foreground hover:text-foreground disabled:opacity-50"
              >
                {item}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.currentTarget.elements.namedItem("chatInput") as HTMLInputElement;
              if (input && input.value) {
                askQuestion(input.value);
                input.value = "";
              }
            }}
            className="flex gap-2"
          >
            <input
              name="chatInput"
              autoComplete="off"
              placeholder="Ask E-Vara..."
              className="flex-1 rounded border border-border/70 bg-secondary/35 p-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
            />
            <button
              type="submit"
              disabled={typing}
              className="rounded bg-primary/20 px-3 py-2 text-xs text-primary hover:bg-primary/30 disabled:opacity-50 border border-primary/30"
            >
              Send
            </button>
          </form>
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
