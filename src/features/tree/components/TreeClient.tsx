"use client";

import { AnimatePresence, motion } from "motion/react";
import { useUserProgress, useAssessments } from "@/hooks";
import { levels } from "@/data/levels";
import { getCategoriesByLevelId } from "@/data/categories";
import { getSkillsByCategoryId } from "@/data/skills";
import LevelHero from "@/features/tree/components/LevelHero";
import TreeToolbar from "@/features/tree/components/TreeToolbar";
import CategorySummaryCard from "@/features/tree/components/CategorySummaryCard";
import LevelGate from "@/features/tree/components/LevelGate";
import { TreeSkeleton } from "@/shared/ui/skeletons";
import {
  calcCategoryScore,
  calcLevelCompletionPercent,
  calcLevelScore,
  isSkillComplete,
} from "@/core/domain/scoring";
import { getCategoryMaxScore, getRequiredSkillsScore } from "@/core/domain/weights";
import { categoryHref } from "@/lib/viewport";

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

  const categoryCards = levelCategories.map((category) => {
    const maxScore = getCategoryMaxScore(category.id);
    const score = calcCategoryScore(category.id, assessmentMap);
    const skillsDone = category.skills.filter((skill) =>
      isSkillComplete(skill.id, assessmentMap[skill.id]?.subtopics),
    ).length;

    return {
      ...category,
      maxScore,
      score,
      skillsDone,
      isComplete: maxScore > 0 && score >= maxScore,
    };
  });

  const categoriesDone = categoryCards.filter(
    (category) => category.isComplete,
  ).length;

  const hero = (
    <LevelHero
      level={currentLevel}
      accent={accent}
      levelNumber={levelIndex + 1}
      totalLevels={levels.length}
      score={calcLevelScore(currentLevel.id, assessmentMap)}
      maxScore={levelMaxScore}
      requiredScore={getRequiredSkillsScore(currentLevel.id)}
      categoriesDone={categoriesDone}
      categoriesTotal={levelCategories.length}
      subtopicPercent={calcLevelCompletionPercent(currentLevel.id, assessmentMap)}
    />
  );

  const grid = (muted: boolean) => (
    <div className="tree-grid auto-rows-fr">
      {categoryCards.map((category) => (
        <CategorySummaryCard
          key={category.id}
          href={categoryHref(slug, category.id)}
          name={category.name}
          score={category.score}
          maxScore={category.maxScore}
          skillsDone={category.skillsDone}
          skillsTotal={category.skills.length}
          studyHref={
            category.studyMaterial
              ? `${categoryHref(slug, category.id)}/study`
              : undefined
          }
          isComplete={category.isComplete}
          muted={muted}
        />
      ))}
    </div>
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
          >
            {grid(false)}
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
            <LevelGate
              isUnlocked={false}
              isCompleted={false}
              levelName={currentLevel.name}
            />
          )}
          {isCompleted && (
            <LevelGate
              isUnlocked={false}
              isCompleted={true}
              levelName={currentLevel.name}
            />
          )}
          {grid(!isCurrentOrPast)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
