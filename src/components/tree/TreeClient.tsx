"use client";

import { motion } from "motion/react";
import { useUserProgress, useAssessments } from "@/hooks";
import { levels } from "@/data/levels";
import { getCategoriesByLevelId } from "@/data/categories";
import { getSkillsByCategoryId } from "@/data/skills";
import LevelTabs from "@/components/tree/LevelTabs";
import CategoryCard from "@/components/tree/CategoryCard";
import CategoryCardReadonly from "@/components/tree/CategoryCardReadonly";
import LevelGate from "@/components/tree/LevelGate";
import Legend from "@/components/tree/Legend";
import AnimatedNumber from "@/components/shared/AnimatedNumber";
import { calcCategoryScore } from "@/lib/scoring";
import { getCategoryMaxScore, getLevelMaxScore, getLevelMinScore } from "@/lib/weights";

const LEVEL_ACCENT: Record<string, string> = {
  junior: "text-green-400",
  middle: "text-blue-400",
  "strong-middle": "text-purple-400",
  senior: "text-amber-400",
};

interface TreeClientProps {
  slug: string;
}

export default function TreeClient({ slug }: TreeClientProps) {
  const { progress, loading: progressLoading } = useUserProgress();
  const { assessmentMap, loading: assessmentsLoading } = useAssessments();

  const currentLevel = levels.find((l) => l.slug === slug);
  if (!currentLevel) return null;

  const levelCategories = getCategoriesByLevelId(currentLevel.id).map(
    (cat) => ({
      ...cat,
      skills: getSkillsByCategoryId(cat.id),
    }),
  );

  const accent = LEVEL_ACCENT[currentLevel.slug] || "text-blue-400";

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

  if (!progress) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className={`text-3xl font-bold tracking-tight mb-1 ${accent}`}>
            {currentLevel.name}
          </h1>
          <p className="text-slate-400">{currentLevel.description}</p>
        </motion.div>
        <LevelTabs levels={levels} />
        <Legend />
        <div className="grid gap-4 md:grid-cols-2">
          {levelCategories.map((cat) => (
            <CategoryCardReadonly
              key={cat.id}
              categoryId={cat.id}
              name={cat.name}
              skills={cat.skills}
            />
          ))}
        </div>
      </>
    );
  }

  const currentLevelId = progress.currentLevelId || levels[0].id;
  const currentLevelIndex = levels.findIndex((l) => l.id === currentLevelId);
  const levelIndex = levels.findIndex((l) => l.id === currentLevel.id);
  const isCurrentOrPast = levelIndex <= currentLevelIndex;
  const isCompleted = levelIndex < currentLevelIndex;
  const currentScore = progress.totalScore || 0;
  const nextLevel = levels[currentLevelIndex + 1] || null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-3 nav-lg:flex-row nav-lg:justify-between nav-lg:items-start nav-lg:gap-0"
      >
        <div>
          <h1 className={`text-3xl font-bold tracking-tight mb-1 ${accent}`}>
            {currentLevel.name}
          </h1>
          <p className="text-slate-400">{currentLevel.description}</p>
        </div>
        <div className="flex items-center gap-x-4 nav-lg:items-end nav-lg:flex-col nav-lg:gap-x-0 nav-lg:text-right text-sm text-slate-500">
          <div className="flex items-center gap-1.5">
            <span>Всего XP:</span>
            <AnimatedNumber
              value={currentScore}
              className="font-mono font-semibold text-slate-200"
            />
          </div>
          {nextLevel && (
            <div>
              До {nextLevel.name}:{" "}
              <AnimatedNumber
                value={Math.max(0, getLevelMinScore(nextLevel.id) - currentScore)}
                className="font-mono font-semibold text-blue-300"
              />{" "}
              XP
            </div>
          )}
        </div>
      </motion.div>

      <LevelTabs levels={levels} />
      <Legend isAuthenticated={true} />

      {!isCurrentOrPast && (
        <LevelGate
          isUnlocked={false}
          isCompleted={false}
          requiredScore={getLevelMaxScore(levels[levelIndex - 1]?.id ?? "")}
          currentScore={currentScore}
          levelName={currentLevel.name}
        />
      )}
      {isCompleted && (
        <LevelGate
          isUnlocked={false}
          isCompleted={true}
          requiredScore={0}
          currentScore={currentScore}
          levelName={currentLevel.name}
        />
      )}
      {isCurrentOrPast && !isCompleted && (
        <div className="grid gap-4 md:grid-cols-2">
          {levelCategories.map((cat, index) => {
            const catScore = calcCategoryScore(cat.id, assessmentMap);
            const catMax = getCategoryMaxScore(cat.id);
            return (
              <CategoryCard
                key={cat.id}
                categoryId={cat.id}
                name={cat.name}
                skills={cat.skills}
                assessments={assessmentMap}
                isLocked={catScore >= catMax}
                index={index}
              />
            );
          })}
        </div>
      )}
    </>
  );
}