export const SliderControl = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}) => (
  <label className="block rounded-2xl border border-white/10 bg-white/[0.04] p-4">
    <div className="mb-3 flex items-center justify-between gap-3">
      <span className="text-sm font-semibold text-luxury-text">{label}</span>
      <span className="rounded-full bg-white/[0.08] px-2 py-1 text-xs text-luxury-muted">{value}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
      className="w-full accent-luxury-accent"
    />
  </label>
);
