import { ArrowRight, BarChart3, Cloud, Link2, Lock, Music2, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Logo } from "../components/Logo";
import { ProfileCard } from "../components/ProfileCard";
import { demoProfile } from "../lib/constants";

const demoBundle = {
  profile: demoProfile,
  links: [
    { id: "1", profile_id: "demo", title: "Private portfolio", url: "https://example.com", icon: "external", button_style: "inherit", sort_order: 0, is_visible: true, created_at: "" },
    { id: "2", profile_id: "demo", title: "Latest release", url: "https://example.com", icon: "music", button_style: "inherit", sort_order: 1, is_visible: true, created_at: "" }
  ],
  socials: [
    { id: "s1", profile_id: "demo", platform: "Instagram", url: "https://instagram.com", sort_order: 0, is_visible: true },
    { id: "s2", profile_id: "demo", platform: "Spotify", url: "https://spotify.com", sort_order: 1, is_visible: true }
  ],
  badges: [{ id: "b1", name: "Verified", description: "Demo badge", icon_url: null, color: "#d7b46a", created_at: "" }],
  viewCount: 4829
};

const features = [
  { icon: SlidersHorizontal, title: "Focused control", text: "Edit content, media, layout, visibility, and preview without theme clutter." },
  { icon: Link2, title: "Links and socials", text: "Validated URLs, icons, ordering, and profile-ready publishing from the dashboard." },
  { icon: Music2, title: "Profile audio", text: "A compact click-to-play music player supports uploaded tracks and external audio URLs." },
  { icon: Lock, title: "Discord identity", text: "Add a manual Discord block or use Lanyard for live presence when available." },
  { icon: BarChart3, title: "Clean analytics", text: "Track profile visits, devices, and referrers with privacy-aware Supabase storage." },
  { icon: Cloud, title: "Static deploy", text: "Build a Vite SPA to a plain dist folder for manual Netlify upload." }
];

export const LandingPage = () => (
  <div className="luxury-page overflow-hidden">
    <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6">
      <Logo to="/" />
      <div className="flex items-center gap-2">
        <Link to="/login" className="btn-secondary">Login</Link>
        <Link to="/register" className="btn-primary">Create</Link>
      </div>
    </header>

    <main>
      <section className="relative mx-auto grid min-h-[calc(100vh-92px)] max-w-7xl items-center gap-10 px-4 pb-14 pt-8 lg:grid-cols-[minmax(0,1fr)_500px]">
        <div className="pointer-events-none absolute left-1/2 top-8 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-luxury-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-void-grid [background-size:52px_52px] opacity-25" />
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
          <p className="mb-5 inline-flex rounded-full border border-luxury-accent/20 bg-luxury-accent/10 px-4 py-2 text-sm font-bold text-luxury-accent">
            Static React link-in-bio platform
          </p>
          <h1 className="heading text-5xl leading-tight sm:text-6xl lg:text-7xl">Abo7mod</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-luxury-muted">
            A cinematic profile page for animated backgrounds, links, socials, Discord presence, audio, and analytics.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/register" className="btn-primary">
              Create your page <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/demo" className="btn-secondary">View demo</Link>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="relative">
          <div className="pointer-events-none absolute inset-8 rounded-full bg-luxury-accent/20 blur-3xl" />
          <ProfileCard bundle={demoBundle} />
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="glass-panel rounded-[2rem] p-6">
              <feature.icon className="mb-5 h-7 w-7 text-luxury-accent" />
              <h2 className="heading text-xl">{feature.title}</h2>
              <p className="mt-3 leading-7 text-luxury-muted">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="glass-panel rounded-[2rem] p-8">
          <h2 className="heading text-3xl">Ready for manual Netlify upload</h2>
          <p className="mt-3 max-w-3xl leading-7 text-luxury-muted">
            Abo7mod builds to plain files in <code>dist</code>. Upload only that folder; Supabase handles auth, database, storage, and RLS from the browser.
          </p>
        </div>
      </section>
    </main>

    <footer className="border-t border-white/10 px-4 py-8 text-center text-sm text-luxury-muted">Static SPA ready for Netlify.</footer>
  </div>
);
