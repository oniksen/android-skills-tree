"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import Confetti from "@/shared/ui/Confetti";

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

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            key="card"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="relative mx-4 w-full max-w-md overflow-hidden rounded-lg border border-slate-700 bg-slate-900/98 shadow-[0_20px_60px_rgba(26,25,21,0.28)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-8 items-center gap-1.5 border-b border-slate-700 px-3.5">
              <span className="font-mono text-[11px] text-slate-500">
                ~/build/level-up
              </span>
            </div>

            <Confetti />

            <div className="p-8 font-mono text-center">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.35 }}
                className="mb-5 space-y-1.5 text-left"
              >
                <p className="text-sm text-slate-500">
                  <span className="text-blue-600">$</span> ./level-up
                </p>
                <p className="text-sm text-emerald-600">✓ build successful</p>
                <p className="text-sm text-slate-400">
                  <span className="text-emerald-600">✓</span> уровень{" "}
                  <span className="font-semibold text-white">{levelName}</span>{" "}
                  разблокирован
                </p>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="mb-6 text-2xl font-bold tracking-tight"
              >
                <span className="text-gradient">Новый уровень</span>
              </motion.h2>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="w-full rounded-md bg-blue-600 py-3 font-semibold text-[#faf9f5] transition-colors hover:bg-blue-700"
              >
                продолжить
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
