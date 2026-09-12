"use client";

import { motion } from "motion/react";
import { useUserProgress, useAssessments } from "@/hooks";
import { levels } from "@/data/levels";
import { categories } from "@/data/categories";
import { skills } from "@/data/skills";
import GapList from "@/components/roadmap/GapList";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function RoadmapClient() {
  const { progress, loading: progressLoading } = useUserProgress();
  const { assessmentMap, loading: assessmentsLoading } = useAssessments();

  if (progressLoading || assessmentsLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex items-center gap-3 text-slate-400">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-700 border-t-blue-400" />
          Загрузка...
        </div>
      </div>
    );
  }

  const currentLevelId = progress?.currentLevelId || levels[0]?.id || "";
  const currentIndex = levels.findIndex((l) => l.id === currentLevelId);
  const relevantLevels = levels.slice(
    currentIndex,
    Math.min(currentIndex + 2, levels.length),
  );
  const relevantLevelIds = new Set(relevantLevels.map((l) => l.id));

  const relevantCategories = categories
    .filter((c) => relevantLevelIds.has(c.levelId))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const gaps: {
    skillName: string;
    categoryName: string;
    levelName: string;
    currentScore: number;
    maxScore: number;
  }[] = [];

  relevantCategories.forEach((cat) => {
    const catSkills = skills.filter((s) => s.categoryId === cat.id);
    const level = levels.find((l) => l.id === cat.levelId);

    catSkills.forEach((skill) => {
      const score = assessmentMap[skill.id]?.score || 0;
      if (score < 3) {
        gaps.push({
          skillName: skill.name,
          categoryName: cat.name,
          levelName: level?.name || "",
          currentScore: score,
          maxScore: 5,
        });
      }
    });
  });

  gaps.sort((a, b) => a.currentScore - b.currentScore);

  const currentLevel = levels.find((l) => l.id === currentLevelId);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Roadmap</h1>
        <p className="text-slate-400">
          Навыки, требующие внимания. Сосредоточьтесь на навыках с низкой
          оценкой.
        </p>
        {currentLevel && (
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-300">
            Текущий фокус: {currentLevel.name}
          </p>
        )}
      </motion.div>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      >
        <GapList gaps={gaps} />
      </motion.div>
    </div>
  );
}