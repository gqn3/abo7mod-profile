import { Save } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { FileUploader } from "../components/FileUploader";
import { useDashboardProfile } from "../hooks/useDashboardProfile";
import { getProfileUrl, premiumBlackGlassDesign, siteUrl } from "../lib/constants";
import { supabase } from "../lib/supabase";
import { profileSchema } from "../lib/validators";
import type { BackgroundType } from "../lib/types";

const inferBackgroundType = (url: string): BackgroundType => {
  if (!url) return "gradient";
  if (/\.(mp4|webm)(\?|#|$)/i.test(url)) return "video";
  if (/\.gif(\?|#|$)/i.test(url)) return "gif";
  return "image";
};

export const ProfileSettingsPage = () => {
  const { profile, loading, refresh } = useDashboardProfile();
  const [form, setForm] = useState({ username: "", profile_slug: "", display_name: "", bio: "", seo_title: "", seo_description: "", og_image_url: "" });
  const [media, setMedia] = useState({ avatar_url: "", background_url: "", music_url: "" });

  useEffect(() => {
    if (!profile) return;
    setForm({
      username: profile.username,
      profile_slug: profile.profile_slug || "",
      display_name: profile.display_name || "",
      bio: profile.bio || "",
      seo_title: profile.seo_title || "",
      seo_description: profile.seo_description || "",
      og_image_url: profile.og_image_url || ""
    });
    setMedia({ avatar_url: profile.avatar_url || "", background_url: profile.background_type !== "gradient" ? profile.background_url || "" : "", music_url: profile.music_url || "" });
  }, [profile]);

  if (loading || !profile) return <div className="glass-panel rounded-[2rem] p-8 text-luxury-muted">Loading profile settings...</div>;

  const save = async (event: FormEvent) => {
    event.preventDefault();
    const parsed = profileSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Invalid profile");
      return;
    }
    const backgroundType = inferBackgroundType(media.background_url);
    const shortLink = parsed.data.profile_slug || null;
    const handlesToCheck = Array.from(new Set([parsed.data.username, shortLink].filter(Boolean)));
    if (handlesToCheck.length > 0) {
      const handleList = handlesToCheck.join(",");
      const { data: conflict, error: conflictError } = await supabase
        .from("profiles")
        .select("id")
        .or(`username.in.(${handleList}),profile_slug.in.(${handleList})`)
        .neq("id", profile.id)
        .limit(1);
      if (conflictError) {
        toast.error(conflictError.message);
        return;
      }
      if (conflict && conflict.length > 0) {
        toast.error("That username or short link is already in use");
        return;
      }
    }
    const { error } = await supabase
      .from("profiles")
      .update({
        ...parsed.data,
        profile_slug: shortLink,
        ...media,
        background_url: media.background_url || premiumBlackGlassDesign.background_url,
        background_type: backgroundType,
        updated_at: new Date().toISOString()
      })
      .eq("id", profile.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Profile saved");
      refresh();
    }
  };

  return (
    <form onSubmit={save} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="glass-panel rounded-[2rem] p-6">
        <h2 className="heading mb-5 text-2xl">Profile settings</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label><span className="label">Username</span><input className="field" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value.toLowerCase() })} /></label>
          <label>
            <span className="label">Short link</span>
            <input className="field" value={form.profile_slug} onChange={(event) => setForm({ ...form, profile_slug: event.target.value.toLowerCase() })} placeholder={profile.username} />
          </label>
          <label><span className="label">Display name</span><input className="field" value={form.display_name} onChange={(event) => setForm({ ...form, display_name: event.target.value })} /></label>
          <div className="md:col-span-2 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-luxury-muted">
            Preview: <span className="font-semibold text-luxury-text">{form.profile_slug ? `${siteUrl}/${form.profile_slug}` : getProfileUrl(profile)}</span>
          </div>
          <label className="md:col-span-2"><span className="label">Bio</span><textarea className="field min-h-28" value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} /></label>
          <label><span className="label">Custom SEO title</span><input className="field" value={form.seo_title} onChange={(event) => setForm({ ...form, seo_title: event.target.value })} /></label>
          <label><span className="label">Custom SEO description</span><input className="field" value={form.seo_description} onChange={(event) => setForm({ ...form, seo_description: event.target.value })} /></label>
          <label className="md:col-span-2"><span className="label">OG image URL</span><input className="field" value={form.og_image_url} onChange={(event) => setForm({ ...form, og_image_url: event.target.value })} /></label>
          <label className="md:col-span-2"><span className="label">Background image, GIF, MP4, or WebM URL</span><input className="field" value={media.background_url} onChange={(event) => setMedia({ ...media, background_url: event.target.value })} placeholder="https://..." /></label>
          <label className="md:col-span-2"><span className="label">Music URL</span><input className="field" value={media.music_url} onChange={(event) => setMedia({ ...media, music_url: event.target.value })} placeholder="https://..." /></label>
        </div>
        <button className="btn-primary mt-6"><Save className="h-4 w-4" /> Save profile</button>
      </section>
      <aside className="space-y-4">
        <FileUploader kind="avatar" userId={profile.id} label="Upload avatar up to 5MB" onUploaded={(url) => setMedia((current) => ({ ...current, avatar_url: url }))} />
        <FileUploader kind="background" userId={profile.id} label="Upload background up to 15MB" onUploaded={(url) => setMedia((current) => ({ ...current, background_url: url }))} />
        <FileUploader kind="music" userId={profile.id} label="Upload music up to 20MB" onUploaded={(url) => setMedia((current) => ({ ...current, music_url: url }))} />
      </aside>
    </form>
  );
};
