import {
  BadgeCheck,
  Code2,
  Copy,
  Crown,
  ExternalLink,
  Gem,
  Image,
  MessageCircle,
  MousePointer2,
  Music2,
  RotateCcw,
  Save,
  Settings,
  Shield,
  Sparkles,
  Star,
  TerminalSquare,
  UploadCloud
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { saveThemeDraft } from "../lib/api";
import { getProfileUrl, mergeDiscordBadges, premiumBlackGlassDesign } from "../lib/constants";
import type { BackgroundType, CursorBlendMode, CursorStyle, DiscordBadge, Profile, ThemeDraft } from "../lib/types";
import { themeSchema } from "../lib/validators";
import { FileUploader } from "./FileUploader";
import { LivePreview } from "./LivePreview";
import { SliderControl } from "./SliderControl";
import { ToggleControl } from "./ToggleControl";

const inferBackgroundType = (url: string): BackgroundType => {
  if (!url) return "gradient";
  if (/\.(mp4|webm)(\?|#|$)/i.test(url)) return "video";
  if (/\.gif(\?|#|$)/i.test(url)) return "gif";
  return "image";
};

const dashboardBadgeIcon = (badge: DiscordBadge) => {
  const className = "h-3.5 w-3.5";
  if (badge.id === "custom" && /^https?:\/\//i.test(badge.icon)) {
    return <img className="h-3.5 w-3.5 rounded-full object-cover" src={badge.icon} alt="" />;
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

const draftFromProfile = (profile: Profile): ThemeDraft => ({
  ...premiumBlackGlassDesign,
  background_url: profile.background_url || premiumBlackGlassDesign.background_url,
  background_type: profile.background_type || premiumBlackGlassDesign.background_type,
  overlay_opacity: profile.overlay_opacity ?? premiumBlackGlassDesign.overlay_opacity,
  card_opacity: profile.card_opacity ?? premiumBlackGlassDesign.card_opacity,
  blur_amount: profile.blur_amount ?? premiumBlackGlassDesign.blur_amount,
  background_blur: profile.background_blur ?? premiumBlackGlassDesign.background_blur,
  background_brightness: profile.background_brightness ?? premiumBlackGlassDesign.background_brightness,
  background_saturation: profile.background_saturation ?? premiumBlackGlassDesign.background_saturation,
  music_url: profile.music_url || "",
  music_autoplay: profile.music_autoplay ?? premiumBlackGlassDesign.music_autoplay,
  music_volume: profile.music_volume ?? premiumBlackGlassDesign.music_volume,
  music_title: profile.music_title || "",
  music_artist: profile.music_artist || "",
  border_radius: profile.border_radius ?? premiumBlackGlassDesign.border_radius,
  show_views: profile.show_views,
  show_badges: profile.show_badges,
  show_music_player: profile.show_music_player,
  show_discord_widget: profile.show_discord_widget,
  discord_mode: profile.discord_mode || premiumBlackGlassDesign.discord_mode,
  discord_user_id: profile.discord_user_id || "",
  discord_username: profile.discord_username || "",
  discord_display_name: profile.discord_display_name || "",
  discord_avatar_url: profile.discord_avatar_url || "",
  discord_status_text: profile.discord_status_text || "",
  show_nitro_style_badge: profile.show_nitro_style_badge,
  discord_badges: mergeDiscordBadges(profile.discord_badges),
  discord_use_manual_fallback: profile.discord_use_manual_fallback ?? premiumBlackGlassDesign.discord_use_manual_fallback,
  discord_hide_if_empty: profile.discord_hide_if_empty ?? premiumBlackGlassDesign.discord_hide_if_empty,
  cursor_enabled: profile.cursor_enabled ?? premiumBlackGlassDesign.cursor_enabled,
  cursor_style: profile.cursor_style || premiumBlackGlassDesign.cursor_style,
  cursor_color: profile.cursor_color || premiumBlackGlassDesign.cursor_color,
  cursor_size: profile.cursor_size ?? premiumBlackGlassDesign.cursor_size,
  cursor_opacity: profile.cursor_opacity ?? premiumBlackGlassDesign.cursor_opacity,
  cursor_trail_enabled: profile.cursor_trail_enabled ?? premiumBlackGlassDesign.cursor_trail_enabled,
  cursor_trail_length: profile.cursor_trail_length ?? premiumBlackGlassDesign.cursor_trail_length,
  cursor_blur: profile.cursor_blur ?? premiumBlackGlassDesign.cursor_blur,
  cursor_blend_mode: profile.cursor_blend_mode || premiumBlackGlassDesign.cursor_blend_mode,
  card_mouse_parallax: profile.card_mouse_parallax ?? premiumBlackGlassDesign.card_mouse_parallax,
  background_mouse_parallax: profile.background_mouse_parallax ?? premiumBlackGlassDesign.background_mouse_parallax,
  particles_enabled: profile.particles_enabled
});

export const ThemeControlPanel = ({ profile, onSaved }: { profile: Profile; onSaved: () => void }) => {
  const [draft, setDraft] = useState<ThemeDraft>(draftFromProfile(profile));
  const [saving, setSaving] = useState(false);
  const [testingDiscord, setTestingDiscord] = useState(false);
  const [discordWarning, setDiscordWarning] = useState("");
  const previewProfile = useMemo(() => ({ ...profile, ...premiumBlackGlassDesign, ...draft }), [draft, profile]);

  const update = <K extends keyof ThemeDraft>(key: K, value: ThemeDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const setBackgroundUrl = (url: string) => {
    setDraft((current) => ({ ...current, background_url: url, background_type: inferBackgroundType(url) }));
  };

  const resetBackground = () => {
    setDraft((current) => ({
      ...current,
      background_type: premiumBlackGlassDesign.background_type,
      background_url: premiumBlackGlassDesign.background_url,
      background_blur: premiumBlackGlassDesign.background_blur,
      background_brightness: premiumBlackGlassDesign.background_brightness,
      background_saturation: premiumBlackGlassDesign.background_saturation,
      overlay_opacity: premiumBlackGlassDesign.overlay_opacity,
      particles_enabled: false
    }));
  };

  const save = async () => {
    const payload: ThemeDraft = {
      ...draft,
      ...premiumBlackGlassDesign,
      background_url: draft.background_url,
      background_type: draft.background_type,
      overlay_opacity: draft.overlay_opacity,
      card_opacity: draft.card_opacity,
      blur_amount: draft.blur_amount,
      background_blur: draft.background_blur,
      background_brightness: draft.background_brightness,
      background_saturation: draft.background_saturation,
      music_url: draft.music_url?.trim() || null,
      music_autoplay: draft.music_autoplay,
      music_volume: Math.min(Math.max(draft.music_volume ?? 0.25, 0), 1),
      music_title: draft.music_title?.trim() || null,
      music_artist: draft.music_artist?.trim() || null,
      border_radius: draft.border_radius,
      show_views: draft.show_views,
      show_badges: draft.show_badges,
      show_music_player: draft.show_music_player,
      show_discord_widget: draft.show_discord_widget,
      discord_mode: draft.discord_mode,
      discord_user_id: draft.discord_user_id?.trim() || null,
      discord_username: draft.discord_username?.trim() || null,
      discord_display_name: draft.discord_display_name?.trim() || null,
      discord_avatar_url: draft.discord_avatar_url?.trim() || null,
      discord_status_text: draft.discord_status_text?.trim() || null,
      show_nitro_style_badge: draft.show_nitro_style_badge,
      discord_badges: mergeDiscordBadges(draft.discord_badges).map((badge) => ({
        ...badge,
        label: badge.label.trim() || "Custom",
        icon: badge.icon.trim(),
        color: badge.color || "#f5f5f0"
      })),
      discord_use_manual_fallback: draft.discord_use_manual_fallback,
      discord_hide_if_empty: draft.discord_hide_if_empty,
      cursor_enabled: draft.cursor_enabled,
      cursor_style: draft.cursor_style,
      cursor_color: draft.cursor_color || "#ffffff",
      cursor_size: draft.cursor_size,
      cursor_opacity: Math.min(Math.max(draft.cursor_opacity ?? 0.55, 0), 1),
      cursor_trail_enabled: draft.cursor_trail_enabled,
      cursor_trail_length: draft.cursor_trail_length,
      cursor_blur: draft.cursor_blur,
      cursor_blend_mode: draft.cursor_blend_mode,
      card_mouse_parallax: draft.card_mouse_parallax,
      background_mouse_parallax: draft.background_mouse_parallax,
      particles_enabled: draft.particles_enabled
    };
    const parsed = themeSchema.safeParse(payload);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Settings are invalid");
      return;
    }
    setSaving(true);
    try {
      await saveThemeDraft(profile.id, parsed.data);
      toast.success("Changes saved");
      onSaved();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save changes");
    } finally {
      setSaving(false);
    }
  };

  const previewFilter = {
    filter: `blur(${draft.background_blur}px) brightness(${draft.background_brightness}%) saturate(${draft.background_saturation}%)`
  };
  const discordBadges = mergeDiscordBadges(draft.discord_badges);
  const enabledDiscordBadges = discordBadges.filter((badge) => badge.enabled);

  const updateDiscordBadge = (id: string, patch: Partial<DiscordBadge>) => {
    setDraft((current) => ({
      ...current,
      discord_badges: mergeDiscordBadges(current.discord_badges).map((badge) => (badge.id === id ? { ...badge, ...patch } : badge))
    }));
  };

  const testDiscordFetch = async () => {
    if (!draft.discord_user_id?.trim()) {
      toast.error("Enter a Discord user ID first");
      return;
    }
    setTestingDiscord(true);
    try {
      const response = await fetch(`https://api.lanyard.rest/v1/users/${encodeURIComponent(draft.discord_user_id.trim())}`);
      const payload = await response.json();
      if (!response.ok || !payload?.success) throw new Error("No Lanyard presence found");
      setDiscordWarning("");
      toast.success(`Lanyard found ${payload.data?.discord_user?.username || "this user"}`);
    } catch (error) {
      setDiscordWarning("No live Discord presence found. Join the Lanyard Discord server or fill manual Discord details.");
      toast.error(error instanceof Error ? error.message : "Could not fetch Lanyard presence");
    } finally {
      setTestingDiscord(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_520px]">
      <div className="space-y-6">
        <section className="glass-panel rounded-[2rem] p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="label">Visual Identity</p>
              <h2 className="heading text-2xl">Premium Black Glass</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-luxury-muted">
                One fixed black glass system with subtle gold accents. Media and layout are customizable; the app theme is not.
              </p>
            </div>
            <div className="hidden h-14 w-14 rounded-full border border-white/10 bg-luxury-secondary shadow-soft-glow sm:block" />
          </div>
        </section>

        <section className="glass-panel rounded-[2rem] p-6">
          <div className="mb-5 flex items-center gap-3">
            <Image className="h-5 w-5 text-luxury-accent" />
            <h2 className="heading text-xl">Background</h2>
          </div>

          <div className="mb-5 overflow-hidden rounded-2xl border border-white/10 bg-luxury-secondary">
            <div className="relative h-52">
              {draft.background_type === "video" && draft.background_url ? (
                <video src={draft.background_url} className="h-full w-full scale-105 object-cover" style={previewFilter} autoPlay muted loop playsInline />
              ) : draft.background_type !== "gradient" && draft.background_url ? (
                <img src={draft.background_url} alt="" className="h-full w-full scale-105 object-cover" style={previewFilter} />
              ) : (
                <div className="h-full w-full animate-gradient bg-[linear-gradient(125deg,#000000,#070707,#111111,#000000)] bg-[length:260%_260%]" />
              )}
              <div className="absolute inset-0 bg-black" style={{ opacity: draft.overlay_opacity }} />
              {draft.particles_enabled && <div className="absolute inset-0 bg-void-grid [background-size:36px_36px] opacity-25" />}
              <div className="absolute bottom-4 left-4 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs font-semibold text-luxury-text backdrop-blur-xl">
                Preview
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
            <div className="space-y-4">
              <label>
                <span className="label">Background type</span>
                <select className="field" value={draft.background_type} onChange={(event) => update("background_type", event.target.value as BackgroundType)}>
                  <option value="gradient">Animated CSS gradient</option>
                  <option value="image">Image URL or upload</option>
                  <option value="gif">GIF URL or upload</option>
                  <option value="video">MP4/WebM URL or upload</option>
                </select>
              </label>
              <label>
                <span className="label">Image, GIF, MP4, or WebM URL</span>
                <input className="field" value={draft.background_type === "gradient" ? "" : draft.background_url || ""} onChange={(event) => setBackgroundUrl(event.target.value)} placeholder="https://..." />
              </label>
              <p className="text-sm leading-6 text-luxury-muted">
                Use MP4/WebM for animated backgrounds. Use royalty-free or owned assets only.
              </p>
              <p className="text-xs leading-5 text-luxury-muted">
                Use your own assets or royalty-free assets from sources like Pexels, Pixabay, Unsplash, or Mixkit. Do not upload copyrighted or watermarked media unless you have permission.
              </p>
            </div>
            <div className="space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-luxury-text">
                  <UploadCloud className="h-4 w-4 text-luxury-accent" />
                  Upload media
                </div>
                <div className="space-y-3">
                  <FileUploader kind="background" userId={profile.id} label="Upload image or GIF" onUploaded={setBackgroundUrl} />
                  <FileUploader kind="background" userId={profile.id} label="Upload MP4/WebM video" onUploaded={setBackgroundUrl} />
                </div>
              </div>
              <button className="btn-secondary w-full" onClick={resetBackground} type="button">
                <RotateCcw className="h-4 w-4" />
                Reset background
              </button>
              <button className="btn-primary w-full" onClick={save} disabled={saving} type="button">
                <Save className="h-4 w-4" />
                Save background
              </button>
            </div>
          </div>
        </section>

        <section className="glass-panel rounded-[2rem] p-6">
          <h2 className="heading mb-4 text-xl">Background Filters</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <SliderControl label="Overlay opacity" value={draft.overlay_opacity} min={0.25} max={0.85} step={0.05} onChange={(value) => update("overlay_opacity", value)} />
            <SliderControl label="Blur intensity" value={draft.background_blur} min={0} max={24} onChange={(value) => update("background_blur", value)} />
            <SliderControl label="Brightness" value={draft.background_brightness} min={30} max={120} onChange={(value) => update("background_brightness", value)} />
            <SliderControl label="Saturation" value={draft.background_saturation} min={0} max={180} onChange={(value) => update("background_saturation", value)} />
          </div>
          <div className="mt-3">
            <ToggleControl label="Subtle noise overlay" checked={draft.particles_enabled} onChange={(value) => update("particles_enabled", value)} />
          </div>
        </section>

        <section className="glass-panel rounded-[2rem] p-6">
          <h2 className="heading mb-4 text-xl">Profile Display</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <ToggleControl label="Show views" checked={draft.show_views} onChange={(value) => update("show_views", value)} />
            <ToggleControl label="Show badges" checked={draft.show_badges} onChange={(value) => update("show_badges", value)} />
          </div>
        </section>

        <section className="glass-panel rounded-[2rem] p-6">
          <div className="mb-5 flex items-center gap-3">
            <Music2 className="h-5 w-5 text-white/80" />
            <h2 className="heading text-xl">Music</h2>
          </div>
          <div className="grid gap-4">
            <label>
              <span className="label">Music URL</span>
              <input className="field" value={draft.music_url || ""} onChange={(event) => update("music_url", event.target.value)} placeholder="https://.../track.mp3" />
            </label>
            <FileUploader kind="music" userId={profile.id} label="Upload music up to 20MB" onUploaded={(url) => update("music_url", url)} />
            <div className="grid gap-3 md:grid-cols-2">
              <label>
                <span className="label">Music title</span>
                <input className="field" value={draft.music_title || ""} onChange={(event) => update("music_title", event.target.value)} placeholder="Now playing" />
              </label>
              <label>
                <span className="label">Music artist</span>
                <input className="field" value={draft.music_artist || ""} onChange={(event) => update("music_artist", event.target.value)} placeholder="Artist" />
              </label>
            </div>
            <ToggleControl label="Autoplay music" checked={draft.music_autoplay} onChange={(value) => update("music_autoplay", value)} />
            <SliderControl
              label="Default volume"
              value={Math.round((draft.music_volume ?? 0.25) * 100)}
              min={0}
              max={100}
              onChange={(value) => update("music_volume", value / 100)}
            />
            <p className="text-xs leading-5 text-luxury-muted">
              Autoplay starts at the saved volume. If the browser blocks audio, visitors will see a clean tap-to-play prompt.
            </p>
          </div>
        </section>

        <section className="glass-panel rounded-[2rem] p-6">
          <div className="mb-5 flex items-center gap-3">
            <MessageCircle className="h-5 w-5 text-white/80" />
            <h2 className="heading text-xl">Discord Identity</h2>
          </div>
          <div className="grid gap-4">
            <ToggleControl label="Show Discord widget" checked={draft.show_discord_widget} onChange={(value) => update("show_discord_widget", value)} />
            <label>
              <span className="label">Mode</span>
              <select className="field" value={draft.discord_mode} onChange={(event) => update("discord_mode", event.target.value as ThemeDraft["discord_mode"])}>
                <option value="manual">Manual</option>
                <option value="lanyard">Live presence with Lanyard</option>
              </select>
            </label>
            <div className="grid gap-3 md:grid-cols-2">
              <label>
                <span className="label">Discord user ID</span>
                <input className="field" value={draft.discord_user_id || ""} onChange={(event) => update("discord_user_id", event.target.value)} placeholder="1234567890" />
              </label>
              <button className="btn-secondary self-end" onClick={testDiscordFetch} disabled={testingDiscord} type="button">
                {testingDiscord ? "Testing..." : "Test Discord fetch"}
              </button>
              <label>
                <span className="label">Discord username</span>
                <input className="field" value={draft.discord_username || ""} onChange={(event) => update("discord_username", event.target.value)} placeholder="username" />
              </label>
              <label>
                <span className="label">Display name</span>
                <input className="field" value={draft.discord_display_name || ""} onChange={(event) => update("discord_display_name", event.target.value)} placeholder="Display name" />
              </label>
              <label>
                <span className="label">Avatar URL</span>
                <input className="field" value={draft.discord_avatar_url || ""} onChange={(event) => update("discord_avatar_url", event.target.value)} placeholder="https://..." />
              </label>
              <label className="md:col-span-2">
                <span className="label">Status text</span>
                <input className="field" value={draft.discord_status_text || ""} onChange={(event) => update("discord_status_text", event.target.value)} placeholder="Available for collaborations" />
              </label>
            </div>
            <ToggleControl label="Show Nitro-style premium badge" checked={draft.show_nitro_style_badge} onChange={(value) => update("show_nitro_style_badge", value)} />
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-luxury-text">Discord badges</h3>
                  <p className="mt-1 text-xs leading-5 text-luxury-muted">
                    Manual visual badges only. They are not verified Discord account badges.
                  </p>
                </div>
                <div className="flex max-w-40 flex-wrap justify-end gap-1.5">
                  {enabledDiscordBadges.length > 0 ? (
                    enabledDiscordBadges.map((badge) => (
                      <span
                        key={badge.id}
                        className="grid h-7 w-7 place-items-center rounded-full border border-white/10 bg-black/35 text-white"
                        style={{ color: badge.color }}
                        title={badge.label}
                      >
                        {dashboardBadgeIcon(badge)}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-luxury-muted">No badges</span>
                  )}
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {discordBadges
                  .filter((badge) => badge.id !== "custom")
                  .map((badge) => (
                    <ToggleControl
                      key={badge.id}
                      label={`${badge.label} badge`}
                      checked={badge.enabled}
                      onChange={(value) => updateDiscordBadge(badge.id, { enabled: value })}
                    />
                  ))}
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <ToggleControl
                  label="Custom badge"
                  checked={Boolean(discordBadges.find((badge) => badge.id === "custom")?.enabled)}
                  onChange={(value) => updateDiscordBadge("custom", { enabled: value })}
                />
                <label>
                  <span className="label">Custom badge label</span>
                  <input
                    className="field"
                    value={discordBadges.find((badge) => badge.id === "custom")?.label || "Custom"}
                    onChange={(event) => updateDiscordBadge("custom", { label: event.target.value })}
                    placeholder="Custom"
                  />
                </label>
                <label className="md:col-span-2">
                  <span className="label">Custom badge icon URL</span>
                  <input
                    className="field"
                    value={discordBadges.find((badge) => badge.id === "custom")?.icon || ""}
                    onChange={(event) => updateDiscordBadge("custom", { icon: event.target.value })}
                    placeholder="https://..."
                  />
                </label>
              </div>
            </div>
            <ToggleControl label="Use manual fallback when live data is unavailable" checked={draft.discord_use_manual_fallback} onChange={(value) => update("discord_use_manual_fallback", value)} />
            <ToggleControl label="Hide Discord widget if no data" checked={draft.discord_hide_if_empty} onChange={(value) => update("discord_hide_if_empty", value)} />
            {draft.show_discord_widget && (discordWarning || (!draft.discord_user_id && !draft.discord_display_name && !draft.discord_username && !draft.discord_avatar_url && !draft.discord_status_text)) && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-luxury-muted">
                {discordWarning || "No live Discord presence found. Join the Lanyard Discord server or fill manual Discord details."}
              </div>
            )}
            <a
              className="btn-secondary w-full"
              href={draft.discord_user_id ? `https://api.lanyard.rest/v1/users/${encodeURIComponent(draft.discord_user_id)}` : "https://api.lanyard.rest/v1/users/"}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
              Open Lanyard API test
            </a>
            <p className="text-xs leading-5 text-luxury-muted">
              Live presence requires joining the Lanyard Discord server and using your Discord user ID.
            </p>
          </div>
        </section>

        <section className="glass-panel rounded-[2rem] p-6">
          <div className="mb-5 flex items-center gap-3">
            <MousePointer2 className="h-5 w-5 text-white/80" />
            <h2 className="heading text-xl">Mouse Effects</h2>
          </div>
          <div className="grid gap-4">
            <ToggleControl label="Enable mouse effect" checked={draft.cursor_enabled} onChange={(value) => update("cursor_enabled", value)} />
            <div className="grid gap-3 md:grid-cols-2">
              <label>
                <span className="label">Cursor style</span>
                <select className="field" value={draft.cursor_style} onChange={(event) => update("cursor_style", event.target.value as CursorStyle)}>
                  <option value="soft-glow">Soft glow</option>
                  <option value="ring">Ring</option>
                  <option value="dot-ring">Dot ring</option>
                  <option value="spotlight">Spotlight</option>
                  <option value="smoke">Smoke</option>
                  <option value="minimal">Minimal</option>
                </select>
              </label>
              <label>
                <span className="label">Blend mode</span>
                <select className="field" value={draft.cursor_blend_mode} onChange={(event) => update("cursor_blend_mode", event.target.value as CursorBlendMode)}>
                  <option value="normal">Normal</option>
                  <option value="screen">Screen</option>
                  <option value="lighten">Lighten</option>
                  <option value="difference">Difference</option>
                </select>
              </label>
              <label>
                <span className="label">Cursor color</span>
                <input className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] p-2" type="color" value={draft.cursor_color} onChange={(event) => update("cursor_color", event.target.value)} />
              </label>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <SliderControl label="Cursor size" value={draft.cursor_size} min={6} max={96} onChange={(value) => update("cursor_size", value)} />
              <SliderControl label="Opacity" value={Math.round((draft.cursor_opacity ?? 0.55) * 100)} min={0} max={100} onChange={(value) => update("cursor_opacity", value / 100)} />
              <SliderControl label="Trail length" value={draft.cursor_trail_length} min={0} max={18} onChange={(value) => update("cursor_trail_length", value)} />
              <SliderControl label="Blur" value={draft.cursor_blur} min={0} max={60} onChange={(value) => update("cursor_blur", value)} />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <ToggleControl label="Cursor trail" checked={draft.cursor_trail_enabled} onChange={(value) => update("cursor_trail_enabled", value)} />
              <ToggleControl label="Card mouse parallax" checked={draft.card_mouse_parallax} onChange={(value) => update("card_mouse_parallax", value)} />
              <ToggleControl label="Background mouse parallax" checked={draft.background_mouse_parallax} onChange={(value) => update("background_mouse_parallax", value)} />
            </div>
          </div>
        </section>

        <section className="glass-panel rounded-[2rem] p-6">
          <h2 className="heading mb-4 text-xl">Card Layout</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <SliderControl label="Card opacity" value={draft.card_opacity} min={0.45} max={0.78} step={0.05} onChange={(value) => update("card_opacity", value)} />
            <SliderControl label="Card blur" value={draft.blur_amount} min={12} max={36} onChange={(value) => update("blur_amount", value)} />
            <SliderControl label="Border radius" value={draft.border_radius} min={18} max={34} onChange={(value) => update("border_radius", value)} />
          </div>
        </section>
      </div>

      <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
        <LivePreview profile={previewProfile} />
        <div className="grid gap-3 sm:grid-cols-2">
          <button className="btn-primary" onClick={save} disabled={saving} type="button">
            <Save className="h-4 w-4" />
            Save Changes
          </button>
          <button className="btn-secondary" onClick={() => setDraft(draftFromProfile(profile))} type="button">
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
          <button
            className="btn-secondary"
            onClick={() => {
              navigator.clipboard.writeText(getProfileUrl(profile));
              toast.success("Profile link copied");
            }}
            type="button"
          >
            <Copy className="h-4 w-4" />
            Copy profile link
          </button>
          <a className="btn-secondary" href={getProfileUrl(profile)} target="_blank" rel="noreferrer">
            <ExternalLink className="h-4 w-4" />
            Open public profile
          </a>
        </div>
      </aside>
    </div>
  );
};
