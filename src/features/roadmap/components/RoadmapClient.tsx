"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowDown, ArrowUp, Check, type LucideIcon } from "lucide-react";
import { useUserProgress, useAssessments } from "@/hooks";
import { levels } from "@/data/levels";
import { categories } from "@/data/categories";
import { skills } from "@/data/skills";
import GapList from "@/features/roadmap/components/GapList";
import RoadmapDiagram from "@/features/roadmap/components/RoadmapDiagram";
import RoadmapScrollbar from "@/features/roadmap/components/RoadmapScrollbar";
import PageHero from "@/shared/ui/PageHero";
import PageSummaryCard from "@/shared/ui/PageSummaryCard";
import { RoadmapSkeleton } from "@/shared/ui/skeletons";
import { calcSkillCompletionPercent } from "@/core/domain/scoring";
import { getSkillWeight } from "@/core/domain/weights";
import { sortRoadmapItems, type RoadmapSortKey } from "@/core/domain/roadmap-sort";
import { buildRoadmapGraph } from "@/core/domain/roadmap-graph";
import { ROADMAP_LINKS } from "@/data/roadmap-links";

const EASE = [0.22, 1, 0.36, 1] as const;

const SORT_OPTIONS: { key: RoadmapSortKey; label: string; icon: LucideIcon }[] = [
  { key: "xp-asc", label: "Опыт ↑", icon: ArrowUp },
  { key: "xp-desc", label: "Опыт ↓", icon: ArrowDown },
];

export default function RoadmapClient() {
  const { progress, loading: progressLoading } = useUserProgress();
  const { assessmentMap, loading: assessmentsLoading } = useAssessments();
  const [sortKey, setSortKey] = useState<RoadmapSortKey>("xp-desc");
  const [hideCompleted, setHideCompleted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bleedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (progressLoading || assessmentsLoading) return;
    const element = bleedRef.current;
    if (!element) return;

    const measure = () => {
      const rect = element.getBoundingClientRect();
      if (rect.width === 0) return;
      const viewportWidth = document.documentElement.clientWidth;
      element.style.setProperty(
        "--roadmap-bleed-left",
        `${Math.max(0, rect.left)}px`,
      );
      element.style.setProperty(
        "--roadmap-bleed-right",
        `${Math.max(0, viewportWidth - rect.right)}px`,
      );
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [progressLoading, assessmentsLoading]);

  if (progressLoading || assessmentsLoading) {
    return <RoadmapSkeleton />;
  }

  const currentLevelId = progress?.currentLevelId || levels[0]?.id || "";
  const currentLevel = levels.find((l) => l.id === currentLevelId) || levels[0];

  const relevantCategories = categories
    .filter((c) => c.levelId === currentLevel.id)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const items: {
    skillId: string;
    skillName: string;
    categoryName: string;
    levelName: string;
    completionPercent: number;
    currentScore: number;
    maxScore: number;
  }[] = [];

  relevantCategories.forEach((cat) => {
    const catSkills = skills.filter((s) => s.categoryId === cat.id);

    catSkills.forEach((skill) => {
      items.push({
        skillId: skill.id,
        skillName: skill.name,
        categoryName: cat.name,
        levelName: currentLevel.name,
        completionPercent: calcSkillCompletionPercent(
          skill.id,
          assessmentMap[skill.id]?.subtopics,
        ),
        currentScore: assessmentMap[skill.id]?.score || 0,
        maxScore: getSkillWeight(skill.id),
      });
    });
  });

  const graph = buildRoadmapGraph({
    levelId: currentLevel.id,
    assessmentMap,
    links: ROADMAP_LINKS,
  });

  const sortedItems = sortRoadmapItems(items, sortKey);

  const visibleItems = hideCompleted
    ? sortedItems.filter((i) => i.completionPercent < 100)
    : sortedItems;

  const emptyMessage =
    hideCompleted && items.length > 0 && visibleItems.length === 0
      ? "Все навыки текущего грейда пройдены"
      : "Нет навыков для текущего грейда";

  const completedSkills = items.filter(
    (item) => item.completionPercent === 100,
  ).length;
  const averagePercent =
    items.length > 0
      ? Math.round(
          items.reduce((sum, item) => sum + item.completionPercent, 0) /
            items.length,
        )
      : 0;

  return (
    <div className="flex flex-col gap-6 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <PageHero
          title="Roadmap"
          description="Все навыки текущего грейда и прогресс по ним."
          meta={
            currentLevel ? (
              <p className="inline-flex items-center gap-1.5 rounded-md border border-blue-500/40 bg-blue-500/10 px-3 py-1 font-mono text-sm font-medium text-blue-600">
                focus: {currentLevel.name}
              </p>
            ) : undefined
          }
          aside={
            <PageSummaryCard
              title="Прогресс грейда"
              meta={currentLevel?.name}
              value={`${completedSkills}/${items.length}`}
              valueLabel="навыков"
              progress={{
                current: completedSkills,
                max: items.length || 1,
              }}
              stats={[
                { label: "Средний прогресс", value: `${averagePercent}%` },
              ]}
            />
          }
        />
      </motion.div>

      <div className="xl:hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-white/[0.06] pb-4">
          {SORT_OPTIONS.map((option) => {
            const active = sortKey === option.key;
            const Icon = option.icon;
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => setSortKey(option.key)}
                aria-pressed={active}
                className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-sm transition-colors ${
                  active
                    ? "border-blue-500/60 bg-blue-500/15 text-blue-600"
                    : "border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-blue-500/40 hover:text-blue-500"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {option.label}
              </button>
            );
          })}
          <button
            type="button"
            role="checkbox"
            aria-checked={hideCompleted}
            onClick={() => setHideCompleted((v) => !v)}
            className="group inline-flex items-center gap-2 rounded-md px-1 py-1.5 font-mono text-sm text-slate-400 transition-colors hover:text-blue-500"
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors duration-200 ${
                hideCompleted
                  ? "border-blue-600 bg-blue-600 text-[#faf9f5]"
                  : "border-slate-600 group-hover:border-slate-400"
              }`}
            >
              {hideCompleted && <Check className="h-3.5 w-3.5" strokeWidth={3.5} />}
            </span>
            Скрыть пройденные
          </button>
        </div>
      </div>

      <div ref={bleedRef} className="hidden xl:block">
        <RoadmapDiagram
          graph={graph}
          levelSlug={currentLevel.slug}
          scrollRef={scrollRef}
        />
      </div>

      <div className="xl:hidden">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        >
          <GapList gaps={visibleItems} emptyMessage={emptyMessage} levelSlug={currentLevel.slug} />
        </motion.div>
      </div>

      <RoadmapScrollbar scrollRef={scrollRef} />
    </div>
  );
}