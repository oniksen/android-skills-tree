"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowDown, ArrowUp, Check, Percent, type LucideIcon } from "lucide-react";
import { useUserProgress, useAssessments } from "@/hooks";
import { levels } from "@/data/levels";
import { categories } from "@/data/categories";
import { skills } from "@/data/skills";
import GapList from "@/components/roadmap/GapList";
import { RoadmapSkeleton } from "@/components/shared/skeletons";
import { calcSkillCompletionPercent } from "@/core/domain/scoring";
import { getSkillWeight } from "@/core/domain/weights";
import { sortRoadmapItems, type RoadmapSortKey } from "@/core/domain/roadmap-sort";

const EASE = [0.22, 1, 0.36, 1] as const;

const SORT_OPTIONS: { key: RoadmapSortKey; label: string; icon: LucideIcon }[] = [
  { key: "xp-asc", label: "Опыт ↑", icon: ArrowUp },
  { key: "xp-desc", label: "Опыт ↓", icon: ArrowDown },
  { key: "completion-desc", label: "Закрытие %", icon: Percent },
];

export default function RoadmapClient() {
  const { progress, loading: progressLoading } = useUserProgress();
  const { assessmentMap, loading: assessmentsLoading } = useAssessments();
  const [sortKey, setSortKey] = useState<RoadmapSortKey>("completion-desc");
  const [hideCompleted, setHideCompleted] = useState(false);

  if (progressLoading || assessmentsLoading) {
    return <RoadmapSkeleton />;
  }

  const currentLevelId = progress?.currentLevelId || levels[0]?.id || "";
  const currentLevel = levels.find((l) => l.id === currentLevelId) || levels[0];

  const relevantCategories = categories
    .filter((c) => c.levelId === currentLevel.id)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const items: {
    skillId: string;
    skillName: string;
    categoryName: string;
    levelName: string;
    completionPercent: number;
    currentScore: number;
    maxScore: number;
  }[] = [];

  relevantCategories.forEach((cat) => {
    const catSkills = skills.filter((s) => s.categoryId === cat.id);

    catSkills.forEach((skill) => {
      items.push({
        skillId: skill.id,
        skillName: skill.name,
        categoryName: cat.name,
        levelName: currentLevel.name,
        completionPercent: calcSkillCompletionPercent(
          skill.id,
          assessmentMap[skill.id]?.subtopics,
        ),
        currentScore: assessmentMap[skill.id]?.score || 0,
        maxScore: getSkillWeight(skill.id),
      });
    });
  });

  const sortedItems = sortRoadmapItems(items, sortKey);

  const visibleItems = hideCompleted
    ? sortedItems.filter((i) => i.completionPercent < 100)
    : sortedItems;

  const emptyMessage =
    hideCompleted && items.length > 0 && visibleItems.length === 0
      ? "Все навыки текущего грейда пройдены"
      : "Нет навыков для текущего грейда";

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-white">
          <span className="text-blue-600">#</span> Roadmap
        </h1>
        <p className="text-sm text-slate-400">
          Все навыки текущего грейда и прогресс по ним. Выберите порядок
          сортировки.
        </p>
        {currentLevel && (
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-blue-500/40 bg-blue-500/10 px-3 py-1 font-mono text-sm font-medium text-blue-600">
            focus: {currentLevel.name}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          {SORT_OPTIONS.map((option) => {
            const active = sortKey === option.key;
            const Icon = option.icon;
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => setSortKey(option.key)}
                aria-pressed={active}
                className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-sm transition-colors ${
                  active
                    ? "border-blue-500/60 bg-blue-500/15 text-blue-600"
                    : "border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-blue-500/40 hover:text-blue-500"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {option.label}
              </button>
            );
          })}
          <button
            type="button"
            role="checkbox"
            aria-checked={hideCompleted}
            onClick={() => setHideCompleted((v) => !v)}
            className="group inline-flex items-center gap-2 rounded-md px-1 py-1.5 font-mono text-sm text-slate-400 transition-colors hover:text-blue-500"
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors duration-200 ${
                hideCompleted
                  ? "border-blue-600 bg-blue-600 text-[#faf9f5]"
                  : "border-slate-600 group-hover:border-slate-400"
              }`}
            >
              {hideCompleted && <Check className="h-3.5 w-3.5" strokeWidth={3.5} />}
            </span>
            Скрыть пройденные
          </button>
        </div>
      </motion.div>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      >
        <GapList gaps={visibleItems} emptyMessage={emptyMessage} />
      </motion.div>
    </div>
  );
}