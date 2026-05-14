import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";
import type { Profile } from "../lib/types";

export const AdminProfilesTable = ({ profiles, onChange }: { profiles: Profile[]; onChange: () => void }) => {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => profiles.filter((profile) => `${profile.username} ${profile.display_name || ""}`.toLowerCase().includes(query.toLowerCase())),
    [profiles, query]
  );

  return (
    <section className="glass-panel rounded-[2rem] p-5">
      <div className="mb-4 flex items-center gap-3">
        <Search className="h-4 w-4 text-luxury-muted" />
        <input className="field" placeholder="Search profiles" value={query} onChange={(event) => setQuery(event.target.value)} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs uppercase tracking-[0.18em] text-luxury-muted">
            <tr><th className="p-3">Username</th><th className="p-3">Name</th><th className="p-3">Created</th><th className="p-3">Status</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {filtered.map((profile) => (
              <tr key={profile.id} className="border-t border-white/10">
                <td className="p-3 font-bold">@{profile.username}</td>
                <td className="p-3 text-luxury-muted">{profile.display_name}</td>
                <td className="p-3 text-luxury-muted">{new Date(profile.created_at).toLocaleDateString()}</td>
                <td className="p-3">{profile.disabled ? "Disabled" : "Live"}</td>
                <td className="p-3 text-right">
                  <button
                    className="btn-secondary"
                    onClick={async () => {
                      const { error } = await supabase.from("profiles").update({ disabled: !profile.disabled }).eq("id", profile.id);
                      if (error) toast.error(error.message);
                      else {
                        toast.success(profile.disabled ? "Profile enabled" : "Profile disabled");
                        onChange();
                      }
                    }}
                    type="button"
                  >
                    {profile.disabled ? "Enable" : "Disable"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
