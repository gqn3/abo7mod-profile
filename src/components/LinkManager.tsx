import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";
import { linkSchema } from "../lib/validators";
import type { LinkItem } from "../lib/types";

const icons = ["link", "external", "star", "play", "music", "mail"];

export const LinkManager = ({ profileId, links, onChange }: { profileId: string; links: LinkItem[]; onChange: () => void }) => {
  const [editing, setEditing] = useState<LinkItem | null>(null);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState("link");
  const [visible, setVisible] = useState(true);

  const reset = () => {
    setEditing(null);
    setTitle("");
    setUrl("");
    setIcon("link");
    setVisible(true);
  };

  const startEdit = (link: LinkItem) => {
    setEditing(link);
    setTitle(link.title);
    setUrl(link.url);
    setIcon(link.icon || "link");
    setVisible(link.is_visible);
  };

  const save = async () => {
    const parsed = linkSchema.safeParse({ title, url, icon, button_style: "inherit", is_visible: visible });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Invalid link");
      return;
    }
    const payload = { ...parsed.data, profile_id: profileId, sort_order: editing?.sort_order ?? links.length };
    const query = editing ? supabase.from("links").update(payload).eq("id", editing.id) : supabase.from("links").insert(payload);
    const { error } = await query;
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(editing ? "Link updated" : "Link added");
    reset();
    onChange();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("links").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Link deleted");
      onChange();
    }
  };

  const move = async (link: LinkItem, direction: -1 | 1) => {
    const target = links[links.indexOf(link) + direction];
    if (!target) return;
    await Promise.all([
      supabase.from("links").update({ sort_order: target.sort_order }).eq("id", link.id),
      supabase.from("links").update({ sort_order: link.sort_order }).eq("id", target.id)
    ]);
    onChange();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
      <section className="glass-panel rounded-[2rem] p-5">
        <h2 className="heading mb-4 text-lg">{editing ? "Edit link" : "Add link"}</h2>
        <div className="space-y-4">
          <label><span className="label">Title</span><input className="field" value={title} onChange={(event) => setTitle(event.target.value)} /></label>
          <label><span className="label">URL</span><input className="field" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://example.com" /></label>
          <label><span className="label">Icon</span><select className="field" value={icon} onChange={(event) => setIcon(event.target.value)}>{icons.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="flex items-center gap-3 text-sm font-semibold text-luxury-muted"><input type="checkbox" checked={visible} onChange={(event) => setVisible(event.target.checked)} /> Enabled</label>
          <div className="flex gap-3">
            <button className="btn-primary flex-1" onClick={save} type="button"><Plus className="h-4 w-4" /> Save</button>
            {editing && <button className="btn-secondary" onClick={reset} type="button">Cancel</button>}
          </div>
        </div>
      </section>
      <section className="space-y-3">
        {links.length === 0 && <div className="glass-panel rounded-[2rem] p-8 text-center text-luxury-muted">No links yet.</div>}
        {links.map((link, index) => (
          <div key={link.id} className="glass-panel flex items-center justify-between gap-4 rounded-2xl p-4">
            <div className="min-w-0">
              <p className="truncate font-bold text-luxury-text">{link.title}</p>
              <p className="truncate text-sm text-luxury-muted">{link.url}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button className="btn-secondary px-3" onClick={() => move(link, -1)} disabled={index === 0} title="Move up"><ArrowUp className="h-4 w-4" /></button>
              <button className="btn-secondary px-3" onClick={() => move(link, 1)} disabled={index === links.length - 1} title="Move down"><ArrowDown className="h-4 w-4" /></button>
              <button className="btn-secondary px-3" onClick={() => startEdit(link)} title="Edit"><Pencil className="h-4 w-4" /></button>
              <button className="btn-secondary px-3" onClick={() => remove(link.id)} title="Delete"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};
