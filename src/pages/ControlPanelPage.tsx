import { ThemeControlPanel } from "../components/ThemeControlPanel";
import { useDashboardProfile } from "../hooks/useDashboardProfile";

export const ControlPanelPage = () => {
  const { profile, loading, refresh } = useDashboardProfile();
  if (loading || !profile) return <div className="glass-panel rounded-[2rem] p-8 text-luxury-muted">Loading control panel...</div>;
  return <ThemeControlPanel profile={profile} onSaved={refresh} />;
};
