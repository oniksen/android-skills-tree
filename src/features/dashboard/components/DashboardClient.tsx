"use client";

import { motion } from "motion/react";
import { useUserProgress, useAssessments, useProjectProgress } from "@/hooks";
import { levels } from "@/data/levels";
import { skills } from "@/data/skills";
import { projects } from "@/data/projects";
import LevelProgressCard from "@/features/dashboard/components/LevelProgressCard";
import QuickStats from "@/features/dashboard/components/QuickStats";
import NextMilestone from "@/features/dashboard/components/NextMilestone";
import StreakCard from "@/features/dashboard/components/StreakCard";
import PageHero from "@/shared/ui/PageHero";
import { DashboardSkeleton } from "@/shared/ui/skeletons";
import { getLevelMinScore } from "@/core/domain/weights";

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
    return <DashboardSkeleton />;
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
  const canLevelUp = nextLevel ? currentScore >= getLevelMinScore(nextLevel.id) : false;
  const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: EASE },
    },
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <PageHero
          title="Дашборд"
          description="Ваш прогресс на пути к senior."
          aside={
            <LevelProgressCard
              currentLevel={currentLevel.name}
              currentScore={currentScore}
              nextLevel={nextLevel?.name || null}
              nextThreshold={nextLevel ? getLevelMinScore(nextLevel.id) : null}
              levelColor={levelColors[currentLevel.slug] || "text-blue-400"}
            />
          }
        />
      </motion.div>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        className="grid items-start gap-4 md:grid-cols-2 2xl:grid-cols-3"
      >
        <motion.div variants={cardVariants}>
          <QuickStats
            totalSkills={totalSkills}
            assessedSkills={assessedSkills}
            completedProjects={completedProjects}
            totalProjects={totalProjects}
          />
        </motion.div>
        <motion.div variants={cardVariants}>
          <StreakCard />
        </motion.div>
        {nextLevel && (
          <motion.div variants={cardVariants}>
            <NextMilestone
              items={[
                {
                  label: `Набрать ${getLevelMinScore(nextLevel.id)} XP`,
                  done: currentScore >= getLevelMinScore(nextLevel.id),
                },
              ]}
              canLevelUp={canLevelUp}
              nextLevelName={nextLevel.name}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}