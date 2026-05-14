import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";
import type { Badge, Profile } from "../lib/types";
import { badgeSchema } from "../lib/validators";

export const AdminBadgeManager = ({ badges, profiles, onChange }: { badges: Badge[]; profiles: Profile[]; onChange: () => void }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [selectedProfile, setSelectedProfile] = useState("");
  const [selectedBadge, setSelectedBadge] = useState("");
  const [reserved, setReserved] = useState("");

  const createBadge = async () => {
    const parsed = badgeSchema.safeParse({ name, description, color });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Invalid badge");
      return;
    }
    const { error } = await supabase.from("badges").insert(parsed.data);
    if (error) toast.error(error.message);
    else {
      toast.success("Badge created");
      setName("");
      setDescription("");
      onChange();
    }
  };

  return (
    <section className="glass-panel rounded-[2rem] p-5">
      <h2 className="heading mb-4 text-lg">Badges and Reserved Names</h2>
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-3">
          <input className="field" placeholder="Badge name" value={name} onChange={(event) => setName(event.target.value)} />
          <input className="field" placeholder="Description" value={description} onChange={(event) => setDescription(event.target.value)} />
          <input type="color" className="h-12 w-full rounded-2xl bg-transparent" value={color} onChange={(event) => setColor(event.target.value)} />
          <button className="btn-primary w-full" onClick={createBadge} type="button"><Plus className="h-4 w-4" /> Create badge</button>
        </div>
        <div className="space-y-3">
          <select className="field" value={selectedProfile} onChange={(event) => setSelectedProfile(event.target.value)}>
            <option value="">Profile</option>
            {profiles.map((profile) => <option key={profile.id} value={profile.id}>@{profile.username}</option>)}
          </select>
          <select className="field" value={selectedBadge} onChange={(event) => setSelectedBadge(event.target.value)}>
            <option value="">Badge</option>
            {badges.map((badge) => <option key={badge.id} value={badge.id}>{badge.name}</option>)}
          </select>
          <button
            className="btn-primary w-full"
            onClick={async () => {
              if (!selectedProfile || !selectedBadge) return;
              const { error } = await supabase.from("profile_badges").upsert({ profile_id: selectedProfile, badge_id: selectedBadge });
              if (error) toast.error(error.message);
              else toast.success("Badge assigned");
            }}
            type="button"
          >
            Assign badge
          </button>
        </div>
        <div className="space-y-3">
          <input className="field" placeholder="Reserved username" value={reserved} onChange={(event) => setReserved(event.target.value.toLowerCase())} />
          <button
            className="btn-secondary w-full"
            onClick={async () => {
              if (!reserved) return;
              const { error } = await supabase.from("reserved_usernames").upsert({ username: reserved, reason: "Reserved by admin" });
              if (error) toast.error(error.message);
              else {
                toast.success("Username reserved");
                setReserved("");
              }
            }}
            type="button"
          >
            Reserve username
          </button>
          <div className="max-h-40 space-y-2 overflow-auto">
            {badges.map((badge) => (
              <div key={badge.id} className="flex items-center justify-between rounded-xl bg-white/[0.04] p-2 text-sm">
                <span style={{ color: badge.color }}>{badge.name}</span>
                <button onClick={async () => { await supabase.from("badges").delete().eq("id", badge.id); onChange(); }} title="Delete badge">
                <Trash2 className="h-4 w-4 text-luxury-muted" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
