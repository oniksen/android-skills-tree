import type { ReactNode } from "react";
import ProgressBar, { type ProgressTone } from "@/shared/ui/ProgressBar";

export interface PageSummaryStat {
  label: string;
  value: ReactNode;
}

interface PageSummaryCardProps {
  title: string;
  /** Small text on the right of the title row. */
  meta?: ReactNode;
  /** Main value, e.g. "12/48" or "1 240". */
  value?: ReactNode;
  /** Label shown before the main value. */
  valueLabel?: string;
  progress?: { current: number; max: number; tone?: ProgressTone };
  stats?: PageSummaryStat[];
  children?: ReactNode;
}

/**
 * Compact summary panel used as the right-hand side of `PageHero`.
 * Mirrors the level-progress card of the skills tree.
 */
export default function PageSummaryCard({
  title,
  meta,
  value,
  valueLabel,
  progress,
  stats,
  children,
}: PageSummaryCardProps) {
  return (
    <div className="card-surface relative overflow-hidden rounded-lg p-5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />

      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {title}
        </h2>
        {meta && (
          <span className="font-mono text-xs text-slate-500">{meta}</span>
        )}
      </div>

      {(value !== undefined || valueLabel) && (
        <div className="mt-2 flex items-baseline justify-between gap-3">
          {valueLabel && (
            <span className="font-mono text-xs text-slate-500">
              {valueLabel}
            </span>
          )}
          {value !== undefined && (
            <span className="font-mono text-lg font-semibold text-white">
              {value}
            </span>
          )}
        </div>
      )}

      {progress && (
        <div className="mt-2">
          <ProgressBar
            current={progress.current}
            max={progress.max}
            tone={progress.tone ?? "coral"}
            showLabel={false}
          />
        </div>
      )}

      {children}

      {stats && stats.length > 0 && (
        <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/[0.06] pt-3 text-sm">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-baseline gap-2">
              <dt className="text-slate-500">{stat.label}</dt>
              <dd className="font-mono text-slate-300">{stat.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
