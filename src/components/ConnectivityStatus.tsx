import { Radio, MessageSquare, Mail, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ConnectivityStatus = () => {
  const integrations = [
    {
      name: "Email Relay",
      status: "Connected",
      icon: <Mail className="h-3 w-3" />,
    },
    {
      name: "Slack Webhook",
      status: "Inactive",
      icon: <MessageSquare className="h-3 w-3" />,
    },
    {
      name: "Data Crawler",
      status: "Active",
      icon: <Radio className="h-3 w-3 animate-pulse" />,
    },
    {
      name: "SIEM API",
      status: "Ready",
      icon: <Terminal className="h-3 w-3" />,
    },
  ];

  return (
    <div className="rounded-xl border border-border/50 bg-card/20 p-4 backdrop-blur-sm">
      <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
        <Terminal className="h-3 w-3" /> Connectivity Matrix
      </h4>
      <div className="grid grid-cols-2 gap-3">
        {integrations.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between p-2 rounded border border-border/30 bg-secondary/20"
          >
            <div className="flex items-center gap-2">
              <div className="text-primary/70">{item.icon}</div>
              <span className="text-[9px] font-mono font-medium">
                {item.name}
              </span>
            </div>
            <Badge
              variant="outline"
              className={`text-[8px] h-4 px-1 ${item.status === "Active" || item.status === "Connected" ? "border-primary/50 text-primary" : "text-muted-foreground"}`}
            >
              {item.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConnectivityStatus;
