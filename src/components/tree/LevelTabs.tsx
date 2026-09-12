"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";

interface Level {
  slug: string;
  name: string;
  levelOrder: number;
}

const levelColors: Record<string, { text: string; shadow: string; border: string }> = {
  junior: {
    text: "text-green-400",
    shadow: "shadow-[0_0_18px_rgba(34,197,94,0.35)]",
    border: "border-green-400/40",
  },
  middle: {
    text: "text-blue-400",
    shadow: "shadow-[0_0_18px_rgba(59,130,246,0.35)]",
    border: "border-blue-400/40",
  },
  "strong-middle": {
    text: "text-purple-400",
    shadow: "shadow-[0_0_18px_rgba(139,92,246,0.35)]",
    border: "border-purple-400/40",
  },
  senior: {
    text: "text-amber-400",
    shadow: "shadow-[0_0_18px_rgba(245,158,11,0.35)]",
    border: "border-amber-400/40",
  },
};

export default function LevelTabs({ levels }: { levels: Level[] }) {
  const params = useParams();
  const currentSlug = (params?.slug as string) || levels[0]?.slug;

  return (
    <div className="flex gap-2 flex-nowrap overflow-x-auto nav-md:flex-wrap nav-md:overflow-x-visible border-b border-white/[0.06] pb-4">
      {[...levels]
        .sort((a, b) => a.levelOrder - b.levelOrder)
        .map((level) => {
          const isActive = currentSlug === level.slug;
          const color = levelColors[level.slug] || levelColors.junior;
          return (
            <Link
              key={level.slug}
              href={`/tree/${level.slug}`}
              className={`relative shrink-0 rounded-xl px-4 py-2.5 text-base font-medium transition-colors duration-200 ${
                isActive ? color.text : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="level-tab"
                  className={`absolute inset-0 rounded-xl border ${color.border} bg-slate-900 ${color.shadow}`}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  initial={false}
                />
              )}
              <span className="relative">{level.name}</span>
            </Link>
          );
        })}
    </div>
  );
}