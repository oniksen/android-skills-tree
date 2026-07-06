"use client";

import { useEffect } from "react";

export default function CelebrationModal({
  open,
  levelName,
  onClose,
}: {
  open: boolean;
  levelName: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-white mb-2">Новый уровень!</h2>
        <p className="text-slate-400 mb-6">Вы достигли уровня <span className="text-blue-400 font-semibold">{levelName}</span></p>
        <button onClick={onClose} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
          Продолжить
        </button>
      </div>
    </div>
  );
}
