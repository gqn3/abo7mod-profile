import { BarChart3, Brush, Home, Link2, LogOut, Shield, UserRound, UsersRound } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { cn } from "../lib/ui";
import { Logo } from "./Logo";

const navItems = [
  { to: "/dashboard", label: "Overview", icon: Home },
  { to: "/dashboard/control", label: "Control", icon: Brush },
  { to: "/dashboard/profile", label: "Profile", icon: UserRound },
  { to: "/dashboard/links", label: "Links", icon: Link2 },
  { to: "/dashboard/socials", label: "Socials", icon: UsersRound },
  { to: "/dashboard/analytics", label: "Analytics", icon: BarChart3 }
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const { isAdminEmail } = useAuth();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-white/10 bg-luxury-bg/75 px-4 py-5 backdrop-blur-2xl lg:block">
      <Logo to="/" className="mb-8 px-3" />
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/dashboard"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-luxury-muted transition hover:bg-white/[0.06] hover:text-luxury-text",
                isActive && "bg-luxury-accent/12 text-luxury-text ring-1 ring-luxury-accent/25"
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
        {isAdminEmail && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-luxury-muted transition hover:bg-white/[0.06] hover:text-luxury-text",
                isActive && "bg-luxury-accent/12 text-luxury-text ring-1 ring-luxury-accent/25"
              )
            }
          >
            <Shield className="h-4 w-4" />
            Admin
          </NavLink>
        )}
      </nav>
      <button
        className="absolute bottom-5 left-4 right-4 flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-luxury-muted transition hover:border-luxury-accent/30 hover:bg-luxury-accent/10 hover:text-luxury-text"
        onClick={async () => {
          await supabase.auth.signOut();
          navigate("/");
        }}
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </aside>
  );
};
