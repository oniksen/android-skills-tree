"use client";
import { useState } from "react";
import { resetLevelProgress } from "@/app/actions/reset";

export default function ResetLevelButton({ levelId, levelName }: { levelId: string; levelName: string }) {
  const [confirming, setConfirming] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleReset = async () => {
    setResetting(true);
    try {
      await resetLevelProgress(levelId);
      window.location.reload();
    } catch { setResetting(false); setConfirming(false); }
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-red-400">Уверены?</span>
        <button onClick={handleReset} disabled={resetting}
          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg">
          {resetting ? "..." : "Да, сбросить"}
        </button>
        <button onClick={() => setConfirming(false)}
          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg">
          Отмена
        </button>
      </div>
    );
  }
  return (
    <button onClick={() => setConfirming(true)}
      className="text-sm text-slate-500 hover:text-red-400 transition-colors">
      Сбросить прогресс {levelName}
    </button>
  );
}
