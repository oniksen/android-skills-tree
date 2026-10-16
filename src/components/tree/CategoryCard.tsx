"use client";
import { motion } from "motion/react";
import SkillRow from "./SkillRow";
import ProgressBar from "@/components/shared/ProgressBar";
import { calcCategoryScore } from "@/lib/scoring";
import { getCategoryMaxScore } from "@/lib/weights";

interface SkillItem {
  id: string;
  name: string;
  description: string;
  subtopics: string[];
  sortOrder: number;
  requiredForLevelUp: boolean;
}

interface CategoryCardProps {
  categoryId: string;
  name: string;
  skills: SkillItem[];
  assessments: Record<string, { subtopics?: Record<string, boolean> }>;
  isLocked?: boolean;
  index?: number;
}

export default function CategoryCard({ categoryId, name, skills, assessments, isLocked = false, index = 0 }: CategoryCardProps) {
  const sorted = [...skills].sort((a, b) => a.sortOrder - b.sortOrder);
  const maxScore = getCategoryMaxScore(categoryId);
  const catScore = calcCategoryScore(categoryId, assessments);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className={`group relative card-surface overflow-hidden rounded-lg p-5 transition-colors duration-200 ${
        isLocked
          ? "border-amber-500/40 hover:border-amber-500/60"
          : "border-slate-700 hover:border-blue-500/40"
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${
          isLocked ? "via-yellow-400/50" : "via-blue-400/40"
        } to-transparent`}
      />
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg text-white">{name}</h3>
        <span className="flex items-center gap-2">
          {isLocked && (
            <span className="text-xs bg-yellow-600/20 text-yellow-500 px-2 py-0.5 rounded-full font-medium">макс</span>
          )}
          <span className="font-mono text-sm text-slate-500">{catScore}/{maxScore} XP</span>
        </span>
      </div>
      <ProgressBar current={catScore} max={maxScore} tone={isLocked ? "amber" : "coral"} showLabel={false} />
      <div className="mt-3 space-y-0.5">
        {sorted.map(skill => (
          <SkillRow
            key={skill.id}
            skillId={skill.id}
            name={skill.name}
            description={skill.description}
            subtopics={skill.subtopics}
            required={skill.requiredForLevelUp}
            disabled={isLocked}
          />
        ))}
      </div>
    </motion.div>
  );
}