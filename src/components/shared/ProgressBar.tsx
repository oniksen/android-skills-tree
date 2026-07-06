export default function ProgressBar({ value, max, label }: { value: number; max: number; label?: string }) {
  const pct = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0;
  return (
    <div className="w-full">
      {label && <p className="text-xs text-slate-400 mb-1">{label}</p>}
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-slate-500 mt-0.5">{value}/{max}</p>
    </div>
  );
}
