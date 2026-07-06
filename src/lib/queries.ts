import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getAssessmentMap(userId: string): Promise<Record<string, number>> {
  const supabase = await createServerSupabaseClient();
  const { data: assessments } = await supabase
    .from("assessments")
    .select("skill_id, score")
    .eq("user_id", userId);

  const map: Record<string, number> = {};
  assessments?.forEach(a => { map[a.skill_id] = a.score; });
  return map;
}
