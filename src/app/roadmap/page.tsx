import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAssessmentMap } from "@/lib/queries";
import { redirect } from "next/navigation";
import GapList from "@/components/roadmap/GapList";

export default async function RoadmapPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: levels } = await supabase.from("levels").select("*").order("level_order");
  const { data: userProgress } = await supabase.from("user_progress").select("*").eq("user_id", user.id).single();
  const currentLevelId = userProgress?.current_level_id || levels?.[0]?.id || "";
  const currentIndex = levels?.findIndex(l => l.id === currentLevelId) ?? 0;
  const relevantIds = levels?.slice(currentIndex, Math.min(currentIndex + 2, levels.length)).map(l => l.id) || [];

  const { data: categories } = await supabase
    .from("categories").select("*, skills(*), level:levels(name)")
    .in("level_id", relevantIds).order("sort_order");

  const assessmentMap = await getAssessmentMap(user.id);

  const gaps: { skillName: string; categoryName: string; levelName: string; currentScore: number; maxScore: number; }[] = [];
  (categories || []).forEach(cat => {
    (cat.skills || []).forEach((skill: any) => {
      const score = assessmentMap[skill.id] || 0;
      if (score < 3) {
        gaps.push({ skillName: skill.name, categoryName: cat.name, levelName: (cat.level as any)?.name || "", currentScore: score, maxScore: 5 });
      }
    });
  });
  gaps.sort((a, b) => a.currentScore - b.currentScore);

  const currentLevel = levels?.find(l => l.id === currentLevelId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Roadmap</h1>
        <p className="text-slate-400">Навыки, требующие внимания. Сосредоточьтесь на навыках с низкой оценкой.</p>
        {currentLevel && <p className="text-sm text-blue-400 mt-1">Текущий фокус: {currentLevel.name}</p>}
      </div>
      <GapList gaps={gaps} />
    </div>
  );
}
