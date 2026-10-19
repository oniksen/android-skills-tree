"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { AchievementDef } from "@/data/achievements";

interface ProfileAchievementsProps {
  catalog: AchievementDef[];
  earnedIds: string[];
}

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ProfileAchievements({
  catalog,
  earnedIds,
}: ProfileAchievementsProps) {
  const earned = new Set(earnedIds);
  const earnedDefs = catalog.filter((def) => earned.has(def.id));

  return (
    <section className="card-surface rounded-lg p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-mono text-sm font-semibold text-slate-300">
          <span className="text-slate-600">##</span> Достижения{" "}
          <span className="text-slate-500">
            [{earned.size}/{catalog.length}]
          </span>
        </h2>
        <Link
          href="/achievements"
          className="font-mono text-xs text-blue-600 underline-offset-4 hover:underline"
        >
          все достижения →
        </Link>
      </div>
      {earnedDefs.length === 0 ? (
        <p className="font-mono text-xs text-slate-500">
          Открытых достижений пока нет.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {earnedDefs.map((def, index) => (
            <motion.li
              key={def.id}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -20px 0px" }}
              transition={{ duration: 0.3, delay: (index % 8) * 0.03, ease: EASE }}
              className="flex items-start gap-3 rounded-lg border border-blue-500/40 bg-blue-500/10 p-3"
            >
              <span className="text-2xl" aria-hidden>
                {def.icon}
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-white">{def.title}</p>
                <p className="mt-1 text-xs text-slate-400">{def.condition}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </section>
  );
}
