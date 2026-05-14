import { useEffect, useRef, useState } from "react";
import { MouseEffect } from "./MouseEffect";
import { ProfileCard } from "./ProfileCard";
import { premiumBlackGlassDesign } from "../lib/constants";
import type { ProfileBundle } from "../lib/types";

export const PublicProfileRenderer = ({ bundle, preview = false }: { bundle: ProfileBundle; preview?: boolean }) => {
  const { profile } = bundle;
  const [backgroundOffset, setBackgroundOffset] = useState({ x: 0, y: 0 });
  const backgroundFrameRef = useRef<number | null>(null);
  const backgroundUrl = profile.background_type === "gradient" ? premiumBlackGlassDesign.background_url : profile.background_url;
  const backgroundFilter = {
    filter: `blur(${profile.background_blur ?? 0}px) brightness(${profile.background_brightness ?? 80}%) saturate(${profile.background_saturation ?? 100}%)`
  };
  const backgroundMotionStyle = {
    ...backgroundFilter,
    transform: `translate3d(${backgroundOffset.x}px, ${backgroundOffset.y}px, 0) scale(1.06)`
  };

  useEffect(() => {
    const canParallax =
      !preview &&
      profile.background_mouse_parallax &&
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!canParallax) {
      setBackgroundOffset({ x: 0, y: 0 });
      return;
    }

    let target = { x: 0, y: 0 };
    const handleMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * -10;
      const y = (event.clientY / window.innerHeight - 0.5) * -10;
      target = { x, y };
    };

    const tick = () => {
      setBackgroundOffset((current) => ({
        x: current.x + (target.x - current.x) * 0.12,
        y: current.y + (target.y - current.y) * 0.12
      }));
      backgroundFrameRef.current = window.requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    backgroundFrameRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      if (backgroundFrameRef.current) window.cancelAnimationFrame(backgroundFrameRef.current);
      backgroundFrameRef.current = null;
    };
  }, [preview, profile.background_mouse_parallax]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-luxury-bg px-4 py-10">
      {profile.background_type === "video" && backgroundUrl ? (
        <video src={backgroundUrl} className="absolute inset-0 h-full w-full object-cover" style={backgroundMotionStyle} autoPlay muted loop playsInline />
      ) : (profile.background_type === "image" || profile.background_type === "gif") && backgroundUrl ? (
        <img src={backgroundUrl} alt="" className="absolute inset-0 h-full w-full object-cover" style={backgroundMotionStyle} />
      ) : (
        <div
          className="absolute inset-0 animate-gradient bg-[linear-gradient(125deg,#000000,#070707,#111111,#000000)] bg-[length:260%_260%]"
          style={{ transform: `translate3d(${backgroundOffset.x}px, ${backgroundOffset.y}px, 0) scale(1.06)` }}
        />
      )}
      <div className="absolute inset-0 bg-black" style={{ opacity: profile.overlay_opacity ?? 0.55 }} />
      <div className="pointer-events-none absolute left-1/2 top-8 h-80 w-80 -translate-x-1/2 rounded-full bg-luxury-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-white/[0.035] blur-3xl" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:4px_4px]" />
      {profile.particles_enabled && (
        <div className="pointer-events-none absolute inset-0 bg-void-grid [background-size:52px_52px] opacity-20" />
      )}
      <div className="relative z-10 flex min-h-[calc(100vh-5rem)] items-center justify-center">
        <ProfileCard bundle={bundle} compact={preview} />
      </div>
      {!preview && <MouseEffect profile={profile} />}
    </div>
  );
};
