import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProjectCard from "@/components/projects/ProjectCard";

export default async function ProjectsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: projects } = await supabase
    .from("projects").select("*, level:levels(name)").order("sort_order");
  const { data: progress } = await supabase
    .from("project_progress").select("project_id, completed").eq("user_id", user.id);

  const progressMap: Record<string, boolean> = {};
  progress?.forEach(p => { progressMap[p.project_id] = p.completed; });

  const grouped = new Map<string, typeof projects>();
  (projects || []).forEach(p => {
    const ln = (p.level as any)?.name || "Unknown";
    if (!grouped.has(ln)) grouped.set(ln, []);
    grouped.get(ln)!.push(p);
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Проекты</h1>
      {Array.from(grouped.entries()).map(([levelName, levelProjects]) => (
        <div key={levelName}>
          <h2 className="text-xl font-semibold text-slate-200 mb-4">{levelName}</h2>
          <div className="space-y-3">
            {(levelProjects || []).map(project => (
              <ProjectCard key={project.id} projectId={project.id} name={project.name}
                description={project.description}
                requiredTechnologies={(project.required_technologies as string[]) || []}
                levelName={levelName} completed={progressMap[project.id] || false} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
