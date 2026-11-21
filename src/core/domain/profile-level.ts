/**
 * Progress towards the next level as a 0–100 percentage.
 * A missing (or zero) threshold means the last level is reached.
 */
export function levelProgressPercent(
  xp: number,
  threshold: number | null,
): number {
  if (threshold === null || threshold <= 0) return 100;
  return Math.max(0, Math.min(100, Math.round((xp / threshold) * 100)));
}
