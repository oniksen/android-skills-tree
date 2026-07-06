export default function ProgressBar({ current, max, color = "bg-blue-500", showLabel = true }: {
  current: number; max: number; color?: string; showLabel?: boolean
}) {
  const pct = max > 0 ? Math.min(Math.round((current / max) * 100), 100) : 0;
  return (
    <div className="w-full">
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      {showLabel && <p className="text-xs text-slate-500 mt-0.5">{current}/{max}</p>}
    </div>
  );
}
