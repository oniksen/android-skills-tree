"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-xs transition-colors ${
          open
            ? "border-orange-500/50 bg-orange-500/10 text-orange-600"
            : "border-slate-700 text-slate-500 hover:border-orange-500/40 hover:text-orange-600"
        }`}
        title="Стрик дней подряд"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="text-sm leading-none">🔥</span>
        <span className="font-semibold">{currentStreak}</span>
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
          >
            <StreakPopover onClose={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}