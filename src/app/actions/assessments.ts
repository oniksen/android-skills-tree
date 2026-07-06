"use server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveAssessment(skillId: string, score: number) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { error } = await supabase.from("assessments").upsert(
    { user_id: user.id, skill_id: skillId, score, updated_at: new Date().toISOString() },
    { onConflict: "user_id,skill_id" }
  );
  if (error) throw new Error(error.message);
  await recalculateScore(supabase, user.id);
  revalidatePath("/tree/[slug]", "page");
  revalidatePath("/dashboard");
  revalidatePath("/roadmap");
}

async function recalculateScore(supabase: any, userId: string) {
  const { data: assessments } = await supabase
    .from("assessments")
    .select("score, skills!inner(max_weight)")
    .eq("user_id", userId);
  const totalScore = assessments?.reduce((sum: number, a: any) => sum + a.score * a.skills.max_weight, 0) || 0;
  await supabase.from("user_progress").upsert(
    { user_id: userId, total_score: totalScore, updated_at: new Date().toISOString() },
    { onConflict: "user_id" }
  );
  return totalScore;
}

export async function checkLevelUp() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: levels } = await supabase.from("levels").select("*").order("level_order");
  const { data: userProgress } = await supabase.from("user_progress").select("*").eq("user_id", user.id).single();
  if (!levels || !userProgress) return null;
  const currentLevelId = userProgress.current_level_id || levels[0].id;
  const currentIndex = levels.findIndex(l => l.id === currentLevelId);
  if (currentIndex >= levels.length - 1) return null;
  const nextLevel = levels[currentIndex + 1];

  if (userProgress.total_score < nextLevel.min_score) return null;

  const { data: requiredSkills } = await supabase
    .from("skills")
    .select("id, categories!inner(level_id)")
    .eq("categories.level_id", nextLevel.id)
    .eq("required_for_level_up", true);

  if (requiredSkills && requiredSkills.length > 0) {
    const { data: skillAssessments } = await supabase
      .from("assessments")
      .select("skill_id, score")
      .eq("user_id", user.id)
      .in("skill_id", requiredSkills.map(s => s.id));

    const scoredMap: Record<string, number> = {};
    skillAssessments?.forEach(a => { scoredMap[a.skill_id] = a.score; });

    const allRequiredScored = requiredSkills.every(s => (scoredMap[s.id] || 0) >= 1);
    if (!allRequiredScored) return null;
  }

  if (nextLevel.required_project_count > 0) {
    const { data: projectProgress, count: projectCount } = await supabase
      .from("project_progress")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("completed", true);

    const completedCount = projectCount ?? 0;
    if (completedCount < nextLevel.required_project_count) return null;
  }

  const unlockedIds = [...(userProgress.unlocked_level_ids || []), nextLevel.id, currentLevelId];
  await supabase.from("user_progress").update({
    current_level_id: nextLevel.id,
    unlocked_level_ids: unlockedIds,
    updated_at: new Date().toISOString()
  }).eq("user_id", user.id);
  await supabase.from("achievements").insert({
    user_id: user.id, type: "level_up",
    metadata: { from_level: levels[currentIndex].name, to_level: nextLevel.name, score: userProgress.total_score }
  });
  revalidatePath("/tree/[slug]", "page");
  revalidatePath("/dashboard");
  revalidatePath("/roadmap");
  return { fromLevel: levels[currentIndex].name, toLevel: nextLevel.name, score: userProgress.total_score };
}
