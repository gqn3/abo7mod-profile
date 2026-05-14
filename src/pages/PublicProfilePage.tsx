import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { demoProfile, reservedUsernames } from "../lib/constants";
import { getPublicProfileBundle, recordProfileView } from "../lib/api";
import type { ProfileBundle } from "../lib/types";
import { PublicProfileRenderer } from "../components/PublicProfileRenderer";

export const PublicProfilePage = () => {
  const { username, handle } = useParams();
  const profileHandle = (username || handle || "").toLowerCase();
  const isShortRoute = Boolean(handle);
  const [bundle, setBundle] = useState<ProfileBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [reserved, setReserved] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setReserved(false);
    if (isShortRoute && reservedUsernames.includes(profileHandle)) {
      setBundle(null);
      setReserved(true);
      setLoading(false);
      return;
    }
    if (profileHandle === "demo") {
      setBundle({ profile: demoProfile, links: [], socials: [], badges: [], viewCount: 1284 });
      setLoading(false);
      return;
    }
    getPublicProfileBundle(profileHandle)
      .then((data) => {
        if (!mounted) return;
        setBundle(data);
        if (data && !data.profile.disabled) void recordProfileView(data.profile.id);
        if (data?.profile.seo_title) document.title = data.profile.seo_title;
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [isShortRoute, profileHandle]);

  if (loading) {
    return <div className="luxury-page grid place-items-center text-luxury-muted"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  if (reserved) {
    return <div className="luxury-page grid place-items-center px-4 text-center"><div><h1 className="heading text-3xl">Short link reserved</h1><p className="mt-2 text-luxury-muted">That address is reserved for the app.</p></div></div>;
  }

  if (!bundle || bundle.profile.disabled) {
    return <div className="luxury-page grid place-items-center px-4 text-center"><div><h1 className="heading text-3xl">Profile unavailable</h1><p className="mt-2 text-luxury-muted">This profile is not public right now.</p></div></div>;
  }

  return <PublicProfileRenderer bundle={bundle} />;
};
