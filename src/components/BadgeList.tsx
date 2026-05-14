import { Award } from "lucide-react";
import type { Badge } from "../lib/types";

export const BadgeList = ({ badges }: { badges: Badge[] }) => {
  if (!badges.length) return null;
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {badges.map((badge) => (
        <span
          key={badge.id}
          className="inline-flex items-center gap-1 rounded-full border border-luxury-accent/20 bg-luxury-accent/10 px-3 py-1 text-xs font-semibold text-luxury-accent"
          title={badge.description || badge.name}
        >
          {badge.icon_url ? <img src={badge.icon_url} alt="" className="h-3.5 w-3.5 rounded-full" /> : <Award className="h-3.5 w-3.5" />}
          {badge.name}
        </span>
      ))}
    </div>
  );
};
