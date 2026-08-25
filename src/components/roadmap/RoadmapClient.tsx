"use client";

import { useUserProgress, useAssessments } from "@/hooks";
import { levels } from "@/data/levels";
import { categories } from "@/data/categories";
import { skills } from "@/data/skills";
import GapList from "@/components/roadmap/GapList";

export default function RoadmapClient() {
  const { progress, loading: progressLoading } = useUserProgress();
  const { assessmentMap, loading: assessmentsLoading } = useAssessments();

  if (progressLoading || assessmentsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400">Загрузка...</div>
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
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Roadmap</h1>
        <p className="text-slate-400">
          Навыки, требующие внимания. Сосредоточьтесь на навыках с низкой
          оценкой.
        </p>
        {currentLevel && (
          <p className="text-sm text-blue-400 mt-1">
            Текущий фокус: {currentLevel.name}
          </p>
        )}
      </div>
      <GapList gaps={gaps} />
    </div>
  );
}
