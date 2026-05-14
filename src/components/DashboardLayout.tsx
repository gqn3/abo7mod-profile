import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useDashboardProfile } from "../hooks/useDashboardProfile";

export const DashboardLayout = () => {
  const { profile } = useDashboardProfile();

  return (
    <div className="luxury-page">
      <Sidebar />
      <Topbar profile={profile} />
      <main className="px-4 py-6 lg:ml-72 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};
