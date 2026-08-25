"use client";

import { useProjectProgress } from "@/hooks";
import { levels } from "@/data/levels";
import { projects } from "@/data/projects";
import ProjectCard from "@/components/projects/ProjectCard";

export default function ProjectsClient() {
  const { projectMap, loading } = useProjectProgress();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400">Загрузка...</div>
      </div>
    );
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
      <h1 className="text-3xl font-bold text-white">Проекты</h1>
      {Array.from(grouped.entries()).map(([levelName, levelProjects]) => (
        <div key={levelName}>
          <h2 className="text-xl font-semibold text-slate-200 mb-4">
            {levelName}
          </h2>
          <div className="space-y-3">
            {levelProjects.map((project) => (
              <ProjectCard
                key={project.id}
                projectId={project.id}
                name={project.name}
                description={project.description}
                requiredTechnologies={project.requiredTechnologies}
                levelName={levelName}
                completed={projectMap[project.id] || false}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
