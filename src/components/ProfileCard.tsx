import { Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { PointerEvent } from "react";
import { BadgeList } from "./BadgeList";
import { DiscordWidget } from "./DiscordWidget";
import { LinkButton } from "./LinkButton";
import { MusicPlayer } from "./MusicPlayer";
import { SocialIcons } from "./SocialIcons";
import { sanitizeText } from "../lib/security";
import type { ProfileBundle } from "../lib/types";

export const ProfileCard = ({ bundle, compact = false }: { bundle: ProfileBundle; compact?: boolean }) => {
  const { profile, links, socials, badges, viewCount } = bundle;
  const [parallaxEnabled, setParallaxEnabled] = useState(false);
  const [parallax, setParallax] = useState({ rotateX: 0, rotateY: 0, x: 0, y: 0 });
  const displayName = sanitizeText(profile.display_name || profile.username);
  const radius = Math.min(Math.max(profile.border_radius || 28, 18), 34);
  const opacity = Math.min(Math.max(profile.card_opacity || 0.58, 0.45), 0.78);

  useEffect(() => {
    setParallaxEnabled(
      Boolean(
        !compact &&
          profile.card_mouse_parallax &&
          typeof window !== "undefined" &&
          window.matchMedia("(pointer: fine)").matches &&
          !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      )
    );
  }, [compact, profile.card_mouse_parallax]);

  const handleCardMove = (event: PointerEvent<HTMLElement>) => {
    if (!parallaxEnabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setParallax({
      rotateX: y * -3,
      rotateY: x * 3,
      x: x * 8,
      y: y * 8
    });
  };

  const resetParallax = () => setParallax({ rotateX: 0, rotateY: 0, x: 0, y: 0 });

  return (
    <motion.section
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onPointerMove={handleCardMove}
      onPointerLeave={resetParallax}
      className="relative mx-auto w-full max-w-[28rem] overflow-hidden border border-white/14 p-6 text-center shadow-luxury backdrop-blur-2xl sm:p-7"
      style={{
        backgroundColor: `rgba(8, 8, 8, ${opacity})`,
        borderRadius: radius,
        backdropFilter: `blur(${profile.blur_amount || 24}px)`
      }}
    >
      <div className="pointer-events-none absolute inset-x-10 -top-20 h-44 rounded-full bg-white/[0.08] blur-3xl" />
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/5" />
      <div
        className="relative"
        style={{
          transform: parallaxEnabled
            ? `translate3d(${parallax.x}px, ${parallax.y}px, 0) rotateX(${parallax.rotateX}deg) rotateY(${parallax.rotateY}deg)`
            : undefined,
          transformStyle: "preserve-3d",
          transition: "transform 120ms ease-out"
        }}
      >
        <div className="mx-auto mb-5 grid h-32 w-32 place-items-center overflow-hidden rounded-full border border-white/20 bg-black/50 shadow-[0_0_44px_rgba(255,255,255,0.08)]">
          {profile.avatar_url ? (
            <img className="h-full w-full object-cover" src={profile.avatar_url} alt={`${profile.username} avatar`} />
          ) : (
            <span className="font-heading text-4xl font-extrabold text-white">
              {displayName.slice(0, 1).toUpperCase()}
            </span>
          )}
        </div>
        <h2 className="heading break-words text-3xl">{displayName}</h2>
        <p className="mt-1 text-sm font-semibold text-white/60">@{sanitizeText(profile.username)}</p>
        {profile.bio && <p className="mx-auto mt-4 max-w-sm break-words text-sm leading-6 text-white/75">{sanitizeText(profile.bio)}</p>}
        <DiscordWidget profile={profile} />
        {profile.show_badges && (
          <div className="mt-5">
            <BadgeList badges={badges} />
          </div>
        )}
        <div className="mt-5">
          <SocialIcons socials={socials} />
        </div>
        <div className="mt-6 space-y-3">
          {links.map((link) => (
            <LinkButton key={link.id} link={link} />
          ))}
        </div>
        {profile.music_url && !compact && (
          <div className="mt-5">
            <MusicPlayer
              src={profile.music_url}
              title={profile.music_title || "Now playing"}
              artist={profile.music_artist || undefined}
              autoplay={profile.music_autoplay}
              initialVolume={profile.music_volume ?? 0.25}
            />
          </div>
        )}
        {profile.show_views && (
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-luxury-muted">
            <Eye className="h-3.5 w-3.5 text-luxury-accent" />
            {viewCount || 0} views
          </div>
        )}
      </div>
    </motion.section>
  );
};
