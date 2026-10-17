"use client";

import { motion } from "motion/react";
import { useProjectProgress } from "@/hooks";
import { levels } from "@/data/levels";
import { projects } from "@/data/projects";
import ProjectCard from "@/features/projects/components/ProjectCard";
import { ProjectsSkeleton } from "@/shared/ui/skeletons";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ProjectsClient() {
  const { projectMap, loading } = useProjectProgress();

  if (loading) {
    return <ProjectsSkeleton />;
  }

  const grouped = new Map<string, typeof projects>();
  projects.forEach((p) => {
    const level = levels.find((l) => l.id === p.levelId);
    const levelName = level?.name || "Unknown";
    if (!grouped.has(levelName)) grouped.set(levelName, []);
    grouped.get(levelName)!.push(p);
  });

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <h1 className="text-2xl font-bold tracking-tight text-white">
          <span className="text-blue-600">#</span> Проекты
        </h1>
        <p className="mt-1 text-sm text-slate-400">Практические проекты по уровням — отмечайте выполненные.</p>
      </motion.div>
      {Array.from(grouped.entries()).map(([levelName, levelProjects]) => (
        <div key={levelName}>
          <h2 className="mb-4 font-mono text-lg font-semibold text-slate-300">
            <span className="text-slate-600">##</span> {levelName}
          </h2>
          <div className="space-y-3">
            {levelProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -40px 0px" }}
                transition={{ duration: 0.4, delay: index % 5 * 0.06, ease: EASE }}
              >
                <ProjectCard
                  projectId={project.id}
                  name={project.name}
                  description={project.description}
                  requiredTechnologies={project.requiredTechnologies}
                  levelName={levelName}
                  completed={projectMap[project.id] || false}
                />
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}