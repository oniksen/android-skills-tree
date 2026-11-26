"use client";

import { motion } from "motion/react";
import { useState } from "react";
import type { Level } from "@/data/levels";
import GradeXpBar from "@/features/tree/components/GradeXpBar";

interface LevelHeroProps {
  level: Level;
  accent: string;
  levelNumber: number;
  totalLevels: number;
  score: number;
  maxScore: number;
  requiredScore: number;
  categoriesDone: number;
  categoriesTotal: number;
  subtopicPercent: number;
}

export default function LevelHero({
  level,
  accent,
  levelNumber,
  totalLevels,
  score,
  maxScore,
  requiredScore,
  categoriesDone,
  categoriesTotal,
  subtopicPercent,
}: LevelHeroProps) {
  const [expanded, setExpanded] = useState(false);
  const isLong = level.description.length > 120;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,380px)] xl:items-start"
    >
      <div className="min-w-0">
        <h1 className={`text-2xl font-bold tracking-tight mb-1 ${accent}`}>
          <span className="text-slate-600">##</span> {level.name}
        </h1>
        <p
          className={`text-sm text-slate-400 min-h-[2.5rem] ${
            expanded ? "" : "line-clamp-2 nav-md:line-clamp-none"
          }`}
        >
          {level.description}
        </p>
        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-1 text-xs text-blue-600 hover:text-blue-500 nav-md:hidden"
          >
            {expanded ? "Свернуть" : "Показать полностью"}
          </button>
        )}
      </div>

      <div className="card-surface relative overflow-hidden rounded-lg p-5">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Прогресс уровня
          </h2>
          <span className="font-mono text-xs text-slate-500">
            {levelNumber} / {totalLevels}
          </span>
        </div>

        <div className="mt-3 flex items-baseline justify-between font-mono text-sm">
          <span className="text-slate-500">XP</span>
          <span className="text-slate-300">
            {score} / {maxScore}
          </span>
        </div>
        <div className="mt-1.5">
          <GradeXpBar score={score} required={requiredScore} max={maxScore} />
        </div>

        <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/[0.06] pt-3 text-sm">
          <div className="flex items-baseline gap-2">
            <dt className="text-slate-500">Категории</dt>
            <dd className="font-mono text-slate-300">
              {categoriesDone}/{categoriesTotal}
            </dd>
          </div>
          <div className="flex items-baseline gap-2">
            <dt className="text-slate-500">Подтемы</dt>
            <dd className="font-mono text-slate-300">{subtopicPercent}%</dd>
          </div>
        </dl>
      </div>
    </motion.section>
  );
}
