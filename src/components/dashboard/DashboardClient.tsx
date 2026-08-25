"use client";

import { useUserProgress, useAssessments, useProjectProgress } from "@/hooks";
import { levels } from "@/data/levels";
import { skills } from "@/data/skills";
import { projects } from "@/data/projects";
import LevelProgressCard from "@/components/dashboard/LevelProgressCard";
import QuickStats from "@/components/dashboard/QuickStats";
import NextMilestone from "@/components/dashboard/NextMilestone";

const levelColors: Record<string, string> = {
  junior: "text-green-400",
  middle: "text-blue-400",
  "strong-middle": "text-purple-400",
  senior: "text-amber-400",
};

export default function DashboardClient() {
  const { progress, loading: progressLoading } = useUserProgress();
  const { assessmentMap, loading: assessmentsLoading } = useAssessments();
  const { projectMap, loading: projectsLoading } = useProjectProgress();

  if (progressLoading || assessmentsLoading || projectsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400">Загрузка...</div>
      </div>
    );
  }

  const currentLevelId = progress?.currentLevelId || levels[0].id;
  const currentLevel = levels.find((l) => l.id === currentLevelId) || levels[0];
  const currentIndex = levels.findIndex((l) => l.id === currentLevelId);
  const nextLevel =
    currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;

  const currentScore = progress?.totalScore || 0;
  const totalSkills = skills.length;
  const assessedSkills = Object.keys(assessmentMap).length;
  const completedProjects = Object.values(projectMap).filter(Boolean).length;
  const totalProjects = projects.length;
  const canLevelUp = nextLevel ? currentScore >= nextLevel.minScore : false;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Дашборд</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <LevelProgressCard
          currentLevel={currentLevel.name}
          currentScore={currentScore}
          nextLevel={nextLevel?.name || null}
          nextThreshold={nextLevel?.minScore || null}
          levelColor={levelColors[currentLevel.slug] || "text-blue-400"}
        />
        <QuickStats
          totalSkills={totalSkills}
          assessedSkills={assessedSkills}
          completedProjects={completedProjects}
          totalProjects={totalProjects}
        />
      </div>
      {nextLevel && (
        <NextMilestone
          items={[
            {
              label: `Набрать ${nextLevel.minScore} XP`,
              done: currentScore >= nextLevel.minScore,
            },
          ]}
          canLevelUp={canLevelUp}
          nextLevelName={nextLevel.name}
        />
      )}
    </div>
  );
}
