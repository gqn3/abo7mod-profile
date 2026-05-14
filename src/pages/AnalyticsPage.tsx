import { useEffect, useState } from "react";
import { AnalyticsChart } from "../components/AnalyticsChart";
import { useDashboardProfile } from "../hooks/useDashboardProfile";
import { analyticsSummary, groupByCount } from "../lib/analytics";
import { getOwnerData } from "../lib/api";
import type { ProfileView } from "../lib/types";

export const AnalyticsPage = () => {
  const { profile, loading } = useDashboardProfile();
  const [views, setViews] = useState<ProfileView[]>([]);
  useEffect(() => { if (profile) getOwnerData(profile.id).then((data) => setViews(data.views)); }, [profile]);
  if (loading || !profile) return <div className="glass-panel rounded-[2rem] p-8 text-luxury-muted">Loading analytics...</div>;
  const summary = analyticsSummary(views);
  const referrers = groupByCount(views, "referrer");
  const devices = groupByCount(views, "device");

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {[["Total views", summary.total], ["Views today", summary.today], ["Last 7 days", summary.last7], ["Last 30 days", summary.last30]].map(([label, value]) => (
          <div key={label} className="glass-panel rounded-[2rem] p-5"><p className="heading text-3xl">{value}</p><p className="mt-1 text-sm text-luxury-muted">{label}</p></div>
        ))}
      </div>
      <AnalyticsChart data={summary.days} />
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="glass-panel rounded-[2rem] p-5"><h2 className="heading mb-4 text-lg">Referrers</h2>{referrers.map((item) => <p key={item.name} className="flex justify-between border-t border-white/10 py-3 text-sm text-luxury-muted"><span>{item.name}</span><span>{item.value}</span></p>)}</section>
        <section className="glass-panel rounded-[2rem] p-5"><h2 className="heading mb-4 text-lg">Devices</h2>{devices.map((item) => <p key={item.name} className="flex justify-between border-t border-white/10 py-3 text-sm text-luxury-muted"><span>{item.name}</span><span>{item.value}</span></p>)}</section>
      </div>
    </div>
  );
};
