import { z } from "zod";
import { reservedUsernames } from "./constants";
import { isSafeUrl, normalizeUrl } from "./security";

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(24, "Username must be 24 characters or fewer")
  .regex(/^[a-z0-9_]+$/, "Use lowercase letters, numbers, and underscores only")
  .refine((value) => !reservedUsernames.includes(value), "That username is reserved");

export const profileSlugSchema = z
  .string()
  .transform((value) => value.trim().toLowerCase())
  .refine((value) => value === "" || /^[a-z0-9_-]{3,30}$/.test(value), "Short link must be 3-30 lowercase letters, numbers, hyphens, or underscores")
  .refine((value) => value === "" || !reservedUsernames.includes(value), "That short link is reserved");

export const authSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export const profileSchema = z.object({
  username: usernameSchema,
  profile_slug: profileSlugSchema,
  display_name: z.string().max(64).optional(),
  bio: z.string().max(280).optional(),
  seo_title: z.string().max(80).optional(),
  seo_description: z.string().max(180).optional(),
  og_image_url: z.string().optional()
});

export const linkSchema = z.object({
  title: z.string().min(1, "Title is required").max(60),
  url: z
    .string()
    .min(1, "URL is required")
    .transform(normalizeUrl)
    .refine(isSafeUrl, "Use a safe http, https, or mailto URL"),
  icon: z.string().optional(),
  button_style: z.string().default("inherit"),
  is_visible: z.boolean().default(true)
});

export const socialSchema = z.object({
  platform: z.string().min(1),
  url: z
    .string()
    .min(1, "URL is required")
    .transform(normalizeUrl)
    .refine(isSafeUrl, "Use a safe http, https, or mailto URL"),
  is_visible: z.boolean().default(true)
});

export const themeSchema = z.object({
  theme_preset: z.string(),
  background_url: z.string().nullable(),
  background_type: z.enum(["gradient", "image", "gif", "video"]),
  music_url: z.string().nullable(),
  music_autoplay: z.boolean(),
  music_volume: z.number().min(0).max(1),
  music_title: z.string().nullable(),
  music_artist: z.string().nullable(),
  card_preset: z.string(),
  button_preset: z.string(),
  font_family: z.string(),
  accent_color: z.string(),
  text_color: z.string(),
  card_color: z.string(),
  button_color: z.string(),
  card_opacity: z.number().min(0).max(1),
  overlay_opacity: z.number().min(0).max(1),
  blur_amount: z.number().min(0).max(40),
  background_blur: z.number().min(0).max(24),
  background_brightness: z.number().min(30).max(120),
  background_saturation: z.number().min(0).max(180),
  glow_intensity: z.number().min(0).max(80),
  border_radius: z.number().min(0).max(40),
  animated_title: z.boolean(),
  show_views: z.boolean(),
  show_badges: z.boolean(),
  show_music_player: z.boolean(),
  show_discord_widget: z.boolean(),
  discord_mode: z.enum(["manual", "lanyard"]),
  discord_user_id: z.string().nullable(),
  discord_username: z.string().nullable(),
  discord_display_name: z.string().nullable(),
  discord_avatar_url: z.string().nullable(),
  discord_status_text: z.string().nullable(),
  show_nitro_style_badge: z.boolean(),
  discord_badges: z.array(
    z.object({
      id: z.string().min(1).max(40),
      label: z.string().min(1).max(48),
      icon: z.string().max(300),
      color: z.string().max(24),
      enabled: z.boolean()
    })
  ),
  discord_use_manual_fallback: z.boolean(),
  discord_hide_if_empty: z.boolean(),
  cursor_enabled: z.boolean(),
  cursor_style: z.enum(["soft-glow", "ring", "dot-ring", "spotlight", "smoke", "minimal"]),
  cursor_color: z.string(),
  cursor_size: z.number().min(6).max(96),
  cursor_opacity: z.number().min(0).max(1),
  cursor_trail_enabled: z.boolean(),
  cursor_trail_length: z.number().min(0).max(18),
  cursor_blur: z.number().min(0).max(60),
  cursor_blend_mode: z.enum(["normal", "screen", "lighten", "difference"]),
  card_mouse_parallax: z.boolean(),
  background_mouse_parallax: z.boolean(),
  particles_enabled: z.boolean(),
  glow_enabled: z.boolean()
});

export const badgeSchema = z.object({
  name: z.string().min(1).max(48),
  description: z.string().max(140).optional(),
  icon_url: z.string().optional(),
  color: z.string().default("#ffffff")
});
