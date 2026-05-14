import { useCallback, useEffect, useState } from "react";
import { SocialManager } from "../components/SocialManager";
import { useDashboardProfile } from "../hooks/useDashboardProfile";
import { getOwnerData } from "../lib/api";
import type { SocialItem } from "../lib/types";

export const SocialsPage = () => {
  const { profile, loading } = useDashboardProfile();
  const [socials, setSocials] = useState<SocialItem[]>([]);
  const load = useCallback(() => profile && getOwnerData(profile.id).then((data) => setSocials(data.socials)), [profile]);
  useEffect(() => { load(); }, [load]);
  if (loading || !profile) return <div className="glass-panel rounded-[2rem] p-8 text-luxury-muted">Loading socials...</div>;
  return <SocialManager profileId={profile.id} socials={socials} onChange={load} />;
};
