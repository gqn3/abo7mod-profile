import { Route, Routes } from "react-router-dom";
import { AuthGuard } from "./components/AuthGuard";
import { DashboardLayout } from "./components/DashboardLayout";
import { AdminPage } from "./pages/AdminPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { ControlPanelPage } from "./pages/ControlPanelPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LandingPage } from "./pages/LandingPage";
import { LinksPage } from "./pages/LinksPage";
import { LoginPage } from "./pages/LoginPage";
import { ProfileSettingsPage } from "./pages/ProfileSettingsPage";
import { PublicProfilePage } from "./pages/PublicProfilePage";
import { RegisterPage } from "./pages/RegisterPage";
import { SocialsPage } from "./pages/SocialsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/u/:username" element={<PublicProfilePage />} />
      <Route element={<AuthGuard />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="control" element={<ControlPanelPage />} />
          <Route path="profile" element={<ProfileSettingsPage />} />
          <Route path="links" element={<LinksPage />} />
          <Route path="socials" element={<SocialsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>
      </Route>
      <Route element={<AuthGuard adminOnly />}>
        <Route path="/admin" element={<AdminPage />} />
      </Route>
      <Route path="/:handle" element={<PublicProfilePage />} />
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}
