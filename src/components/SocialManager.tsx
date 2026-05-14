import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { socialPlatforms } from "../lib/constants";
import { supabase } from "../lib/supabase";
import type { SocialItem } from "../lib/types";
import { socialSchema } from "../lib/validators";

export const SocialManager = ({ profileId, socials, onChange }: { profileId: string; socials: SocialItem[]; onChange: () => void }) => {
  const [editing, setEditing] = useState<SocialItem | null>(null);
  const [platform, setPlatform] = useState("Discord");
  const [url, setUrl] = useState("");
  const [visible, setVisible] = useState(true);

  const reset = () => {
    setEditing(null);
    setPlatform("Discord");
    setUrl("");
    setVisible(true);
  };

  const save = async () => {
    const parsed = socialSchema.safeParse({ platform, url, is_visible: visible });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Invalid social link");
      return;
    }
    const payload = { ...parsed.data, profile_id: profileId, sort_order: editing?.sort_order ?? socials.length };
    const query = editing ? supabase.from("socials").update(payload).eq("id", editing.id) : supabase.from("socials").insert(payload);
    const { error } = await query;
    if (error) toast.error(error.message);
    else {
      toast.success("Social saved");
      reset();
      onChange();
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
      <section className="glass-panel rounded-[2rem] p-5">
        <h2 className="heading mb-4 text-lg">{editing ? "Edit social" : "Add social"}</h2>
        <div className="space-y-4">
          <label><span className="label">Platform</span><select className="field" value={platform} onChange={(event) => setPlatform(event.target.value)}>{socialPlatforms.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span className="label">URL</span><input className="field" value={url} onChange={(event) => setUrl(event.target.value)} /></label>
          <label className="flex items-center gap-3 text-sm font-semibold text-luxury-muted"><input type="checkbox" checked={visible} onChange={(event) => setVisible(event.target.checked)} /> Enabled</label>
          <button className="btn-primary w-full" onClick={save} type="button"><Plus className="h-4 w-4" /> Save</button>
        </div>
      </section>
      <section className="space-y-3">
        {socials.length === 0 && <div className="glass-panel rounded-[2rem] p-8 text-center text-luxury-muted">No socials yet.</div>}
        {socials.map((social) => (
          <div key={social.id} className="glass-panel flex items-center justify-between gap-4 rounded-2xl p-4">
            <div className="min-w-0">
              <p className="font-bold text-luxury-text">{social.platform}</p>
              <p className="truncate text-sm text-luxury-muted">{social.url}</p>
            </div>
            <div className="flex gap-2">
              <button className="btn-secondary px-3" onClick={() => { setEditing(social); setPlatform(social.platform); setUrl(social.url); setVisible(social.is_visible); }}><Pencil className="h-4 w-4" /></button>
              <button className="btn-secondary px-3" onClick={async () => { await supabase.from("socials").delete().eq("id", social.id); onChange(); }}><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};
