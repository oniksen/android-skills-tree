"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { logout } from "@/features/auth/actions/logout";
import {
  useAchievements,
  useAssessments,
  useCurrency,
  useProjectProgress,
  useStreak,
  useUserProgress,
} from "@/hooks";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { useUserSettings } from "@/hooks/useUserSettings";
import { levels } from "@/data/levels";
import { skills } from "@/data/skills";
import { projects } from "@/data/projects";
import { getAchievementCatalog } from "@/data/achievements";
import { STREAK_FREEZE_ITEM_ID, getShopItem } from "@/data/shop";
import { summarizeProfile } from "@/core/domain/profile";
import { getLevelMinScore } from "@/core/domain/weights";
import PageSummaryCard from "@/shared/ui/PageSummaryCard";
import StreakCard from "@/shared/ui/StreakCard";
import { ProfileSkeleton } from "@/shared/ui/skeletons";
import ProfileAchievements from "@/features/profile/components/ProfileAchievements";
import ProfileHeroCard from "@/features/profile/components/ProfileHeroCard";
import ProfileSettingsCard from "@/features/profile/components/ProfileSettingsCard";

const EASE = [0.22, 1, 0.36, 1] as const;

const LEVEL_COLORS: Record<string, string> = {
  junior: "text-green-400",
  middle: "text-blue-400",
  "strong-middle": "text-purple-400",
  senior: "text-amber-400",
};

interface ProfileContentProps {
  onClose?: () => void;
  headingId?: string;
  /** `modal` keeps the single-column flow used inside `ProfileModal`. */
  variant?: "page" | "modal";
}

export default function ProfileContent({
  onClose,
  headingId = "profile-heading",
  variant = "page",
}: ProfileContentProps) {
  const router = useRouter();
  const { email, loading: authLoading } = useFirebaseAuth();
  const { progress, loading: progressLoading } = useUserProgress();
  const { assessmentMap, loading: assessmentsLoading } = useAssessments();
  const { projectMap, loading: projectsLoading } = useProjectProgress();
  const { balance, freezes, loading: currencyLoading } = useCurrency();
  const { currentStreak, longestStreak, loading: streakLoading } = useStreak();
  const { achievements, loading: achievementsLoading } = useAchievements();
  const { settings: userSettings, getTodayCount } = useUserSettings();
  const [loggingOut, setLoggingOut] = useState(false);

  const loading =
    authLoading ||
    progressLoading ||
    assessmentsLoading ||
    projectsLoading ||
    currencyLoading ||
    streakLoading ||
    achievementsLoading;

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut(auth);
      await logout();
      onClose?.();
      router.push("/");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) return <ProfileSkeleton variant={variant} />;

  const currentLevel =
    levels.find((level) => level.id === (progress?.currentLevelId ?? levels[0].id)) ??
    levels[0];

  const catalog = getAchievementCatalog();
  const summary = summarizeProfile(
    {
      xp: progress?.totalScore ?? 0,
      levelName: currentLevel.name,
      crystals: balance,
      currentStreak,
      longestStreak,
      assessedSkills: Object.keys(assessmentMap).length,
      totalSkills: skills.length,
      completedProjects: Object.values(projectMap).filter(Boolean).length,
      totalProjects: projects.length,
    },
    catalog,
    achievements,
  );

  const isPage = variant === "page";
  const levelIndex = levels.findIndex((level) => level.id === currentLevel.id);
  const nextLevel =
    levelIndex >= 0 && levelIndex < levels.length - 1
      ? levels[levelIndex + 1]
      : null;
  const nextThreshold = nextLevel ? getLevelMinScore(nextLevel.id) : null;
  const maxFreezes = getShopItem(STREAK_FREEZE_ITEM_ID)?.maxOwned ?? 3;

  const hero = (
    <ProfileHeroCard
      email={email}
      levelName={summary.levelName}
      levelColor={LEVEL_COLORS[currentLevel.slug] ?? "text-blue-400"}
      xp={summary.xp}
      nextLevelName={nextLevel?.name ?? null}
      nextThreshold={nextThreshold}
      crystals={summary.crystals}
      currentStreak={summary.currentStreak}
      longestStreak={summary.longestStreak}
      headingId={headingId}
    />
  );

  const streakCard = <StreakCard />;

  const skillsCard = (
    <PageSummaryCard
      title="Навыки"
      value={`${summary.assessedSkills}/${summary.totalSkills}`}
      valueLabel="оценено"
      progress={{
        current: summary.assessedSkills,
        max: summary.totalSkills || 1,
      }}
      stats={[
        {
          label: "Осталось",
          value: summary.totalSkills - summary.assessedSkills,
        },
      ]}
    />
  );

  const projectsCard = (
    <PageSummaryCard
      title="Проекты"
      value={`${summary.completedProjects}/${summary.totalProjects}`}
      valueLabel="выполнено"
      progress={{
        current: summary.completedProjects,
        max: summary.totalProjects || 1,
        tone: "green",
      }}
      stats={[
        {
          label: "Осталось",
          value: summary.totalProjects - summary.completedProjects,
        },
      ]}
    />
  );

  const crystalsCard = (
    <PageSummaryCard
      title="Кристаллы"
      value={`${summary.crystals} 💎`}
      valueLabel="баланс"
      stats={[
        { label: "Заморозки", value: `${freezes}/${maxFreezes}` },
      ]}
    />
  );

  const achievementsCard = (
    <ProfileAchievements
      catalog={catalog}
      earnedIds={summary.earnedAchievementIds}
      achievements={achievements}
      assessmentMap={assessmentMap}
      longestStreak={longestStreak}
      limit={isPage ? 6 : undefined}
    />
  );

  const settingsCard = (
    <ProfileSettingsCard
      todayCount={getTodayCount()}
      maxDailyQuestions={userSettings?.maxDailyQuestions ?? 5}
      loggingOut={loggingOut}
      onLogout={handleLogout}
    />
  );

  if (!isPage) {
    return (
      <div className="space-y-6">
        {hero}
        {streakCard}
        {skillsCard}
        {projectsCard}
        {crystalsCard}
        {achievementsCard}
        {settingsCard}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="grid gap-4 md:grid-cols-2 xl:grid-cols-12"
    >
      <div className="md:col-span-2 xl:col-span-12">{hero}</div>
      <div className="xl:col-span-4">{streakCard}</div>
      <div className="xl:col-span-4">{skillsCard}</div>
      <div className="xl:col-span-4">{projectsCard}</div>
      <div className="xl:col-span-4">{crystalsCard}</div>
      <div className="md:col-span-2 xl:col-span-8 xl:row-span-2">
        {achievementsCard}
      </div>
      <div className="md:col-span-2 xl:col-span-4">{settingsCard}</div>
    </motion.div>
  );
}
