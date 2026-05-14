import { Mail, Globe } from "lucide-react";
import { FaDiscord, FaGithub, FaInstagram, FaSpotify, FaSteam, FaTelegram, FaTiktok, FaXTwitter, FaYoutube } from "react-icons/fa6";
import type { SocialItem } from "../lib/types";

const platformIcon = (platform: string) => {
  const normalized = platform.toLowerCase();
  if (normalized.includes("discord")) return FaDiscord;
  if (normalized.includes("github")) return FaGithub;
  if (normalized.includes("steam")) return FaSteam;
  if (normalized.includes("telegram")) return FaTelegram;
  if (normalized.includes("youtube")) return FaYoutube;
  if (normalized.includes("tiktok")) return FaTiktok;
  if (normalized.includes("twitter") || normalized.includes("x/")) return FaXTwitter;
  if (normalized.includes("instagram")) return FaInstagram;
  if (normalized.includes("spotify")) return FaSpotify;
  if (normalized.includes("email")) return Mail;
  return Globe;
};

export const SocialIcons = ({ socials }: { socials: SocialItem[] }) => {
  if (!socials.length) return null;
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {socials.map((social) => {
        const Icon = platformIcon(social.platform);
        return (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noreferrer"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/12 bg-white/[0.07] text-white backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.14] hover:shadow-[0_0_26px_rgba(255,255,255,0.08)]"
            aria-label={social.platform}
          >
            <Icon className="h-5 w-5" />
          </a>
        );
      })}
    </div>
  );
};
