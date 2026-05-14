import { Activity, BadgeCheck, Code2, Crown, Gem, Headphones, Music2, Settings, Shield, Sparkles, Star, TerminalSquare } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { mergeDiscordBadges } from "../lib/constants";
import { sanitizeText } from "../lib/security";
import type { DiscordBadge, Profile } from "../lib/types";

type LanyardActivity = {
  name?: string;
  type?: number;
  state?: string;
  details?: string;
};

type LanyardData = {
  discord_status?: "online" | "idle" | "dnd" | "offline";
  discord_user?: {
    id?: string;
    username?: string;
    global_name?: string | null;
    avatar?: string | null;
    discriminator?: string;
    avatar_decoration_data?: unknown;
  };
  activities?: LanyardActivity[];
  spotify?: {
    song?: string;
    artist?: string;
  };
};

type LanyardResponse = {
  success?: boolean;
  data?: LanyardData;
};

const statusClass = {
  online: "bg-emerald-400",
  idle: "bg-yellow-300",
  dnd: "bg-red-400",
  offline: "bg-white/35"
};

const avatarFromLanyard = (data?: LanyardData | null) => {
  const user = data?.discord_user;
  if (!user?.id || !user.avatar) return null;
  const extension = user.avatar.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${extension}?size=128`;
};

const hasManualData = (profile: Profile) =>
  Boolean(profile.discord_display_name || profile.discord_username || profile.discord_avatar_url || profile.discord_status_text);

const badgeIcon = (badge: DiscordBadge) => {
  const className = "h-3.5 w-3.5";
  if (badge.id === "custom" && /^https?:\/\//i.test(badge.icon)) {
    return <img className="h-4 w-4 rounded-full object-cover" src={badge.icon} alt="" />;
  }
  const icons = {
    "badge-check": BadgeCheck,
    code: Code2,
    crown: Crown,
    gear: Settings,
    gem: Gem,
    shield: Shield,
    sparkles: Sparkles,
    star: Star,
    terminal: TerminalSquare
  };
  const Icon = icons[badge.icon as keyof typeof icons] || Star;
  return <Icon className={className} />;
};

export const DiscordWidget = ({ profile }: { profile: Profile }) => {
  const [lanyard, setLanyard] = useState<LanyardData | null>(null);
  const [liveUnavailable, setLiveUnavailable] = useState(false);
  const useLanyard = profile.discord_mode === "lanyard" && Boolean(profile.discord_user_id);

  useEffect(() => {
    if (!useLanyard || !profile.discord_user_id) {
      setLanyard(null);
      setLiveUnavailable(false);
      return;
    }

    const controller = new AbortController();
    fetch(`https://api.lanyard.rest/v1/users/${encodeURIComponent(profile.discord_user_id)}`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("Lanyard unavailable"))))
      .then((payload: LanyardResponse) => {
        if (payload.success === true && payload.data?.discord_user) {
          setLanyard(payload.data);
          setLiveUnavailable(false);
          return;
        }
        setLanyard(null);
        setLiveUnavailable(true);
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setLanyard(null);
        setLiveUnavailable(true);
      });

    return () => controller.abort();
  }, [profile.discord_user_id, useLanyard]);

  const activity = useMemo(() => {
    const active = lanyard?.activities?.find((item) => item.type !== 4 && (item.details || item.name));
    if (active) return active.details || active.name || null;
    return null;
  }, [lanyard]);

  if (!profile.show_discord_widget) return null;

  const hasLiveData = Boolean(lanyard?.discord_user);
  const canUseManual = profile.discord_use_manual_fallback !== false && hasManualData(profile);

  if (!hasLiveData && !canUseManual) return null;

  const liveUser = hasLiveData ? lanyard?.discord_user : null;
  const avatarUrl = (hasLiveData ? avatarFromLanyard(lanyard) : null) || profile.discord_avatar_url;
  const displayNameRaw = liveUser?.global_name || profile.discord_display_name || profile.discord_username;
  const usernameRaw = liveUser?.username || profile.discord_username;
  const displayName = sanitizeText(displayNameRaw || "");
  const username = sanitizeText(usernameRaw || "");
  const status = hasLiveData ? lanyard?.discord_status || "offline" : "offline";
  const statusText = sanitizeText(hasLiveData ? activity || profile.discord_status_text || "No activity" : profile.discord_status_text || "Manual profile");
  const spotifyText = lanyard?.spotify?.song ? `Spotify: ${lanyard.spotify.song}${lanyard.spotify.artist ? ` by ${lanyard.spotify.artist}` : ""}` : null;
  const enabledBadges = mergeDiscordBadges(profile.discord_badges).filter((badge) => badge.enabled);

  return (
    <section className="mt-5 rounded-[1.65rem] border border-white/10 bg-black/35 p-4 text-left shadow-[0_20px_70px_rgba(0,0,0,0.32)] backdrop-blur-2xl">
      <div className="flex items-start gap-3.5">
        <div className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full border border-white/12 bg-black/55">
          {avatarUrl ? (
            <img className="h-full w-full rounded-full object-cover" src={avatarUrl} alt={displayName ? `${displayName} Discord avatar` : "Discord avatar"} />
          ) : (
            <span className="text-lg font-extrabold text-white">{(displayName || username).slice(0, 1).toUpperCase()}</span>
          )}
          <span className={`absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-black ${statusClass[status]}`} title={status} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            <p className="min-w-0 truncate text-sm font-extrabold text-white">{displayName || username}</p>
            {enabledBadges.map((badge) => (
              <span
                key={badge.id}
                className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.07] text-white shadow-[0_0_18px_rgba(255,255,255,0.05)]"
                style={{ color: badge.color }}
                title={sanitizeText(badge.label)}
              >
                {badgeIcon(badge)}
              </span>
            ))}
            {profile.show_nitro_style_badge && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/10 bg-white/[0.06] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/80">
                <BadgeCheck className="h-3 w-3" />
                Premium
              </span>
            )}
          </div>
          {username && <p className="mt-0.5 truncate text-xs text-white/58">@{username}</p>}
          <p className="mt-2 flex min-w-0 items-center gap-2 text-xs text-white/72">
            <Activity className="h-3.5 w-3.5 shrink-0 text-white/78" />
            <span className="truncate">{statusText}</span>
          </p>
          {spotifyText && (
            <p className="mt-1 flex min-w-0 items-center gap-2 text-xs text-white/72">
              <Music2 className="h-3.5 w-3.5 shrink-0 text-white/78" />
              <span className="truncate">{sanitizeText(spotifyText)}</span>
            </p>
          )}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5 pl-[4.25rem]">
        <span className="rounded-full border border-white/8 bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold capitalize text-white/62">{status}</span>
        {hasLiveData && <span className="rounded-full border border-white/8 bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold text-white/62">Live</span>}
        {hasLiveData && spotifyText && (
          <span className="inline-flex items-center gap-1 rounded-full border border-white/8 bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold text-white/62">
            <Headphones className="h-3 w-3" />
            Spotify
          </span>
        )}
        {!hasLiveData && liveUnavailable && <span className="rounded-full border border-white/8 bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold text-white/62">Manual fallback</span>}
        {enabledBadges.length > 0 && <span className="rounded-full border border-white/8 bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold text-white/62">{enabledBadges.length} badges</span>}
      </div>
    </section>
  );
};

// Real Discord Nitro premium_type requires identify.premium, which is restricted to approved apps.
// Abo7mod only renders a manual Nitro-style visual badge when the profile owner enables it.
