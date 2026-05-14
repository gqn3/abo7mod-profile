import { supabase } from "./supabase";
import type { Badge, LinkItem, Profile, ProfileBundle, ProfileView, SocialItem, ThemeDraft } from "./types";
import { createVisitorHash, getBrowser, getDevice } from "./security";
import { premiumBlackGlassDesign } from "./constants";

export const createInitialProfile = async (userId: string, email: string) => {
  const base = email.split("@")[0]?.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 18) || "void";
  const username = `${base}${Math.floor(Math.random() * 9000 + 1000)}`;
  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      username,
      profile_slug: null,
      display_name: username,
      ...premiumBlackGlassDesign
    })
    .select()
    .single();
  if (error) throw error;
  return data as Profile;
};

export const getMyProfile = async (userId: string) => {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) throw error;
  return data as Profile | null;
};

export const getPublicProfileBundle = async (handle: string): Promise<ProfileBundle | null> => {
  const normalizedHandle = handle.toLowerCase();
  const { data: usernameProfile, error: usernameError } = await supabase.from("profiles").select("*").eq("username", normalizedHandle).maybeSingle();
  if (usernameError) throw usernameError;

  let profile = usernameProfile;
  if (!profile) {
    const { data: slugProfile, error: slugError } = await supabase.from("profiles").select("*").eq("profile_slug", normalizedHandle).maybeSingle();
    if (slugError) throw slugError;
    profile = slugProfile;
  }
  if (!profile) return null;

  const typedProfile = profile as Profile;
  const [{ data: links }, { data: socials }, { data: badgeRows }, { count }] = await Promise.all([
    supabase
      .from("links")
      .select("*")
      .eq("profile_id", typedProfile.id)
      .eq("is_visible", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("socials")
      .select("*")
      .eq("profile_id", typedProfile.id)
      .eq("is_visible", true)
      .order("sort_order", { ascending: true }),
    supabase.from("profile_badges").select("profile_id,badge_id,badges(*)").eq("profile_id", typedProfile.id),
    supabase.from("profile_views").select("*", { count: "exact", head: true }).eq("profile_id", typedProfile.id)
  ]);

  const badges = ((badgeRows || []) as Array<{ badges: Badge | Badge[] | null }>)
    .flatMap((row) => (Array.isArray(row.badges) ? row.badges : row.badges ? [row.badges] : []))
    .filter(Boolean);

  return {
    profile: typedProfile,
    links: (links || []) as LinkItem[],
    socials: (socials || []) as SocialItem[],
    badges,
    viewCount: count || 0
  };
};

export const recordProfileView = async (profileId: string) => {
  const visitor_hash = await createVisitorHash(profileId);
  await supabase.from("profile_views").insert({
    profile_id: profileId,
    visitor_hash,
    user_agent: navigator.userAgent.slice(0, 400),
    referrer: document.referrer ? new URL(document.referrer).hostname : null,
    device: getDevice(),
    browser: getBrowser()
  });
};

export const saveThemeDraft = async (profileId: string, draft: ThemeDraft) => {
  const { error } = await supabase
    .from("profiles")
    .update({ ...draft, updated_at: new Date().toISOString() })
    .eq("id", profileId);
  if (error) throw error;
};

export const getOwnerData = async (profileId: string) => {
  const [{ data: links }, { data: socials }, { data: views }] = await Promise.all([
    supabase.from("links").select("*").eq("profile_id", profileId).order("sort_order", { ascending: true }),
    supabase.from("socials").select("*").eq("profile_id", profileId).order("sort_order", { ascending: true }),
    supabase.from("profile_views").select("*").eq("profile_id", profileId).order("created_at", { ascending: false }).limit(500)
  ]);
  return {
    links: (links || []) as LinkItem[],
    socials: (socials || []) as SocialItem[],
    views: (views || []) as ProfileView[]
  };
};
