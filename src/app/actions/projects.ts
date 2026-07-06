"use server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleProjectCompletion(projectId: string, completed: boolean) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { error } = await supabase.from("project_progress").upsert(
    { user_id: user.id, project_id: projectId, completed, completed_at: completed ? new Date().toISOString() : null },
    { onConflict: "user_id,project_id" }
  );
  if (error) throw new Error(error.message);
  revalidatePath("/projects");
  revalidatePath("/dashboard");
  revalidatePath("/roadmap");
}
