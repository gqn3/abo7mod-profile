import { BarChart3, Brush, CheckCircle2, Link2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ProfileCard } from "../components/ProfileCard";
import { useDashboardProfile } from "../hooks/useDashboardProfile";
import { getOwnerData } from "../lib/api";
import type { LinkItem, ProfileView, SocialItem } from "../lib/types";
import { analyticsSummary } from "../lib/analytics";

export const DashboardPage = () => {
  const { profile, loading } = useDashboardProfile();
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [socials, setSocials] = useState<SocialItem[]>([]);
  const [views, setViews] = useState<ProfileView[]>([]);

  useEffect(() => {
    if (!profile) return;
    getOwnerData(profile.id).then((data) => {
      setLinks(data.links);
      setSocials(data.socials);
      setViews(data.views);
    });
  }, [profile]);

  if (loading || !profile) return <div className="glass-panel rounded-[2rem] p-8 text-luxury-muted">Loading dashboard...</div>;
  const summary = analyticsSummary(views);
  const completion = [profile.avatar_url, profile.bio, links.length > 0, socials.length > 0, profile.background_url].filter(Boolean).length;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_430px]">
      <section className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[{ label: "Total views", value: summary.total, icon: BarChart3 }, { label: "Views today", value: summary.today, icon: BarChart3 }, { label: "Links", value: links.length, icon: Link2 }, { label: "Complete", value: `${completion}/5`, icon: CheckCircle2 }].map((stat) => (
            <div key={stat.label} className="glass-panel rounded-[2rem] p-5">
              <stat.icon className="mb-4 h-5 w-5 text-luxury-accent" />
              <p className="heading text-3xl">{stat.value}</p>
              <p className="mt-1 text-sm text-luxury-muted">{stat.label}</p>
            </div>
          ))}
        </div>
        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="heading text-2xl">Quick actions</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link className="btn-primary" to="/dashboard/control"><Brush className="h-4 w-4" /> Customize</Link>
            <Link className="btn-secondary" to="/dashboard/links"><Link2 className="h-4 w-4" /> Manage links</Link>
          </div>
        </div>
        <div className="glass-panel rounded-[2rem] p-6">
          <h2 className="heading text-2xl">Profile completion</h2>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/[0.08]">
            <div className="h-full rounded-full bg-luxury-accent" style={{ width: `${(completion / 5) * 100}%` }} />
          </div>
        </div>
      </section>
      <ProfileCard bundle={{ profile, links, socials, badges: [], viewCount: summary.total }} />
    </div>
  );
};
