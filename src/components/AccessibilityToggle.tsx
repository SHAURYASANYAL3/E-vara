import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

export default function AccessibilityToggle() {
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("high-contrast") === "true";
    setHighContrast(saved);
    document.documentElement.classList.toggle("high-contrast", saved);
  }, []);

  const toggle = () => {
    const next = !highContrast;
    setHighContrast(next);
    document.documentElement.classList.toggle("high-contrast", next);
    localStorage.setItem("high-contrast", String(next));
  };

  return (
    <button
      onClick={toggle}
      aria-pressed={highContrast}
      aria-label="Toggle high contrast mode"
      title="Toggle high contrast mode"
      className="neon-button rounded-md border border-primary/30 bg-secondary p-2 text-xs"
    >
      <Eye size={16} />
    </button>
  );
}
