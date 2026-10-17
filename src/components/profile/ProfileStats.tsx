"use client";

import type { ReactNode } from "react";
import AnimatedNumber from "@/components/shared/AnimatedNumber";

interface ProfileStatsProps {
  xp: number;
  levelName: string;
  crystals: number;
  currentStreak: number;
  longestStreak: number;
  assessedSkills: number;
  totalSkills: number;
  completedProjects: number;
  totalProjects: number;
  earnedAchievements: number;
  totalAchievements: number;
}

export default function ProfileStats(props: ProfileStatsProps) {
  const items: { label: string; value: ReactNode }[] = [
    { label: "XP", value: <AnimatedNumber value={props.xp} /> },
    { label: "Уровень", value: props.levelName },
    { label: "Кристаллы", value: <AnimatedNumber value={props.crystals} /> },
    { label: "Стрик", value: `${props.currentStreak} / ${props.longestStreak}` },
    {
      label: "Навыки",
      value: `${props.assessedSkills}/${props.totalSkills}`,
    },
    {
      label: "Проекты",
      value: `${props.completedProjects}/${props.totalProjects}`,
    },
    {
      label: "Достижения",
      value: `${props.earnedAchievements}/${props.totalAchievements}`,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="card-surface rounded-lg p-4">
          <p className="font-mono text-[11px] uppercase tracking-wide text-slate-500">
            {item.label}
          </p>
          <p className="mt-1 font-mono text-lg font-semibold text-white">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
