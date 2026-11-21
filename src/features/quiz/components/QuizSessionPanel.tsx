interface QuizSessionPanelProps {
  grade: string;
  topic: string;
  skillName: string;
  used: number;
  limit: number;
  score?: number;
  reason?: string;
  rubric: string;
  savedLast4?: string;
  canAskNew: boolean;
  onNew: () => void;
  onExit: () => void;
}

function scoreClass(score: number | undefined): string {
  if (score === undefined) return "text-slate-300";
  if (score >= 70) return "text-green-400";
  if (score >= 40) return "text-amber-400";
  return "text-red-400";
}

export default function QuizSessionPanel({
  grade,
  topic,
  skillName,
  used,
  limit,
  score,
  reason,
  rubric,
  savedLast4,
  canAskNew,
  onNew,
  onExit,
}: QuizSessionPanelProps) {
  const percent = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;

  return (
    <aside
      aria-label="Сессия"
      className="card-surface flex h-full w-full flex-col overflow-y-auto rounded-lg p-4 font-mono text-sm"
    >
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Сессия
        </h2>
        <span className="rounded border border-blue-500/40 bg-blue-500/10 px-1.5 py-0.5 text-xs text-blue-600">
          {grade}
        </span>
      </div>

      <div className="mt-4">
        <p className="text-[10px] uppercase tracking-wide text-slate-600">Тема</p>
        <p className="mt-1 break-words text-slate-200">{topic}</p>
        {skillName && (
          <p className="mt-1 break-words text-xs text-slate-500">{skillName}</p>
        )}
      </div>

      <div className="mt-4">
        <div className="flex items-baseline justify-between text-xs">
          <span className="text-slate-500">Сегодня</span>
          <span className="text-slate-300">
            {used}/{limit}
          </span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-400 transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="mt-4 border-t border-white/[0.06] pt-3">
        <p className="text-[10px] uppercase tracking-wide text-slate-600">
          Последняя оценка
        </p>
        <p className={`mt-1 text-3xl font-semibold leading-none ${scoreClass(score)}`}>
          {score === undefined ? "—" : `${score}%`}
        </p>
        {reason && (
          <p className="mt-2 text-xs leading-relaxed text-slate-400">{reason}</p>
        )}
      </div>

      <details className="mt-4 rounded-md border border-white/[0.06] bg-white/[0.02] px-3 py-2">
        <summary className="cursor-pointer text-xs text-slate-400">
          Что оценивается
        </summary>
        <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-slate-500">
          {rubric}
        </p>
      </details>

      <p className="mt-4 text-xs text-slate-500">
        {savedLast4 ? `key: ...${savedLast4}` : "groq key не задан"}
      </p>

      <div className="mt-auto flex gap-2 pt-5 text-xs">
        <button
          type="button"
          onClick={onNew}
          disabled={!canAskNew}
          className="min-h-[32px] cursor-pointer rounded-md border border-white/[0.08] px-2.5 py-1.5 text-blue-600 transition-colors hover:border-blue-500/40 hover:text-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          [new]
        </button>
        <button
          type="button"
          onClick={onExit}
          className="min-h-[32px] cursor-pointer rounded-md border border-white/[0.08] px-2.5 py-1.5 text-slate-400 transition-colors hover:border-white/20 hover:text-slate-200"
        >
          [exit]
        </button>
      </div>
    </aside>
  );
}
