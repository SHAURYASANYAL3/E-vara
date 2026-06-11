import { useState } from "react";
import {
  MessageSquare,
  Bug,
  Lightbulb,
  Send,
  X,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent, log } from "@/lib/observability";
import { toast } from "sonner";
import { checkRateLimit } from "@/lib/security";

type FeedbackType = "feedback" | "bug" | "feature";

const FeedbackWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<FeedbackType>("feedback");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const feedbackTypes = [
    {
      key: "feedback" as const,
      label: "Feedback",
      icon: <MessageSquare className="h-3.5 w-3.5" />,
      color: "text-primary",
    },
    {
      key: "bug" as const,
      label: "Bug Report",
      icon: <Bug className="h-3.5 w-3.5" />,
      color: "text-alert",
    },
    {
      key: "feature" as const,
      label: "Feature Request",
      icon: <Lightbulb className="h-3.5 w-3.5" />,
      color: "text-warning",
    },
  ];

  const handleSubmit = async () => {
    if (!message.trim()) return;

    if (!checkRateLimit("feedback_submit", 3, 60000)) {
      toast.error("Rate limit exceeded. Please try again later.");
      return;
    }

    setSubmitting(true);
    try {
      // Store feedback locally and track event
      const feedbackEntry = {
        type,
        message: message.trim(),
        email: email.trim() || undefined,
        timestamp: new Date().toISOString(),
        path: window.location.pathname,
        userAgent: navigator.userAgent,
      };

      // Store in local feedback queue
      const queue = JSON.parse(
        localStorage.getItem("e_vara_feedback_queue") || "[]",
      );
      queue.push(feedbackEntry);
      localStorage.setItem("e_vara_feedback_queue", JSON.stringify(queue));

      // Track the event
      trackEvent("feedback_submitted", feedbackEntry);
      log("info", `[Feedback] ${type} submitted`, feedbackEntry);

      toast.success("Feedback Received", {
        description: "Thank you for helping improve E-VARA.",
      });

      setMessage("");
      setEmail("");
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-3 w-80 bg-[#0c0f16]/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between p-4 border-b border-white/5">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground">
              Send Feedback
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Type Selector */}
            <div className="flex gap-2">
              {feedbackTypes.map((ft) => (
                <button
                  key={ft.key}
                  onClick={() => setType(ft.key)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all border ${
                    type === ft.key
                      ? "bg-primary/10 border-primary/40 text-primary"
                      : "border-white/5 text-muted-foreground hover:border-white/20"
                  }`}
                >
                  {ft.icon}
                  {ft.label}
                </button>
              ))}
            </div>

            {/* Message */}
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                type === "bug"
                  ? "Describe the issue..."
                  : type === "feature"
                    ? "Describe your idea..."
                    : "Your feedback..."
              }
              className="w-full h-24 bg-black/40 border border-white/10 rounded-lg p-3 text-xs font-body text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:border-primary/40 transition"
              maxLength={1000}
            />

            {/* Email (optional) */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email (optional, for follow-up)"
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 transition"
            />

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              disabled={!message.trim() || submitting}
              className="w-full bg-primary/20 hover:bg-primary/30 border border-primary/40 text-primary text-[10px] uppercase tracking-widest font-bold"
            >
              <Send className="h-3 w-3 mr-2" />
              {submitting ? "Sending..." : "Submit"}
            </Button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary/50 text-primary rounded-full px-4 py-3 shadow-lg transition-all"
      >
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <>
            <MessageSquare className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Feedback
            </span>
          </>
        )}
      </button>
    </div>
  );
};

export default FeedbackWidget;
