const DEFAULT_BLOCKS = 20;

interface GradeXpBarProps {
  /** Earned XP inside the grade. */
  score: number;
  /** XP of the grade's `requiredForLevelUp` skills (base-grade gate). */
  required: number;
  /** XP of every skill in the grade (100%). */
  max: number;
  blocks?: number;
}

function clamp(value: number, max: number): number {
  return Math.min(Math.max(value, 0), max);
}

/**
 * One XP bar for a whole grade: earned XP, the required-skills threshold and
 * the additional XP needed to close the grade to 100%. Keeps the ASCII look of
 * `ProgressBar`, but marks the base-grade boundary instead of hiding it.
 */
export default function GradeXpBar({
  score,
  required,
  max,
  blocks = DEFAULT_BLOCKS,
}: GradeXpBarProps) {
  const safeMax = Math.max(max, 0);
  const clampedScore = clamp(score, safeMax);
  const requiredScore = clamp(required, safeMax);
  const extraScore = safeMax - requiredScore;
  const hasRequired = requiredScore > 0;
  const hasMarker = hasRequired && requiredScore < safeMax;

  const filled = safeMax > 0 ? Math.round((clampedScore / safeMax) * blocks) : 0;
  const requiredBlock = safeMax > 0 ? Math.round((requiredScore / safeMax) * blocks) : 0;
  const requiredPercent = safeMax > 0 ? Math.round((requiredScore / safeMax) * 10000) / 100 : 0;

  const label = hasRequired
    ? `XP ${clampedScore} из ${safeMax}. Обязательно ${requiredScore} XP, дополнительно ${extraScore} XP до 100 процентов.`
    : `XP ${clampedScore} из ${safeMax}. Дополнительно ${extraScore} XP до 100 процентов.`;

  return (
    <div className="w-full" role="img" aria-label={label}>
      <div className="flex items-center gap-2 font-mono text-xs leading-none">
        <span className="text-slate-600">[</span>
        <span className="relative inline-block whitespace-nowrap">
          {Array.from({ length: blocks }, (_, index) => {
            const earned = index < filled;
            const inExtra = index >= requiredBlock;
            const tone = earned
              ? "text-blue-600"
              : inExtra
                ? "text-amber-500/40"
                : "text-slate-600";

            return (
              <span key={index} className={tone}>
                {earned ? "█" : "░"}
              </span>
            );
          })}
          {hasMarker && (
            <span
              aria-hidden
              data-testid="grade-xp-marker"
              className="absolute -top-1 -bottom-1 w-px bg-amber-400"
              style={{ left: `${requiredPercent}%` }}
            />
          )}
        </span>
        <span className="text-slate-600">]</span>
      </div>

      <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-slate-500">
        {hasRequired && (
          <div className="flex items-center gap-1.5">
            <span aria-hidden className="h-2 w-2 shrink-0 rounded-sm bg-blue-600" />
            <dt>обязательно</dt>
            <dd className="text-slate-300">{requiredScore} XP</dd>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <span aria-hidden className="h-2 w-2 shrink-0 rounded-sm bg-amber-500/50" />
          <dt>дополнительно</dt>
          <dd className="text-slate-300">{extraScore} XP до 100%</dd>
        </div>
      </dl>
    </div>
  );
}
