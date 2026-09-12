"use client";

import { motion } from "motion/react";
import { useUserProgress, useAssessments, useProjectProgress } from "@/hooks";
import { levels } from "@/data/levels";
import { skills } from "@/data/skills";
import { projects } from "@/data/projects";
import LevelProgressCard from "@/components/dashboard/LevelProgressCard";
import QuickStats from "@/components/dashboard/QuickStats";
import NextMilestone from "@/components/dashboard/NextMilestone";
import StreakCard from "@/components/dashboard/StreakCard";

const levelColors: Record<string, string> = {
  junior: "text-green-400",
  middle: "text-blue-400",
  "strong-middle": "text-purple-400",
  senior: "text-amber-400",
};

const EASE = [0.22, 1, 0.36, 1] as const;

export default function DashboardClient() {
  const { progress, loading: progressLoading } = useUserProgress();
  const { assessmentMap, loading: assessmentsLoading } = useAssessments();
  const { projectMap, loading: projectsLoading } = useProjectProgress();

  if (progressLoading || assessmentsLoading || projectsLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex items-center gap-3 text-slate-400">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-700 border-t-blue-400" />
          Загрузка...
        </div>
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
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-white">Дашборд</h1>
        <p className="mt-1 text-slate-400">Ваш прогресс на пути к senior.</p>
      </motion.div>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        className="grid gap-6 md:grid-cols-2"
      >
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } } }}
        >
          <LevelProgressCard
            currentLevel={currentLevel.name}
            currentScore={currentScore}
            nextLevel={nextLevel?.name || null}
            nextThreshold={nextLevel?.minScore || null}
            levelColor={levelColors[currentLevel.slug] || "text-blue-400"}
          />
        </motion.div>
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } } }}
        >
          <QuickStats
            totalSkills={totalSkills}
            assessedSkills={assessedSkills}
            completedProjects={completedProjects}
            totalProjects={totalProjects}
          />
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1, ease: EASE }}
      >
        <StreakCard />
      </motion.div>
      {nextLevel && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.16, ease: EASE }}
        >
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
        </motion.div>
      )}
    </div>
  );
}