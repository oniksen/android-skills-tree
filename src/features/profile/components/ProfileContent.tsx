"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { Loader2, LogOut } from "lucide-react";
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
import { summarizeProfile } from "@/core/domain/profile";
import { getLevelMinScore } from "@/core/domain/weights";
import PageHero from "@/shared/ui/PageHero";
import PageSummaryCard from "@/shared/ui/PageSummaryCard";
import { ProfileSkeleton } from "@/shared/ui/skeletons";
import ProfileStats from "@/features/profile/components/ProfileStats";
import ProfileAchievements from "@/features/profile/components/ProfileAchievements";
import ProfileLinks from "@/features/profile/components/ProfileLinks";
import ThemeSetting from "@/features/profile/components/ThemeSetting";
import GroqKeySetting from "@/features/profile/components/GroqKeySetting";
import DailyQuestionLimitSetting from "@/features/profile/components/DailyQuestionLimitSetting";
import ThemeIcon from "@/shared/ui/ThemeIcon";

const EASE = [0.22, 1, 0.36, 1] as const;

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
  const { balance, loading: currencyLoading } = useCurrency();
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

  const levelName =
    levels.find((level) => level.id === (progress?.currentLevelId ?? levels[0].id))
      ?.name ?? levels[0].name;

  const catalog = getAchievementCatalog();
  const summary = summarizeProfile(
    {
      xp: progress?.totalScore ?? 0,
      levelName,
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

  const initial = (email?.trim()?.[0] ?? "?").toUpperCase();
  const isPage = variant === "page";
  const currentLevelIndex = levels.findIndex(
    (level) => level.id === (progress?.currentLevelId ?? levels[0].id),
  );
  const nextLevel =
    currentLevelIndex >= 0 && currentLevelIndex < levels.length - 1
      ? levels[currentLevelIndex + 1]
      : null;
  const nextThreshold = nextLevel ? getLevelMinScore(nextLevel.id) : null;

  const avatar = (
    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-500/40 bg-blue-500/10 font-mono text-xl font-bold text-blue-600">
      {initial}
    </span>
  );

  const statsBlock = (
    <ProfileStats
      xp={summary.xp}
      levelName={summary.levelName}
      crystals={summary.crystals}
      currentStreak={summary.currentStreak}
      longestStreak={summary.longestStreak}
      assessedSkills={summary.assessedSkills}
      totalSkills={summary.totalSkills}
      completedProjects={summary.completedProjects}
      totalProjects={summary.totalProjects}
      earnedAchievements={summary.earnedAchievements}
      totalAchievements={summary.totalAchievements}
    />
  );

  const achievementsBlock = (
    <ProfileAchievements
      catalog={catalog}
      earnedIds={summary.earnedAchievementIds}
      achievements={achievements}
      assessmentMap={assessmentMap}
      longestStreak={longestStreak}
    />
  );

  const linksBlock = <ProfileLinks onNavigate={onClose} />;

  const aiBlock = (
    <section className="card-surface rounded-lg p-5">
      <h2 className="mb-4 flex items-center gap-2 font-mono text-sm font-semibold text-slate-300">
        <span className="text-slate-600">##</span> ИИ (Groq)
      </h2>
      <GroqKeySetting />
      <p className="mt-3 font-mono text-xs text-slate-500">
        сегодня: {getTodayCount()}/{userSettings?.maxDailyQuestions ?? 5}
      </p>
      <div className="mt-4">
        <p className="mb-2 font-mono text-xs text-slate-400">
          макс. вопросов в день
        </p>
        <DailyQuestionLimitSetting />
      </div>
    </section>
  );

  const appearanceBlock = (
    <section className="card-surface rounded-lg p-5">
      <h2 className="mb-4 flex items-center gap-2 font-mono text-sm font-semibold text-slate-300">
        <span className="text-slate-600">##</span> Оформление
        <ThemeIcon theme="light" className="theme-icon-sun h-4 w-4 text-slate-500" />
        <ThemeIcon theme="dark" className="theme-icon-moon h-4 w-4 text-slate-500" />
      </h2>
      <ThemeSetting />
      <button
        type="button"
        onClick={handleLogout}
        disabled={loggingOut}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-md border border-red-500/40 bg-red-500/10 py-2.5 font-mono text-xs text-red-500 transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loggingOut ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogOut className="h-4 w-4" />
        )}
        выйти из аккаунта
      </button>
    </section>
  );

  return (
    <div className="space-y-6">
      {isPage ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <PageHero
            leading={avatar}
            title="Профиль"
            meta={
              <div className="space-y-0.5">
                <p className="truncate font-mono text-xs text-slate-500">
                  {email ?? "—"}
                </p>
                <p className="truncate font-mono text-xs text-slate-600">
                  уровень: {summary.levelName}
                </p>
              </div>
            }
            aside={
              <PageSummaryCard
                title="Уровень"
                value={summary.levelName}
                valueLabel="текущий"
                progress={
                  nextThreshold
                    ? { current: summary.xp, max: nextThreshold }
                    : undefined
                }
                stats={[
                  { label: "XP", value: summary.xp },
                  nextLevel && nextThreshold
                    ? {
                        label: `До ${nextLevel.name}`,
                        value: Math.max(0, nextThreshold - summary.xp),
                      }
                    : { label: "Статус", value: "максимум" },
                ]}
              />
            }
          />
        </motion.div>
      ) : (
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="flex items-center gap-4"
        >
          {avatar}
          <div className="min-w-0">
            <h1
              id={headingId}
              className="text-xl font-bold tracking-tight text-white"
            >
              <span className="text-blue-600">#</span> Профиль
            </h1>
            <p className="truncate font-mono text-xs text-slate-500">
              {email ?? "—"}
            </p>
            <p className="truncate font-mono text-xs text-slate-600">
              уровень: {summary.levelName}
            </p>
          </div>
        </motion.header>
      )}

      {isPage ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] xl:items-start">
          <div className="space-y-6">
            {statsBlock}
            {achievementsBlock}
          </div>
          <div className="space-y-6">
            {linksBlock}
            {aiBlock}
            {appearanceBlock}
          </div>
        </div>
      ) : (
        <>
          {statsBlock}
          {achievementsBlock}
          {linksBlock}
          {aiBlock}
          {appearanceBlock}
        </>
      )}
    </div>
  );
}
