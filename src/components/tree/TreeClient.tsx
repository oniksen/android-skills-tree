"use client";

import { useUserProgress, useAssessments } from "@/hooks";
import { levels } from "@/data/levels";
import { categories } from "@/data/categories";
import { skills } from "@/data/skills";
import LevelTabs from "@/components/tree/LevelTabs";
import CategoryCard from "@/components/tree/CategoryCard";
import CategoryCardReadonly from "@/components/tree/CategoryCardReadonly";
import LevelGate from "@/components/tree/LevelGate";
import Legend from "@/components/tree/Legend";

function calcSkillXp(subtopics: string[], subtopicState: Record<string, boolean> | undefined, maxWeight: number): number {
  if (subtopics.length === 0) return 0;
  const completed = subtopics.filter((st) => subtopicState?.[st]).length;
  return Math.round((completed / subtopics.length) * maxWeight);
}

function calcCategoryScore(
  catSkills: { id: string; subtopics: string[]; maxWeight: number }[],
  assessmentMap: Record<string, { subtopics?: Record<string, boolean> }>,
): number {
  return catSkills.reduce((sum, s) => {
    return sum + calcSkillXp(s.subtopics, assessmentMap[s.id]?.subtopics, s.maxWeight);
  }, 0);
}

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

  if (progressLoading || assessmentsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400">Загрузка...</div>
      </div>
    );
  }

  if (!progress) {
    return (
      <>
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">
            {currentLevel.name}
          </h1>
          <p className="text-slate-400">{currentLevel.description}</p>
        </div>
        <LevelTabs levels={levels} />
        <Legend />
        <div className="grid gap-4 md:grid-cols-2">
          {levelCategories.map((cat) => (
            <CategoryCardReadonly
              key={cat.id}
              name={cat.name}
              maxScore={cat.maxScore}
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
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">
            {currentLevel.name}
          </h1>
          <p className="text-slate-400">{currentLevel.description}</p>
        </div>
        <div className="text-right text-sm text-slate-500">
          <div>Всего XP: {currentScore}</div>
          {nextLevel && (
            <div>
              До {nextLevel.name}:{" "}
              {Math.max(0, nextLevel.minScore - currentScore)} XP
            </div>
          )}
        </div>
      </div>

      <LevelTabs levels={levels} />
      <Legend isAuthenticated={true} />

      {!isCurrentOrPast && (
        <LevelGate
          isUnlocked={false}
          isCompleted={false}
          requiredScore={levels[levelIndex - 1]?.maxScore || 9999}
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
          {levelCategories.map((cat) => {
            const catScore = calcCategoryScore(cat.skills, assessmentMap);
            return (
              <CategoryCard
                key={cat.id}
                name={cat.name}
                maxScore={cat.maxScore}
                skills={cat.skills}
                assessments={assessmentMap}
                isLocked={catScore >= cat.maxScore}
              />
            );
          })}
        </div>
      )}
    </>
  );
}

function getCategoriesByLevelId(levelId: string) {
  return categories
    .filter((c) => c.levelId === levelId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

function getSkillsByCategoryId(categoryId: string) {
  return skills
    .filter((s) => s.categoryId === categoryId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
