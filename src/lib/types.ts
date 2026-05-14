export type BackgroundType = "gradient" | "image" | "gif" | "video";
export type DiscordMode = "manual" | "lanyard";
export type CursorStyle = "soft-glow" | "ring" | "dot-ring" | "spotlight" | "smoke" | "minimal";
export type CursorBlendMode = "normal" | "screen" | "lighten" | "difference";
export type DiscordBadge = {
  id: string;
  label: string;
  icon: string;
  color: string;
  enabled: boolean;
};

export type Profile = {
  id: string;
  username: string;
  profile_slug: string | null;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  background_url: string | null;
  background_type: BackgroundType;
  music_url: string | null;
  music_autoplay: boolean;
  music_volume: number;
  music_title: string | null;
  music_artist: string | null;
  theme_preset: string;
  card_preset: string;
  button_preset: string;
  font_family: string;
  accent_color: string;
  text_color: string;
  card_color: string;
  button_color: string;
  card_opacity: number;
  overlay_opacity: number;
  blur_amount: number;
  background_blur: number;
  background_brightness: number;
  background_saturation: number;
  glow_intensity: number;
  border_radius: number;
  animated_title: boolean;
  show_views: boolean;
  show_badges: boolean;
  show_music_player: boolean;
  show_discord_widget: boolean;
  discord_mode: DiscordMode;
  discord_user_id: string | null;
  discord_username: string | null;
  discord_display_name: string | null;
  discord_avatar_url: string | null;
  discord_status_text: string | null;
  show_nitro_style_badge: boolean;
  discord_badges: DiscordBadge[];
  discord_use_manual_fallback: boolean;
  discord_hide_if_empty: boolean;
  cursor_enabled: boolean;
  cursor_style: CursorStyle;
  cursor_color: string;
  cursor_size: number;
  cursor_opacity: number;
  cursor_trail_enabled: boolean;
  cursor_trail_length: number;
  cursor_blur: number;
  cursor_blend_mode: CursorBlendMode;
  card_mouse_parallax: boolean;
  background_mouse_parallax: boolean;
  particles_enabled: boolean;
  glow_enabled: boolean;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  disabled: boolean;
  created_at: string;
  updated_at: string;
};

export type LinkItem = {
  id: string;
  profile_id: string;
  title: string;
  url: string;
  icon: string | null;
  button_style: string;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
};

export type SocialItem = {
  id: string;
  profile_id: string;
  platform: string;
  url: string;
  sort_order: number;
  is_visible: boolean;
};

export type Badge = {
  id: string;
  name: string;
  description: string | null;
  icon_url: string | null;
  color: string;
  created_at: string;
};

export type ProfileBadge = {
  profile_id: string;
  badge_id: string;
  badges?: Badge;
};

export type ProfileView = {
  id: string;
  profile_id: string;
  visitor_hash: string | null;
  user_agent: string | null;
  referrer: string | null;
  device: string | null;
  browser: string | null;
  created_at: string;
};

export type ProfileBundle = {
  profile: Profile;
  links: LinkItem[];
  socials: SocialItem[];
  badges: Badge[];
  viewCount?: number;
};

export type ThemeDraft = Pick<
  Profile,
  | "theme_preset"
  | "background_url"
  | "background_type"
  | "music_url"
  | "music_autoplay"
  | "music_volume"
  | "music_title"
  | "music_artist"
  | "card_preset"
  | "button_preset"
  | "font_family"
  | "accent_color"
  | "text_color"
  | "card_color"
  | "button_color"
  | "card_opacity"
  | "overlay_opacity"
  | "blur_amount"
  | "background_blur"
  | "background_brightness"
  | "background_saturation"
  | "glow_intensity"
  | "border_radius"
  | "animated_title"
  | "show_views"
  | "show_badges"
  | "show_music_player"
  | "show_discord_widget"
  | "discord_mode"
  | "discord_user_id"
  | "discord_username"
  | "discord_display_name"
  | "discord_avatar_url"
  | "discord_status_text"
  | "show_nitro_style_badge"
  | "discord_badges"
  | "discord_use_manual_fallback"
  | "discord_hide_if_empty"
  | "cursor_enabled"
  | "cursor_style"
  | "cursor_color"
  | "cursor_size"
  | "cursor_opacity"
  | "cursor_trail_enabled"
  | "cursor_trail_length"
  | "cursor_blur"
  | "cursor_blend_mode"
  | "card_mouse_parallax"
  | "background_mouse_parallax"
  | "particles_enabled"
  | "glow_enabled"
>;
