import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { createInitialProfile, getMyProfile } from "../lib/api";
import type { Profile } from "../lib/types";

let cachedProfile: Profile | null = null;

export const useDashboardProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(cachedProfile);
  const [loading, setLoading] = useState(!cachedProfile);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    setLoading(true);
    getMyProfile(user.id)
      .then(async (found) => found || createInitialProfile(user.id, user.email || "user@void.local"))
      .then((next) => {
        if (!mounted) return;
        cachedProfile = next;
        setProfile(next);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [refreshKey, user]);

  return { profile, loading, refresh: () => setRefreshKey((value) => value + 1), setProfile };
};
