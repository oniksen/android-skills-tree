"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { X } from "lucide-react";
import TierIcon from "@/features/achievements/components/TierIcon";
import { runParticleBurst } from "@/features/achievements/lib/particle-burst";
import { prefersReducedMotion } from "@/features/achievements/lib/celebration-utils";

export interface CelebrationItem {
  id: string;
  title: string;
  tier: string | null;
  count: number;
}

export interface AchievementCelebrationProps {
  item: CelebrationItem;
  onDone: () => void;
}

export default function AchievementCelebration({
  item,
  onDone,
}: AchievementCelebrationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = prefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced) return;
    const handle = runParticleBurst(canvas, item.count);
    return () => handle.cancel();
  }, [item.count, reduced]);

  useEffect(() => {
    const duration = reduced ? 1200 : 3600;
    const timer = window.setTimeout(onDone, duration);
    return () => window.clearTimeout(timer);
  }, [item.id, onDone, reduced]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[80] pointer-events-none"
    >
      <span className="sr-only">Получено достижение: {item.title}</span>
      <div className="absolute inset-0 bg-slate-950/45 backdrop-blur-md" />
      <button
        type="button"
        onClick={onDone}
        aria-label="Закрыть анимацию"
        className="absolute right-3 top-3 z-[90] flex h-9 w-9 items-center justify-center rounded-full border border-slate-600/70 bg-slate-900/80 text-slate-200 pointer-events-auto cursor-pointer transition-colors hover:bg-slate-800"
      >
        <X className="h-4 w-4" />
      </button>
      {!reduced && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full pointer-events-none"
          aria-hidden
        />
      )}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="drop-shadow-[0_0_24px_rgba(59,130,246,0.45)]"
        >
          <TierIcon tier={item.tier} className="h-20 w-20 sm:h-28 sm:w-28" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.35 }}
          className="max-w-xs text-base font-semibold text-white sm:text-xl"
        >
          {item.tier ? `Достигнут тир: ${item.tier}` : "Новое достижение"}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
          className="max-w-xs text-sm text-slate-300"
        >
          {item.title}
        </motion.p>
      </div>
    </div>,
    document.body,
  );
}
