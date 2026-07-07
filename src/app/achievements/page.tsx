import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AchievementCard from "@/components/achievements/AchievementCard";

export default async function AchievementsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: achievements } = await supabase
    .from("achievements")
    .select("*")
    .eq("user_id", user.id)
    .order("achieved_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Достижения</h1>
      {!achievements || achievements.length === 0 ? (
        <p className="text-slate-400">Пока нет достижений</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {achievements.map((a) => (
            <AchievementCard
              key={a.id}
              type={a.type}
              metadata={a.metadata as Record<string, string> | null}
              achieved_at={a.achieved_at}
            />
          ))}
        </div>
      )}
    </div>
  );
}
