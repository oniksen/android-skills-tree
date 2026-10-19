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
import { levels } from "@/data/levels";
import { skills } from "@/data/skills";
import { projects } from "@/data/projects";
import { getAchievementCatalog } from "@/data/achievements";
import { summarizeProfile } from "@/core/domain/profile";
import { ProfileSkeleton } from "@/shared/ui/skeletons";
import ProfileStats from "@/features/profile/components/ProfileStats";
import ProfileAchievements from "@/features/profile/components/ProfileAchievements";
import ProfileLinks from "@/features/profile/components/ProfileLinks";
import ThemeSetting from "@/features/profile/components/ThemeSetting";
import ThemeIcon from "@/shared/ui/ThemeIcon";

const EASE = [0.22, 1, 0.36, 1] as const;

interface ProfileContentProps {
  onClose?: () => void;
  headingId?: string;
}

export default function ProfileContent({
  onClose,
  headingId = "profile-heading",
}: ProfileContentProps) {
  const router = useRouter();
  const { email, loading: authLoading } = useFirebaseAuth();
  const { progress, loading: progressLoading } = useUserProgress();
  const { assessmentMap, loading: assessmentsLoading } = useAssessments();
  const { projectMap, loading: projectsLoading } = useProjectProgress();
  const { balance, loading: currencyLoading } = useCurrency();
  const { currentStreak, longestStreak, loading: streakLoading } = useStreak();
  const { achievements, loading: achievementsLoading } = useAchievements();
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

  if (loading) return <ProfileSkeleton />;

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

  return (
    <div className="space-y-6">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="flex items-center gap-4"
      >
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-500/40 bg-blue-500/10 font-mono text-xl font-bold text-blue-600">
          {initial}
        </span>
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

      <ProfileAchievements
        catalog={catalog}
        earnedIds={summary.earnedAchievementIds}
      />

      <ProfileLinks onNavigate={onClose} />

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
    </div>
  );
}
