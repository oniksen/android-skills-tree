import ProgressRing from "@/shared/ui/ProgressRing";
import { levelProgressPercent } from "@/core/domain/profile-level";

interface ProfileHeroCardProps {
  email: string | null;
  levelName: string;
  levelColor: string;
  xp: number;
  nextLevelName: string | null;
  nextThreshold: number | null;
  crystals: number;
  currentStreak: number;
  longestStreak: number;
  headingId?: string;
}

function pluralDays(n: number): string {
  if (n % 10 === 1 && n % 100 !== 11) return "день";
  if (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14)) return "дня";
  return "дней";
}

export default function ProfileHeroCard({
  email,
  levelName,
  levelColor,
  xp,
  nextLevelName,
  nextThreshold,
  crystals,
  currentStreak,
  longestStreak,
  headingId,
}: ProfileHeroCardProps) {
  const initial = (email?.trim()?.[0] ?? "?").toUpperCase();
  const percent = levelProgressPercent(xp, nextThreshold);
  const remaining =
    nextLevelName && nextThreshold ? Math.max(0, nextThreshold - xp) : null;

  return (
    <section className="card-surface relative overflow-hidden rounded-2xl p-5 sm:p-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-blue-500/40 bg-blue-500/10 font-mono text-3xl font-bold text-blue-600">
            {initial}
          </span>
          <div className="min-w-0">
            <h1
              id={headingId}
              className="text-2xl font-bold tracking-tight text-white"
            >
              <span className="text-blue-600">#</span> Профиль
            </h1>
            <p className="truncate font-mono text-xs text-slate-500">
              {email ?? "—"}
            </p>
            <p className={`mt-1 font-mono text-xs ${levelColor}`}>
              уровень: {levelName}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 md:justify-end">
          <ProgressRing percent={percent} label={`${percent}%`} sub="уровень" />
          <dl className="grid grid-cols-3 gap-4 font-mono text-xs md:grid-cols-1 md:gap-2">
            <div>
              <dt className="text-slate-500">XP</dt>
              <dd className="text-base font-semibold text-white">{xp}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Кристаллы</dt>
              <dd className="text-base font-semibold text-cyan-600">
                {crystals} 💎
              </dd>
            </div>
            <div>
              <dt className="text-slate-500">Стрик</dt>
              <dd className="text-base font-semibold text-orange-400">
                {currentStreak} {pluralDays(currentStreak)}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <p className="relative mt-4 border-t border-white/[0.06] pt-3 font-mono text-xs text-slate-500">
        {remaining !== null && nextLevelName ? (
          <>
            до <span className="text-slate-300">{nextLevelName}</span> осталось{" "}
            <span className="text-slate-200">{remaining}</span> XP · рекорд стрика{" "}
            {longestStreak} {pluralDays(longestStreak)}
          </>
        ) : (
          <>максимальный уровень · рекорд стрика {longestStreak} {pluralDays(longestStreak)}</>
        )}
      </p>
    </section>
  );
}
