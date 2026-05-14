import { useCallback, useEffect, useState } from "react";
import { LinkManager } from "../components/LinkManager";
import { useDashboardProfile } from "../hooks/useDashboardProfile";
import { getOwnerData } from "../lib/api";
import type { LinkItem } from "../lib/types";

export const LinksPage = () => {
  const { profile, loading } = useDashboardProfile();
  const [links, setLinks] = useState<LinkItem[]>([]);
  const load = useCallback(() => profile && getOwnerData(profile.id).then((data) => setLinks(data.links)), [profile]);
  useEffect(() => { load(); }, [load]);
  if (loading || !profile) return <div className="glass-panel rounded-[2rem] p-8 text-luxury-muted">Loading links...</div>;
  return <LinkManager profileId={profile.id} links={links} onChange={load} />;
};
