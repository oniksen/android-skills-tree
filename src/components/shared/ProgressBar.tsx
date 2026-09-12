export default function ProgressBar({
  current,
  max,
  color = "bg-blue-500",
  showLabel = true,
  shimmer = false,
}: {
  current: number;
  max: number;
  color?: string;
  showLabel?: boolean;
  shimmer?: boolean;
}) {
  const pct = max > 0 ? Math.min(Math.round((current / max) * 100), 100) : 0;
  return (
    <div className="w-full">
      <div className="h-2 bg-slate-800/80 rounded-full overflow-hidden shadow-inner">
        <div
          className={`relative h-full rounded-full transition-all duration-700 ease-out ${color} ${
            pct > 0 ? "shadow-[0_0_8px_rgba(255,255,255,0.15)]" : ""
          }`}
          style={{ width: `${pct}%` }}
        >
          {shimmer && pct > 0 && pct < 100 && (
            <span className="absolute inset-y-0 left-0 w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          )}
        </div>
      </div>
      {showLabel && (
        <p className="text-xs text-slate-500 mt-0.5">
          {current}/{max}
        </p>
      )}
    </div>
  );
}