const TONES = {
  coral: "text-blue-600",
  amber: "text-amber-500",
  green: "text-emerald-500",
  muted: "text-slate-600",
} as const;

export type ProgressTone = keyof typeof TONES;

export default function ProgressBar({
  current,
  max,
  tone = "coral",
  showLabel = true,
  blocks = 20,
}: {
  current: number;
  max: number;
  tone?: ProgressTone;
  showLabel?: boolean;
  blocks?: number;
}) {
  const pct = max > 0 ? Math.min(Math.round((current / max) * 100), 100) : 0;
  const filled = Math.round((pct / 100) * blocks);
  const bar = "█".repeat(filled) + "░".repeat(Math.max(0, blocks - filled));

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 font-mono text-xs leading-none">
        <span className="text-slate-600">[</span>
        <span className={`${TONES[tone]} truncate`}>{bar}</span>
        <span className="text-slate-600">]</span>
        {showLabel && <span className="shrink-0 text-slate-500">{pct}%</span>}
      </div>
      {showLabel && (
        <p className="mt-1 font-mono text-[11px] text-slate-500">
          {current}/{max}
        </p>
      )}
    </div>
  );
}
