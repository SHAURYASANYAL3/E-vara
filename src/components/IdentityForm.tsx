import { useState } from "react";
import { User } from "lucide-react";

interface IdentityFormProps {
  onSave: (data: { fullName: string; username: string; socialLink: string; keywords: string }) => void;
  initial?: { fullName: string; username: string; socialLink: string; keywords: string } | null;
}

const IdentityForm = ({ onSave, initial }: IdentityFormProps) => {
  const [fullName, setFullName] = useState(initial?.fullName || "");
  const [username, setUsername] = useState(initial?.username || "");
  const [socialLink, setSocialLink] = useState(initial?.socialLink || "");
  const [keywords, setKeywords] = useState(initial?.keywords || "");
  const [saved, setSaved] = useState(!!initial);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ fullName, username, socialLink, keywords });
    setSaved(true);
  };

  const inputClass = "w-full rounded-md border border-border bg-secondary px-3 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-4 flex items-center gap-2">
        <User className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-mono font-semibold text-foreground uppercase tracking-wider">Identity Information</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-mono text-muted-foreground">Full Name</label>
          <input value={fullName} onChange={e => setFullName(e.target.value)} required className={inputClass} placeholder="John Doe" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-mono text-muted-foreground">Username / Handle</label>
          <input value={username} onChange={e => setUsername(e.target.value)} required className={inputClass} placeholder="@johndoe" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-mono text-muted-foreground">Social Media Link</label>
          <input value={socialLink} onChange={e => setSocialLink(e.target.value)} className={inputClass} placeholder="https://twitter.com/johndoe" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-mono text-muted-foreground">Keywords (optional)</label>
          <input value={keywords} onChange={e => setKeywords(e.target.value)} className={inputClass} placeholder="developer, photographer" />
        </div>
        <button type="submit" className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-mono font-medium text-primary-foreground hover:opacity-90 transition-opacity">
          {saved ? "Update Identity" : "Save Identity"}
        </button>
      </form>
    </div>
  );
};

export default IdentityForm;
