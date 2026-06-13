import { useState, useMemo } from "react";
import {
  Shield,
  MessageSquare,
  Send,
  User,
  Bot,
  Clock,
  Lock,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const SupportPage = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    { role: "system", content: "Secure communication channel established." },
    {
      role: "bot",
      content:
        "Welcome, Operative. I am your dedicated intelligence assistant. How can I assist your defense protocols today?",
    },
  ]);

  const sessionId = useMemo(

    () => crypto.randomUUID().slice(0, 8).toUpperCase(),

     
    () => Math.random().toString(36).substring(7).toUpperCase(),

    [],
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setChat([...chat, { role: "user", content: message }]);
    setMessage("");

    setTimeout(() => {
      setChat((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            "Inquiry received. Relaying to your dedicated account lead. Current response time: < 15 minutes.",
        },
      ]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#050608] text-foreground font-mono selection:bg-primary/30 flex flex-col">
      <nav className="h-20 border-b border-white/5 bg-[#050608]/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/client-portal" className="flex items-center gap-2">
              <div className="p-2 bg-primary rounded-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight uppercase">
                E-VARA
              </span>
            </Link>
          </div>
          <Link to="/client-portal">
            <Button
              variant="ghost"
              className="text-[10px] uppercase font-bold tracking-widest hover:bg-white/5"
            >
              Back to Portal
            </Button>
          </Link>
        </div>
      </nav>

      <div className="flex-1 container mx-auto px-6 py-12 flex flex-col md:flex-row gap-8 max-w-6xl">
        {/* Sidebar Info */}
        <div className="md:w-80 space-y-6">
          <div className="p-6 rounded-[24px] border border-white/5 bg-[#11141B]">
            <h3 className="font-bold uppercase tracking-widest text-xs mb-6">
              Assigned Operative
            </h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold uppercase">Agent_K</p>
                <p className="text-[10px] text-muted-foreground uppercase">
                  Senior Defense Lead
                </p>
              </div>
            </div>
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase">
                <Clock className="h-3 w-3" /> Avg Response: 12m
              </div>
              <div className="flex items-center gap-2 text-[10px] text-success uppercase">
                <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />{" "}
                Operative Online
              </div>
            </div>
          </div>

          <div className="p-6 rounded-[24px] border border-white/5 bg-white/[0.02]">
            <h3 className="font-bold uppercase tracking-widest text-xs mb-6">
              Resources
            </h3>
            <ul className="space-y-4">
              <li>
                <button className="flex items-center justify-between w-full text-[10px] uppercase font-bold text-muted-foreground hover:text-primary transition-colors">
                  Security FAQ <ChevronRight className="h-3 w-3" />
                </button>
              </li>
              <li>
                <button className="flex items-center justify-between w-full text-[10px] uppercase font-bold text-muted-foreground hover:text-primary transition-colors">
                  Protocol Docs <ChevronRight className="h-3 w-3" />
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col rounded-[24px] border border-white/10 bg-[#11141B] overflow-hidden relative shadow-2xl shadow-primary/5">
          <div className="absolute inset-0 hud-grid opacity-[0.03] pointer-events-none" />

          <div className="p-6 border-b border-white/5 flex items-center justify-between relative z-10 bg-[#11141B]/80 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                Secure Terminal • Session_ID: {sessionId}
              </span>
            </div>
            <Lock className="h-3.5 w-3.5 text-muted-foreground" />
          </div>

          <div className="flex-1 p-6 overflow-y-auto space-y-6 relative z-10 min-h-[400px]">
            {chat.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 text-xs font-mono ${
                    msg.role === "user"
                      ? "bg-primary text-white"
                      : msg.role === "system"
                        ? "bg-white/5 text-muted-foreground border border-white/5 text-center w-full italic"
                        : "bg-white/5 border border-white/10 text-foreground"
                  }`}
                >
                  {msg.role === "bot" && (
                    <div className="flex items-center gap-2 mb-2 text-[9px] font-bold text-primary uppercase tracking-widest">
                      <Bot className="h-3 w-3" /> Operative_OS
                    </div>
                  )}
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSend}
            className="p-6 border-t border-white/5 relative z-10 bg-[#11141B]/80 backdrop-blur-md"
          >
            <div className="flex gap-4">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter briefing request or tactical query..."
                className="flex-1 bg-[#050608]/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              />
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white rounded-xl h-12 w-12 flex items-center justify-center"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <p className="mt-4 text-[8px] text-center text-muted-foreground uppercase tracking-[0.2em]">
              Encrypted with end-to-end PGP protocols. No logs stored on public
              clusters.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
