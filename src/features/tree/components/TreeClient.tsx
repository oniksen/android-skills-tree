"use client";

import { AnimatePresence, motion } from "motion/react";
import { useUserProgress, useAssessments } from "@/hooks";
import { levels } from "@/data/levels";
import { getCategoriesByLevelId } from "@/data/categories";
import { getSkillsByCategoryId } from "@/data/skills";
import LevelTabs from "@/features/tree/components/LevelTabs";
import CategoryCard from "@/features/tree/components/CategoryCard";
import CategoryCardReadonly from "@/features/tree/components/CategoryCardReadonly";
import LevelGate from "@/features/tree/components/LevelGate";
import Legend from "@/features/tree/components/Legend";
import { TreeSkeleton } from "@/shared/ui/skeletons";
import { calcCategoryScore } from "@/core/domain/scoring";
import { getCategoryMaxScore, getLevelMinScore } from "@/core/domain/weights";

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
    return <TreeSkeleton />;
  }

  if (!progress) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className={`text-2xl font-bold tracking-tight mb-1 ${accent}`}>
            <span className="text-slate-600">##</span> {currentLevel.name}
          </h1>
          <p className="text-sm text-slate-400">{currentLevel.description}</p>
        </motion.div>
        <LevelTabs levels={levels} />
        <Legend />
        <AnimatePresence mode="wait">
          <motion.div
            key={slug}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 gap-4 lg:grid-cols-2"
          >
            {levelCategories.map((cat) => (
              <CategoryCardReadonly
                key={cat.id}
                categoryId={cat.id}
                name={cat.name}
                skills={cat.skills}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  const currentLevelId = progress.currentLevelId || levels[0].id;
  const currentLevelIndex = levels.findIndex((l) => l.id === currentLevelId);
  const levelIndex = levels.findIndex((l) => l.id === currentLevel.id);
  const isCurrentOrPast = levelIndex <= currentLevelIndex;
  const isCompleted = levelIndex < currentLevelIndex;
  const currentScore = progress.totalScore || 0;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="min-w-0"
      >
        <div>
          <h1 className={`text-2xl font-bold tracking-tight mb-1 ${accent}`}>
            <span className="text-slate-600">##</span> {currentLevel.name}
          </h1>
          <p className="text-sm text-slate-400">{currentLevel.description}</p>
        </div>
      </motion.div>

      <LevelTabs levels={levels} />
      <Legend isAuthenticated={true} />

      <AnimatePresence mode="wait">
        <motion.div
          key={slug}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6"
        >
          {!isCurrentOrPast && (
            <>
              <LevelGate
                isUnlocked={false}
                isCompleted={false}
                requiredScore={getLevelMinScore(currentLevel.id)}
                currentScore={currentScore}
                levelName={currentLevel.name}
              />
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {levelCategories.map((cat) => (
                  <CategoryCard
                    key={cat.id}
                    categoryId={cat.id}
                    name={cat.name}
                    skills={cat.skills}
                    assessments={assessmentMap}
                    isLocked={false}
                    disabled={true}
                  />
                ))}
              </div>
            </>
          )}
          {isCompleted && (
            <>
              <LevelGate
                isUnlocked={false}
                isCompleted={true}
                requiredScore={0}
                currentScore={currentScore}
                levelName={currentLevel.name}
              />
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
          )}
          {isCurrentOrPast && !isCompleted && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {levelCategories.map((cat) => {
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
                    disabled={false}
                  />
                );
              })}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}