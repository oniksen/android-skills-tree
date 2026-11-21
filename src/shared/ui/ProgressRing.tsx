import type { ReactNode } from "react";

interface ProgressRingProps {
  percent: number;
  label: ReactNode;
  sub?: string;
  className?: string;
}

/**
 * Circular level indicator. Uses a conic gradient so it needs no SVG and
 * scales with its container.
 */
export default function ProgressRing({
  percent,
  label,
  sub,
  className = "",
}: ProgressRingProps) {
  const value = Math.max(0, Math.min(100, Math.round(percent)));

  return (
    <div
      role="img"
      aria-label={`${value}%`}
      className={`relative h-24 w-24 shrink-0 rounded-full p-[6px] ${className}`}
      style={{
        background: `conic-gradient(var(--color-blue-500) ${value}%, var(--color-slate-800) 0)`,
      }}
    >
      <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-[var(--surface)]">
        <span className="font-mono text-lg font-semibold leading-none text-white">
          {label}
        </span>
        {sub && (
          <span className="mt-1 font-mono text-[10px] uppercase tracking-wide text-slate-500">
            {sub}
          </span>
        )}
      </div>
    </div>
  );
}
