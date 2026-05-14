import { Music2, Pause, Play, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remaining}`;
};

export const MusicPlayer = ({
  src,
  title = "Now playing",
  artist,
  autoplay = false,
  initialVolume = 0.25
}: {
  src?: string | null;
  title?: string | null;
  artist?: string | null;
  autoplay?: boolean;
  initialVolume?: number;
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [needsGesture, setNeedsGesture] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(Math.min(Math.max(initialVolume, 0), 1));

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;
    const safeVolume = Math.min(Math.max(initialVolume, 0), 1);
    audio.volume = safeVolume;
    setVolume(safeVolume);
    setCurrentTime(0);
    setPlaying(false);
    setNeedsGesture(false);
    if (!autoplay) return;
    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setNeedsGesture(true));
  }, [autoplay, initialVolume, src]);

  if (!src) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try {
        audio.volume = volume;
        await audio.play();
        setPlaying(true);
        setNeedsGesture(false);
      } catch {
        setNeedsGesture(true);
      }
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/12 bg-white/[0.07] p-4 text-left shadow-luxury backdrop-blur-2xl">
      <audio
        ref={audioRef}
        preload="metadata"
        src={src}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onEnded={() => setPlaying(false)}
      />
      <div className="flex items-center gap-3">
        <button
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/20 bg-white text-black transition hover:bg-white/85"
          onClick={toggle}
          type="button"
          aria-label={playing ? "Pause music" : "Play music"}
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Music2 className="h-4 w-4 shrink-0 text-white/70" />
            <p className="truncate text-sm font-bold text-white">{title || "Now playing"}</p>
          </div>
          {artist && <p className="mt-1 truncate text-xs text-luxury-muted">{artist}</p>}
        </div>
        <p className="text-xs tabular-nums text-luxury-muted">{formatTime(currentTime)}</p>
      </div>
      <input
        className="mt-4 h-1.5 w-full cursor-pointer accent-white"
        type="range"
        min={0}
        max={duration || 0}
        step={1}
        value={currentTime}
        onChange={(event) => {
          const value = Number(event.target.value);
          if (audioRef.current) audioRef.current.currentTime = value;
          setCurrentTime(value);
        }}
        aria-label="Track progress"
      />
      <div className="mt-3 flex items-center justify-between gap-3 text-xs text-luxury-muted">
        <span>{formatTime(duration)}</span>
        <label className="flex items-center gap-2">
          <Volume2 className="h-3.5 w-3.5 text-white/70" />
          <input
            className="w-20 accent-white"
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(event) => {
              const value = Number(event.target.value);
              setVolume(value);
              if (audioRef.current) audioRef.current.volume = value;
            }}
            aria-label="Volume"
          />
        </label>
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.06]">
        <div className="h-full rounded-full bg-white transition-[width]" style={{ width: `${progress}%` }} />
      </div>
      {needsGesture && (
        <button
          className="mt-4 w-full rounded-2xl border border-white/12 bg-white/[0.08] px-4 py-3 text-sm font-bold text-white transition hover:bg-white/[0.14]"
          onClick={toggle}
          type="button"
        >
          Tap to play
        </button>
      )}
    </div>
  );
};
