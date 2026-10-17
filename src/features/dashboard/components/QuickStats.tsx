"use client";
import AnimatedNumber from "@/shared/ui/AnimatedNumber";

interface QuickStatsProps {
  totalSkills: number;
  assessedSkills: number;
  completedProjects: number;
  totalProjects: number;
}

function StatBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
      <div
        className={`relative h-full rounded-full transition-all duration-700 ease-out ${color}`}
        style={{ width: `${pct}%` }}
      >
        {pct > 0 && pct < 100 && (
          <span className="absolute inset-y-0 left-0 w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        )}
      </div>
    </div>
  );
}

export default function QuickStats({ totalSkills, assessedSkills, completedProjects, totalProjects }: QuickStatsProps) {
  return (
    <div className="group relative card-surface overflow-hidden rounded-lg p-6 transition-colors duration-200 hover:border-blue-500/40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Статистика</h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-slate-400">Оценено навыков</span>
          <span className="font-mono font-medium text-white">
            <AnimatedNumber value={assessedSkills} />/<AnimatedNumber value={totalSkills} />
          </span>
        </div>
        <StatBar value={assessedSkills} max={totalSkills} color="bg-gradient-to-r from-blue-500 to-indigo-400" />
        <div className="flex justify-between mt-4">
          <span className="text-slate-400">Выполнено проектов</span>
          <span className="font-mono font-medium text-white">
            <AnimatedNumber value={completedProjects} />/<AnimatedNumber value={totalProjects} />
          </span>
        </div>
        <StatBar value={completedProjects} max={totalProjects} color="bg-gradient-to-r from-emerald-500 to-teal-400" />
      </div>
    </div>
  );
}