import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShieldCheck,
  Users,
  Fingerprint,
  CreditCard,
  LifeBuoy,
  FlaskConical,
  Home,
  BookOpen,
  Tags,
  ShieldHalf,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

interface NavCommand {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  keywords?: string[];
}

const primaryCommands: NavCommand[] = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    keywords: ["home", "overview"],
  },
  {
    label: "Trust Center",
    path: "/trust-center",
    icon: ShieldCheck,
    keywords: ["compliance", "security"],
  },
  {
    label: "Analyst Portal",
    path: "/analyst-portal",
    icon: Users,
    keywords: ["console", "analyst"],
  },
  {
    label: "Identity Records",
    path: "/identity-records",
    icon: Fingerprint,
    keywords: ["identity", "records"],
  },
  {
    label: "Billing",
    path: "/billing",
    icon: CreditCard,
    keywords: ["payments", "subscription", "plan"],
  },
];

const secondaryCommands: NavCommand[] = [
  { label: "Landing Page", path: "/", icon: Home, keywords: ["home"] },
  {
    label: "Client Portal",
    path: "/client-portal",
    icon: ShieldHalf,
    keywords: ["portal", "client"],
  },
  {
    label: "Support",
    path: "/support",
    icon: LifeBuoy,
    keywords: ["help", "tickets"],
  },
  {
    label: "Labs",
    path: "/labs",
    icon: FlaskConical,
    keywords: ["experiments", "beta"],
  },
  { label: "Docs", path: "/docs", icon: BookOpen, keywords: ["documentation"] },
  {
    label: "Pricing",
    path: "/pricing",
    icon: Tags,
    keywords: ["plans", "cost"],
  },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const runCommand = useCallback(
    (path: string) => {
      setOpen(false);
      navigate(path);
    },
    [navigate],
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages and actions..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Quick Navigation">
          {primaryCommands.map(({ label, path, icon: Icon, keywords }) => (
            <CommandItem
              key={path}
              value={`${label} ${keywords?.join(" ") ?? ""}`}
              onSelect={() => runCommand(path)}
            >
              <Icon className="mr-2 h-4 w-4" />
              <span>{label}</span>
              <CommandShortcut>{path}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="More Pages">
          {secondaryCommands.map(({ label, path, icon: Icon, keywords }) => (
            <CommandItem
              key={path}
              value={`${label} ${keywords?.join(" ") ?? ""}`}
              onSelect={() => runCommand(path)}
            >
              <Icon className="mr-2 h-4 w-4" />
              <span>{label}</span>
              <CommandShortcut>{path}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export default CommandPalette;
