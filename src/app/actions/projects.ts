"use server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleProjectCompletion(projectId: string, completed: boolean) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  await supabase.from("project_progress").upsert(
    { user_id: user.id, project_id: projectId, completed, completed_at: completed ? new Date().toISOString() : null },
    { onConflict: "user_id,project_id" }
  );
  revalidatePath("/projects");
  revalidatePath("/dashboard");
}
