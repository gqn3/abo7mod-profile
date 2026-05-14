import { demoProfile } from "../lib/constants";
import type { LinkItem, Profile, ProfileBundle, SocialItem, Badge } from "../lib/types";
import { PublicProfileRenderer } from "./PublicProfileRenderer";

const sampleLinks: LinkItem[] = [
  { id: "1", profile_id: "demo", title: "Portfolio", url: "https://example.com", icon: "external", button_style: "inherit", sort_order: 0, is_visible: true, created_at: "" },
  { id: "2", profile_id: "demo", title: "Latest drop", url: "https://example.com", icon: "star", button_style: "inherit", sort_order: 1, is_visible: true, created_at: "" }
];

const sampleSocials: SocialItem[] = [
  { id: "s1", profile_id: "demo", platform: "GitHub", url: "https://github.com", sort_order: 0, is_visible: true },
  { id: "s2", profile_id: "demo", platform: "Instagram", url: "https://instagram.com", sort_order: 1, is_visible: true }
];

const sampleBadges: Badge[] = [{ id: "b1", name: "Founder", description: "Original member", icon_url: null, color: "#d7b46a", created_at: "" }];

export const LivePreview = ({ profile }: { profile?: Profile }) => {
  const bundle: ProfileBundle = {
    profile: profile || demoProfile,
    links: sampleLinks,
    socials: sampleSocials,
    badges: sampleBadges,
    viewCount: 1284
  };

  return (
    <div className="h-[720px] overflow-hidden rounded-[2rem] border border-white/10 bg-luxury-bg shadow-luxury">
      <div className="scale-[0.86] origin-top">
        <PublicProfileRenderer bundle={bundle} preview />
      </div>
    </div>
  );
};
