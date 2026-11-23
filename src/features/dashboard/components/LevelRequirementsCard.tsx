import type { LevelRequirement } from "@/core/domain/level-requirements";

interface LevelRequirementsCardProps {
  requirements: LevelRequirement[];
  nextLevelName: string;
}

export default function LevelRequirementsCard({
  requirements,
  nextLevelName,
}: LevelRequirementsCardProps) {
  const ready = requirements.length > 0 && requirements.every((item) => item.done);

  if (ready) {
    return (
      <div className="relative overflow-hidden rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-6">
        <h2 className="mb-2 font-mono text-sm font-semibold text-emerald-600">
          [ READY ] условия выполнены
        </h2>
        <p className="text-sm text-slate-400">
          Вы готовы перейти на уровень{" "}
          <strong className="text-emerald-600">{nextLevelName}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="group relative card-surface overflow-hidden rounded-lg p-6 transition-colors duration-200 hover:border-emerald-500/40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Что нужно для {nextLevelName}
      </h2>
      <ul className="space-y-2">
        {requirements.map((item) => (
          <li key={item.id} className="flex items-center gap-2 text-sm">
            <span
              className={`font-mono text-xs ${
                item.done ? "text-emerald-500" : "text-slate-600"
              }`}
            >
              {item.done ? "[x]" : "[ ]"}
            </span>
            <span className={item.done ? "text-slate-400" : "text-slate-300"}>
              {item.label}
            </span>
            {item.current !== undefined && item.target !== undefined && (
              <span
                className={`ml-auto font-mono text-xs ${
                  item.done ? "text-emerald-500" : "text-slate-500"
                }`}
              >
                {`${item.current}/${item.target}`}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
