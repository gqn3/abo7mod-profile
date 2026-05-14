import { ExternalLink, Link2, Mail, Music, Play, Star } from "lucide-react";
import type { LinkItem } from "../lib/types";

const iconMap = {
  link: Link2,
  star: Star,
  play: Play,
  music: Music,
  mail: Mail,
  external: ExternalLink
};

export const LinkButton = ({ link }: { link: LinkItem }) => {
  const Icon = iconMap[(link.icon || "link") as keyof typeof iconMap] || Link2;
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer"
      className="group flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 text-sm font-bold text-white shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.12] hover:shadow-[0_0_28px_rgba(255,255,255,0.08)]"
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 bg-black/40 text-white">
          <Icon className="h-4 w-4" />
        </span>
        <span className="truncate">{link.title}</span>
      </span>
      <ExternalLink className="h-4 w-4 shrink-0 text-white/55 transition group-hover:text-white" />
    </a>
  );
};
