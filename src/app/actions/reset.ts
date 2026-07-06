"use server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function resetLevelProgress(levelId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: skills } = await supabase
    .from("skills")
    .select("id, categories!inner(level_id)")
    .eq("categories.level_id", levelId);

  if (skills && skills.length > 0) {
    await supabase.from("assessments").delete()
      .eq("user_id", user.id)
      .in("skill_id", skills.map(s => s.id));
  }

  const { data: projects } = await supabase
    .from("projects").select("id").eq("level_id", levelId);

  if (projects && projects.length > 0) {
    await supabase.from("project_progress").delete()
      .eq("user_id", user.id)
      .in("project_id", projects.map(p => p.id));
  }

  revalidatePath("/tree/[slug]", "page");
  revalidatePath("/dashboard");
  revalidatePath("/roadmap");
}
