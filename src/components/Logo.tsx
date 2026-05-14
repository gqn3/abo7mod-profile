import { Link } from "react-router-dom";
import { cn } from "../lib/ui";

type LogoProps = {
  className?: string;
  compact?: boolean;
  to?: string;
};

const LogoMark = () => (
  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/10 bg-luxury-secondary text-sm font-extrabold text-luxury-accent shadow-soft-glow">
    A7
  </span>
);

const LogoContent = ({ compact }: { compact?: boolean }) => (
  <>
    <LogoMark />
    {!compact && (
      <span className="leading-none">
        <span className="block font-heading text-xl font-extrabold text-luxury-text">Abo7mod</span>
        <span className="mt-1 block text-xs font-medium text-luxury-muted">Cinematic profiles</span>
      </span>
    )}
  </>
);

export const Logo = ({ className, compact, to }: LogoProps) => {
  const classes = cn("inline-flex items-center gap-3", className);

  if (to) {
    return (
      <Link to={to} className={classes}>
        <LogoContent compact={compact} />
      </Link>
    );
  }

  return (
    <div className={classes}>
      <LogoContent compact={compact} />
    </div>
  );
};
