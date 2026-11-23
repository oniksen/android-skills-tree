interface ProfileHeroCardProps {
  email: string | null;
  levelName: string;
  levelColor: string;
  headingId: string;
}

export default function ProfileHeroCard({
  email,
  levelName,
  levelColor,
  headingId,
}: ProfileHeroCardProps) {
  const initial = (email?.trim()?.[0] ?? "?").toUpperCase();

  return (
    <section className="card-surface relative overflow-hidden rounded-2xl p-5 sm:p-6">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative flex min-w-0 items-center gap-4">
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
    </section>
  );
}
