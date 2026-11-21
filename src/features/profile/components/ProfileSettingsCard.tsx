"use client";

import { Loader2, LogOut } from "lucide-react";
import ThemeIcon from "@/shared/ui/ThemeIcon";
import GroqKeySetting from "@/features/profile/components/GroqKeySetting";
import DailyQuestionLimitSetting from "@/features/profile/components/DailyQuestionLimitSetting";
import ThemeSetting from "@/features/profile/components/ThemeSetting";

interface ProfileSettingsCardProps {
  todayCount: number;
  maxDailyQuestions: number;
  loggingOut: boolean;
  onLogout: () => void;
}

export default function ProfileSettingsCard({
  todayCount,
  maxDailyQuestions,
  loggingOut,
  onLogout,
}: ProfileSettingsCardProps) {
  return (
    <section className="card-surface flex h-full flex-col rounded-lg p-5">
      <h2 className="mb-4 flex items-center gap-2 font-mono text-sm font-semibold text-slate-300">
        <span className="text-slate-600">##</span> Настройки
      </h2>

      <div>
        <h3 className="font-mono text-xs font-semibold uppercase tracking-wide text-slate-500">
          ИИ (Groq)
        </h3>
        <div className="mt-2">
          <GroqKeySetting />
        </div>
        <p className="mt-3 font-mono text-xs text-slate-500">
          сегодня: {todayCount}/{maxDailyQuestions}
        </p>
        <div className="mt-3">
          <p className="mb-2 font-mono text-xs text-slate-400">
            макс. вопросов в день
          </p>
          <DailyQuestionLimitSetting />
        </div>
      </div>

      <div className="mt-5 border-t border-white/[0.06] pt-4">
        <h3 className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wide text-slate-500">
          Оформление
          <ThemeIcon theme="light" className="theme-icon-sun h-4 w-4 text-slate-500" />
          <ThemeIcon theme="dark" className="theme-icon-moon h-4 w-4 text-slate-500" />
        </h3>
        <div className="mt-3">
          <ThemeSetting />
        </div>
      </div>

      <button
        type="button"
        onClick={onLogout}
        disabled={loggingOut}
        className="mt-auto flex w-full items-center justify-center gap-2 rounded-md border border-red-500/40 bg-red-500/10 py-2.5 font-mono text-xs text-red-500 transition-colors hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
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
}
