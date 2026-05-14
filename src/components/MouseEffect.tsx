import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { Profile } from "../lib/types";

type Point = {
  x: number;
  y: number;
};

const offscreenPoint = { x: -999, y: -999 };

const canUseFinePointer = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export const MouseEffect = ({ profile }: { profile: Profile }) => {
  const [enabled, setEnabled] = useState(false);
  const [position, setPosition] = useState<Point>(offscreenPoint);
  const [trail, setTrail] = useState<Point[]>([]);
  const targetRef = useRef<Point>(offscreenPoint);
  const frameRef = useRef<number | null>(null);

  const styleName = profile.cursor_style || "soft-glow";
  const size = clamp(profile.cursor_size ?? 22, 6, 96);
  const opacity = clamp(profile.cursor_opacity ?? 0.55, 0, 1);
  const blur = clamp(profile.cursor_blur ?? 18, 0, 60);
  const color = profile.cursor_color || "#ffffff";
  const blendMode = (profile.cursor_blend_mode || "screen") as CSSProperties["mixBlendMode"];
  const trailLength = clamp(profile.cursor_trail_length ?? 8, 0, 18);
  const trailEnabled = Boolean(profile.cursor_trail_enabled && trailLength > 0 && styleName !== "minimal" && styleName !== "spotlight");
  const isSpotlight = styleName === "spotlight";

  useEffect(() => {
    setEnabled(Boolean(profile.cursor_enabled && canUseFinePointer()));
  }, [profile.cursor_enabled]);

  useEffect(() => {
    if (!enabled) {
      setTrail([]);
      return;
    }

    const handleMove = (event: PointerEvent) => {
      targetRef.current = { x: event.clientX, y: event.clientY };
    };

    const tick = () => {
      setPosition((current) => {
        const next = {
          x: current.x + (targetRef.current.x - current.x) * 0.24,
          y: current.y + (targetRef.current.y - current.y) * 0.24
        };
        if (trailEnabled) {
          setTrail((items) => [next, ...items].slice(0, trailLength));
        }
        return next;
      });
      frameRef.current = window.requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    frameRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };
  }, [enabled, trailEnabled, trailLength]);

  const cursorStyle = useMemo<CSSProperties>(() => {
    const visualSize = isSpotlight ? size * 12 : styleName === "smoke" ? size * 2.2 : size;
    const base: CSSProperties = {
      height: visualSize,
      left: 0,
      mixBlendMode: blendMode,
      opacity,
      pointerEvents: "none",
      position: "fixed",
      top: 0,
      transform: `translate3d(${position.x - visualSize / 2}px, ${position.y - visualSize / 2}px, 0)`,
      width: visualSize,
      willChange: "transform"
    };

    if (isSpotlight) {
      return {
        ...base,
        background: `radial-gradient(circle, ${color} 0%, rgba(255,255,255,0.08) 18%, transparent 68%)`,
        borderRadius: "9999px",
        filter: `blur(${Math.max(blur, 20)}px)`
      };
    }

    if (styleName === "ring") {
      return {
        ...base,
        background: "transparent",
        border: `1px solid ${color}`,
        borderRadius: "9999px",
        boxShadow: `0 0 ${Math.max(blur, 10)}px ${color}`
      };
    }

    if (styleName === "dot-ring") {
      return {
        ...base,
        background: "transparent",
        border: `1px solid ${color}`,
        borderRadius: "9999px",
        boxShadow: `0 0 ${Math.max(blur, 12)}px ${color}`
      };
    }

    if (styleName === "minimal") {
      return {
        ...base,
        background: color,
        borderRadius: "9999px",
        boxShadow: `0 0 ${Math.max(blur / 2, 6)}px ${color}`
      };
    }

    return {
      ...base,
      background: color,
      borderRadius: "9999px",
      filter: `blur(${styleName === "smoke" ? Math.max(blur, 22) : blur}px)`,
      boxShadow: `0 0 ${Math.max(blur * 2, 18)}px ${color}`
    };
  }, [blendMode, blur, color, isSpotlight, opacity, position.x, position.y, size, styleName]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0" style={{ zIndex: isSpotlight ? 5 : 30 }}>
      {trailEnabled &&
        trail.map((point, index) => {
          const ratio = 1 - index / Math.max(trail.length, 1);
          const trailSize = Math.max(size * (styleName === "smoke" ? 1.6 : 0.7) * ratio, 3);
          const trailOpacity = opacity * ratio * 0.42;
          return (
            <span
              key={`${point.x}-${point.y}-${index}`}
              className="pointer-events-none fixed left-0 top-0 rounded-full"
              style={{
                background: styleName === "ring" ? "transparent" : color,
                border: styleName === "ring" ? `1px solid ${color}` : undefined,
                filter: `blur(${styleName === "smoke" ? Math.max(blur, 18) : Math.max(blur / 2, 4)}px)`,
                height: trailSize,
                mixBlendMode: blendMode,
                opacity: trailOpacity,
                transform: `translate3d(${point.x - trailSize / 2}px, ${point.y - trailSize / 2}px, 0)`,
                width: trailSize
              }}
            />
          );
        })}
      <span className="block" style={cursorStyle}>
        {styleName === "dot-ring" && (
          <span
            className="absolute left-1/2 top-1/2 block h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: color, boxShadow: `0 0 ${Math.max(blur, 10)}px ${color}` }}
          />
        )}
      </span>
    </div>
  );
};
