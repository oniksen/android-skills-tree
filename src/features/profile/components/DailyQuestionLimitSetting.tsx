"use client";

import { useRef } from "react";
import { useUserSettings } from "@/hooks/useUserSettings";

export default function DailyQuestionLimitSetting() {
  const { settings, saveSettings } = useUserSettings();
  const inputRef = useRef<HTMLInputElement>(null);
  const current = settings?.maxDailyQuestions ?? 5;

  async function handleSave() {
    const n = Number(inputRef.current?.value);
    if (!n || n < 1 || n > 20) return;
    await saveSettings({ maxDailyQuestions: n });
  }

  return (
    <div className="flex items-center gap-2">
      <input
        key={current}
        ref={inputRef}
        type="number"
        min={1}
        max={20}
        defaultValue={current}
        className="w-20 rounded-md border border-slate-700/70 bg-white/[0.02] px-2 py-1.5 font-mono text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
      />
      <button
        type="button"
        onClick={handleSave}
        className="rounded-md border border-blue-500/40 bg-blue-500/10 px-3 py-1.5 font-mono text-xs text-blue-600 transition-colors hover:bg-blue-500/20"
      >
        сохранить
      </button>
      <span className="font-mono text-xs text-slate-500">
        по умолчанию 5
      </span>
    </div>
  );
}