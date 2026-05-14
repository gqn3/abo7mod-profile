import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminBadgeManager } from "../components/AdminBadgeManager";
import { AdminProfilesTable } from "../components/AdminProfilesTable";
import { Logo } from "../components/Logo";
import { supabase } from "../lib/supabase";
import type { Badge, Profile } from "../lib/types";

export const AdminPage = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const load = async () => {
    const [{ data: profileRows }, { data: badgeRows }] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(250),
      supabase.from("badges").select("*").order("created_at", { ascending: false })
    ]);
    setProfiles((profileRows || []) as Profile[]);
    setBadges((badgeRows || []) as Badge[]);
  };
  useEffect(() => { load(); }, []);

  return (
    <div className="luxury-page px-4 py-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Logo to="/" className="mb-6" />
            <h1 className="heading text-3xl">Admin panel</h1>
            <p className="mt-1 text-luxury-muted">RLS-backed administration without frontend service keys.</p>
          </div>
          <Link className="btn-secondary" to="/dashboard"><ArrowLeft className="h-4 w-4" /> Dashboard</Link>
        </div>
        <AdminProfilesTable profiles={profiles} onChange={load} />
        <AdminBadgeManager profiles={profiles} badges={badges} onChange={load} />
      </div>
    </div>
  );
};
