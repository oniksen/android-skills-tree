"use client";

import { AnimatePresence, motion } from "motion/react";
import { useUserProgress, useAssessments } from "@/hooks";
import { levels } from "@/data/levels";
import { getCategoriesByLevelId } from "@/data/categories";
import { getSkillsByCategoryId } from "@/data/skills";
import LevelHero from "@/features/tree/components/LevelHero";
import TreeToolbar from "@/features/tree/components/TreeToolbar";
import CategoryCard from "@/features/tree/components/CategoryCard";
import CategoryCardReadonly from "@/features/tree/components/CategoryCardReadonly";
import LevelGate from "@/features/tree/components/LevelGate";
import { TreeSkeleton } from "@/shared/ui/skeletons";
import {
  calcCategoryScore,
  calcLevelCompletionPercent,
  calcLevelScore,
} from "@/core/domain/scoring";
import { getCategoryMaxScore } from "@/core/domain/weights";

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
  const levelIndex = levels.findIndex((l) => l.id === currentLevel.id);
  const levelMaxScore = levelCategories.reduce(
    (sum, category) => sum + getCategoryMaxScore(category.id),
    0,
  );
  const categoriesDone = levelCategories.filter((category) => {
    const maxScore = getCategoryMaxScore(category.id);
    return maxScore > 0 && calcCategoryScore(category.id, assessmentMap) >= maxScore;
  }).length;

  const hero = (
    <LevelHero
      level={currentLevel}
      accent={accent}
      levelNumber={levelIndex + 1}
      totalLevels={levels.length}
      score={calcLevelScore(currentLevel.id, assessmentMap)}
      maxScore={levelMaxScore}
      categoriesDone={categoriesDone}
      categoriesTotal={levelCategories.length}
      subtopicPercent={calcLevelCompletionPercent(currentLevel.id, assessmentMap)}
    />
  );

  if (progressLoading || assessmentsLoading) {
    return <TreeSkeleton />;
  }

  if (!progress) {
    return (
      <div className="space-y-6">
        {hero}
        <TreeToolbar levels={levels} />
        <AnimatePresence mode="wait">
          <motion.div
            key={slug}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="tree-grid"
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
  const isCurrentOrPast = levelIndex <= currentLevelIndex;
  const isCompleted = levelIndex < currentLevelIndex;

  return (
    <div className="space-y-6">
      {hero}

      <TreeToolbar levels={levels} isAuthenticated />

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
                levelName={currentLevel.name}
              />
              <div className="tree-grid">
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
                levelName={currentLevel.name}
              />
              <div className="tree-grid">
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
            <div className="tree-grid">
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
