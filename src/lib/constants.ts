import type { DiscordBadge, Profile } from "./types";

export const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;

export const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || "")
  .split(",")
  .map((email: string) => email.trim().toLowerCase())
  .filter(Boolean);

export const reservedUsernames = [
  "admin",
  "dashboard",
  "login",
  "register",
  "api",
  "settings",
  "support",
  "help",
  "terms",
  "privacy",
  "netlify",
  "voidbio",
  "assets",
  "static",
  "public",
  "u"
];

export const getProfileHandle = (profile: Pick<Profile, "profile_slug" | "username">) => profile.profile_slug || profile.username;

export const getProfileUrl = (profile: Pick<Profile, "profile_slug" | "username">) => `${siteUrl}/${getProfileHandle(profile)}`;

export const socialPlatforms = [
  "Discord",
  "GitHub",
  "Steam",
  "Telegram",
  "YouTube",
  "TikTok",
  "X/Twitter",
  "Instagram",
  "Spotify",
  "Website",
  "Email"
];

export const defaultDiscordBadges: DiscordBadge[] = [
  { id: "nitro", label: "Nitro", icon: "sparkles", color: "#f0cf84", enabled: false },
  { id: "boost", label: "Server Boost", icon: "gem", color: "#f0cf84", enabled: false },
  { id: "developer", label: "Developer", icon: "code", color: "#f5f5f0", enabled: false },
  { id: "active_developer", label: "Active Developer", icon: "terminal", color: "#f5f5f0", enabled: false },
  { id: "hypesquad", label: "HypeSquad", icon: "shield", color: "#f5f5f0", enabled: false },
  { id: "verified", label: "Verified", icon: "badge-check", color: "#f0cf84", enabled: false },
  { id: "founder", label: "Founder", icon: "crown", color: "#f0cf84", enabled: false },
  { id: "crown", label: "Crown", icon: "crown", color: "#f0cf84", enabled: false },
  { id: "gear", label: "Gear", icon: "gear", color: "#f5f5f0", enabled: false },
  { id: "sparkle", label: "Sparkle", icon: "sparkles", color: "#f0cf84", enabled: false },
  { id: "custom", label: "Custom", icon: "", color: "#f5f5f0", enabled: false }
];

export const mergeDiscordBadges = (badges?: DiscordBadge[] | null): DiscordBadge[] => {
  const provided = Array.isArray(badges) ? badges : [];
  return defaultDiscordBadges.map((badge) => {
    const match = provided.find((item) => item?.id === badge.id);
    return {
      ...badge,
      ...match,
      id: badge.id,
      label: match?.label || badge.label,
      icon: match?.icon ?? badge.icon,
      color: match?.color || badge.color,
      enabled: Boolean(match?.enabled)
    };
  });
};

export const premiumBlackGlassDesign = {
  theme_preset: "premium-black-glass",
  background_url: "linear-gradient(125deg, #000000 0%, #070707 46%, #111111 62%, #000000 100%)",
  background_type: "gradient" as const,
  music_url: "",
  music_autoplay: false,
  music_volume: 0.25,
  music_title: "",
  music_artist: "",
  card_preset: "black-glass",
  button_preset: "black-glass",
  font_family: "Inter",
  accent_color: "#d7b46a",
  text_color: "#f5f5f0",
  card_color: "#080808",
  button_color: "#d7b46a",
  card_opacity: 0.58,
  overlay_opacity: 0.55,
  blur_amount: 24,
  background_blur: 0,
  background_brightness: 80,
  background_saturation: 100,
  glow_intensity: 24,
  border_radius: 28,
  animated_title: false,
  show_views: true,
  show_badges: true,
  show_music_player: true,
  show_discord_widget: false,
  discord_mode: "lanyard" as const,
  discord_user_id: "",
  discord_username: "",
  discord_display_name: "",
  discord_avatar_url: "",
  discord_status_text: "",
  show_nitro_style_badge: false,
  discord_badges: defaultDiscordBadges,
  discord_use_manual_fallback: true,
  discord_hide_if_empty: true,
  cursor_enabled: false,
  cursor_style: "soft-glow" as const,
  cursor_color: "#ffffff",
  cursor_size: 22,
  cursor_opacity: 0.55,
  cursor_trail_enabled: true,
  cursor_trail_length: 8,
  cursor_blur: 18,
  cursor_blend_mode: "screen" as const,
  card_mouse_parallax: true,
  background_mouse_parallax: false,
  particles_enabled: false,
  glow_enabled: true
};

export const demoProfile: Profile = {
  id: "demo",
  username: "demo",
  profile_slug: null,
  display_name: "Abo7mod Demo",
  bio: "A refined home for links, socials, media, and the work worth sharing.",
  avatar_url: null,
  ...premiumBlackGlassDesign,
  show_discord_widget: true,
  discord_mode: "manual",
  discord_user_id: "",
  discord_username: "void.demo",
  discord_display_name: "Abo7mod Demo",
  discord_avatar_url: "",
  discord_status_text: "Building a cinematic profile",
  show_nitro_style_badge: true,
  discord_badges: mergeDiscordBadges([
    { id: "nitro", label: "Nitro", icon: "sparkles", color: "#f0cf84", enabled: true },
    { id: "developer", label: "Developer", icon: "code", color: "#f5f5f0", enabled: true },
    { id: "verified", label: "Verified", icon: "badge-check", color: "#f0cf84", enabled: true }
  ]),
  seo_title: null,
  seo_description: null,
  og_image_url: null,
  disabled: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};
