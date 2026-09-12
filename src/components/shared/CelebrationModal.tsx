"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Confetti from "@/components/shared/Confetti";
import { Trophy } from "lucide-react";

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
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            key="card"
            initial={{ opacity: 0, scale: 0.85, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 12 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className="relative mx-4 w-full max-w-sm overflow-hidden rounded-3xl bg-slate-900/95 p-8 text-center shadow-2xl shadow-indigo-900/40 border border-white/[0.08]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600/25 via-indigo-500/25 to-fuchsia-500/25 blur-3xl" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />

            <Confetti />

            <motion.div
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 15, delay: 0.12 }}
              className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-fuchsia-500 text-white shadow-xl shadow-indigo-600/40"
            >
              <Trophy className="h-9 w-9" strokeWidth={2.2} />
              <span className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500 to-fuchsia-500 blur-xl opacity-60" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative text-2xl font-bold tracking-tight mb-1"
            >
              <span className="text-gradient">Новый уровень!</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative text-slate-400 mb-7"
            >
              Вы достигли уровня{" "}
              <span className="font-semibold text-emerald-400">{levelName}</span>
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onClose}
              className="shine relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 py-3 font-semibold text-white shadow-lg shadow-indigo-900/40"
            >
              <span className="relative z-10">Продолжить</span>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}