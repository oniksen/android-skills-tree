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
  await checkAchievements(supabase, user.id);
  revalidatePath("/tree/[slug]", "page");
  revalidatePath("/dashboard");
  revalidatePath("/roadmap");
}

const SCORE_MULTIPLIER: Record<number, number> = { 1: 0.1, 2: 0.25, 3: 0.5, 4: 0.8, 5: 1.0 };

async function recalculateScore(supabase: any, userId: string) {
  const { data: assessments } = await supabase
    .from("assessments")
    .select("score, skills!inner(max_weight)")
    .eq("user_id", userId);
  const totalScore = assessments?.reduce((sum: number, a: any) => {
    const multiplier = SCORE_MULTIPLIER[a.score] ?? 0;
    return sum + Math.floor(a.score * a.skills.max_weight * multiplier);
  }, 0) || 0;
  await supabase.from("user_progress").upsert(
    { user_id: userId, total_score: totalScore, updated_at: new Date().toISOString() },
    { onConflict: "user_id" }
  );
  return totalScore;
}

async function checkAchievements(supabase: any, userId: string) {
  const { data: levels } = await supabase
    .from("levels")
    .select("id, name, slug, level_order")
    .order("level_order");

  const { data: categories } = await supabase.from("categories").select("id, name, level_id, max_score");
  const { data: skills } = await supabase.from("skills").select("id, category_id, max_weight");
  const { data: assessments } = await supabase.from("assessments").select("skill_id, score").eq("user_id", userId);

  if (!levels || !categories || !skills) return;

  const assessmentMap: Record<string, number> = {};
  assessments?.forEach((a: any) => { assessmentMap[a.skill_id] = a.score; });

  for (const cat of categories) {
    const catSkills = skills.filter((s: any) => s.category_id === cat.id);
    if (catSkills.length === 0) continue;
    if (!catSkills.every((s: any) => assessmentMap[s.id] === 5)) continue;

    const { data: existing } = await supabase
      .from("achievements")
      .select("id")
      .eq("user_id", userId)
      .eq("type", "category_perfect")
      .eq("metadata->>category_id", cat.id)
      .maybeSingle();

    if (!existing) {
      await supabase.from("achievements").insert({
        user_id: userId,
        type: "category_perfect",
        metadata: { category_id: cat.id, category_name: cat.name, level_id: cat.level_id }
      });
    }
  }

  for (const level of levels) {
    const levelCategories = categories.filter((c: any) => c.level_id === level.id);
    if (levelCategories.length === 0) continue;

    const allMaxed = levelCategories.every((cat: any) => {
      const catSkills = skills.filter((s: any) => s.category_id === cat.id);
      const catScore = catSkills.reduce((sum: number, s: any) => {
        const score = assessmentMap[s.id] || 0;
        const multiplier = SCORE_MULTIPLIER[score] ?? 0;
        return sum + Math.floor(score * s.max_weight * multiplier);
      }, 0);
      return catScore >= cat.max_score;
    });

    if (!allMaxed) continue;

    const { data: existing } = await supabase
      .from("achievements")
      .select("id")
      .eq("user_id", userId)
      .eq("type", "level_master")
      .eq("metadata->>level_id", level.id)
      .maybeSingle();

    if (!existing) {
      await supabase.from("achievements").insert({
        user_id: userId,
        type: "level_master",
        metadata: { level_id: level.id, level_name: level.name, level_slug: level.slug }
      });
    }
  }

  const { data: levelMasterAchievements } = await supabase
    .from("achievements")
    .select("metadata")
    .eq("user_id", userId)
    .eq("type", "level_master");

  const masteredLevelIds = new Set<string>();
  levelMasterAchievements?.forEach((a: any) => {
    const meta = a.metadata as { level_id?: string } | null;
    if (meta?.level_id) masteredLevelIds.add(meta.level_id);
  });

  const allLevelsMastered = levels.every((l: any) => masteredLevelIds.has(l.id));
  if (allLevelsMastered && levels.length > 0) {
    const { data: userProgress } = await supabase
      .from("user_progress")
      .select("total_score")
      .eq("user_id", userId)
      .maybeSingle();

    const { data: existing } = await supabase
      .from("achievements")
      .select("id")
      .eq("user_id", userId)
      .eq("type", "path_complete")
      .maybeSingle();

    if (!existing) {
      await supabase.from("achievements").insert({
        user_id: userId,
        type: "path_complete",
        metadata: { total_score: userProgress?.total_score ?? 0 }
      });
    }
  }
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

  const { data: currentCategories } = await supabase
    .from("categories")
    .select("id, max_score")
    .eq("level_id", currentLevelId);

  if (currentCategories && currentCategories.length > 0) {
    const { data: currentSkills } = await supabase
      .from("skills")
      .select("id, category_id, max_weight")
      .in("category_id", currentCategories.map(c => c.id));

    if (currentSkills && currentSkills.length > 0) {
      const { data: categoryAssessments } = await supabase
        .from("assessments")
        .select("skill_id, score")
        .eq("user_id", user.id)
        .in("skill_id", currentSkills.map(s => s.id));

      const assessmentMap: Record<string, number> = {};
      categoryAssessments?.forEach(a => { assessmentMap[a.skill_id] = a.score; });

      for (const cat of currentCategories) {
        const catSkills = currentSkills.filter(s => s.category_id === cat.id);
        const catXp = catSkills.reduce((sum, s) => {
          const score = assessmentMap[s.id] || 0;
          return sum + Math.floor(score * s.max_weight * (SCORE_MULTIPLIER[score] ?? 0));
        }, 0);
        if (catXp < cat.max_score * 0.8) return null;
      }
    }
  }

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
