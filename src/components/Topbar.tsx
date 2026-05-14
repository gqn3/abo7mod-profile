import { ExternalLink, Menu, Sparkles } from "lucide-react";
import { NavLink } from "react-router-dom";
import { getProfileUrl } from "../lib/constants";
import type { Profile } from "../lib/types";
import { Logo } from "./Logo";

export const Topbar = ({ profile }: { profile?: Profile | null }) => (
  <header className="sticky top-0 z-20 border-b border-white/10 bg-luxury-bg/75 px-4 py-4 backdrop-blur-2xl lg:ml-72 lg:px-8">
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Menu className="h-5 w-5 text-luxury-muted lg:hidden" />
        <Logo compact className="lg:hidden" />
        <div>
          <p className="text-sm font-semibold text-luxury-muted">Dashboard</p>
          <h1 className="heading text-xl">Abo7mod Studio</h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <NavLink to="/dashboard/control" className="btn-secondary hidden sm:inline-flex">
          <Sparkles className="h-4 w-4" />
          Customize
        </NavLink>
        {profile && (
          <a className="btn-primary" href={getProfileUrl(profile)} target="_blank" rel="noreferrer">
            <ExternalLink className="h-4 w-4" />
            Open
          </a>
        )}
      </div>
    </div>
  </header>
);
