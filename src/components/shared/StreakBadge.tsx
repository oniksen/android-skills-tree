"use client";

import { useEffect, useRef, useState } from "react";
import { useStreak } from "@/hooks";
import StreakPopover from "@/components/shared/StreakPopover";

export default function StreakBadge() {
  const { currentStreak, loading } = useStreak();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [open]);

  if (loading) return <div className="w-10 h-6" aria-hidden />;

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-colors ${
          open ? "bg-orange-500/15 text-orange-400" : "text-slate-400 hover:text-orange-400"
        }`}
        title="Стрик дней подряд"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="text-lg leading-none">🔥</span>
        <span className="font-semibold">{currentStreak}</span>
      </button>
      {open && <StreakPopover onClose={() => setOpen(false)} />}
    </div>
  );
}