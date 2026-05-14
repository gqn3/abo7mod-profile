import { cn } from "../lib/ui";

export const ToggleControl = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left"
  >
    <span className="text-sm font-semibold text-luxury-text">{label}</span>
    <span className={cn("relative h-6 w-11 rounded-full transition", checked ? "bg-luxury-accent" : "bg-white/[0.12]")}>
      <span className={cn("absolute top-1 h-4 w-4 rounded-full bg-luxury-text transition", checked ? "left-6" : "left-1")} />
    </span>
  </button>
);
