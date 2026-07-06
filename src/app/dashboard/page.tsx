import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import LevelProgressCard from "@/components/dashboard/LevelProgressCard";
import QuickStats from "@/components/dashboard/QuickStats";
import NextMilestone from "@/components/dashboard/NextMilestone";

const levelColors: Record<string, string> = {
  junior: "text-green-400", middle: "text-blue-400",
  "strong-middle": "text-purple-400", senior: "text-amber-400",
};

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: levels } = await supabase.from("levels").select("*").order("level_order");
  const { data: userProgress } = await supabase.from("user_progress").select("*").eq("user_id", user.id).single();
  const { data: assessments } = await supabase.from("assessments").select("id").eq("user_id", user.id);
  const { data: allSkills } = await supabase.from("skills").select("id");
  const { data: projectProgress } = await supabase.from("project_progress").select("project_id, completed").eq("user_id", user.id);
  const { data: allProjects } = await supabase.from("projects").select("id");

  if (!levels) notFound();

  const currentLevelId = userProgress?.current_level_id || levels[0].id;
  const currentLevel = levels.find(l => l.id === currentLevelId) || levels[0];
  const currentIndex = levels.findIndex(l => l.id === currentLevelId);
  const nextLevel = currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;
  const currentScore = userProgress?.total_score || 0;
  const totalSkills = allSkills?.length || 0;
  const assessedSkills = assessments?.length || 0;
  const completedProjects = projectProgress?.filter(p => p.completed).length || 0;
  const totalProjects = allProjects?.length || 0;
  const canLevelUp = nextLevel ? currentScore >= nextLevel.min_score : false;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Дашборд</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <LevelProgressCard currentLevel={currentLevel.name} currentScore={currentScore}
          nextLevel={nextLevel?.name || null} nextThreshold={nextLevel?.min_score || null}
          levelColor={levelColors[currentLevel.slug] || "text-blue-400"} />
        <QuickStats totalSkills={totalSkills} assessedSkills={assessedSkills}
          completedProjects={completedProjects} totalProjects={totalProjects} />
      </div>
      {nextLevel && (
        <NextMilestone items={[
          { label: `Набрать ${nextLevel.min_score} XP`, done: currentScore >= nextLevel.min_score },
        ]} canLevelUp={canLevelUp} nextLevelName={nextLevel.name} />
      )}
    </div>
  );
}
