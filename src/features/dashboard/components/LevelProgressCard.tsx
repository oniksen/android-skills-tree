"use client";
import ProgressRing from "@/shared/ui/ProgressRing";
import { levelProgressPercent } from "@/core/domain/profile-level";

interface LevelProgressCardProps {
  currentLevel: string;
  currentScore: number;
  nextLevel: string | null;
  nextThreshold: number | null;
  levelColor: string;
}

export default function LevelProgressCard({ currentLevel, currentScore, nextLevel, nextThreshold, levelColor }: LevelProgressCardProps) {
  const percent = levelProgressPercent(currentScore, nextThreshold);

  return (
    <div className="group relative card-surface overflow-hidden rounded-lg p-6 transition-colors duration-200 hover:border-blue-500/40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">Текущий уровень</h2>
          <p className={`text-3xl font-bold tracking-tight ${levelColor}`}>{currentLevel}</p>
        </div>
        <ProgressRing percent={percent} label={`${percent}%`} sub="уровень" />
      </div>
      {nextLevel && nextThreshold ? (
        <p className="mt-4 text-sm text-slate-400">
          Прогресс грейда: <span className="font-mono text-slate-200">{percent}%</span>
        </p>
      ) : (
        <p className="mt-4 text-emerald-400 font-medium">Максимальный уровень достигнут!</p>
      )}
    </div>
  );
}
