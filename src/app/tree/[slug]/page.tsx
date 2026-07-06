import { createServerSupabaseClient } from "@/lib/supabase/server";
import LevelTabs from "@/components/tree/LevelTabs";
import CategoryCardReadonly from "@/components/tree/CategoryCardReadonly";
import { notFound } from "next/navigation";

export default async function LevelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: levels } = await supabase.from("levels").select("*").order("level_order");
  if (!levels || levels.length === 0) return notFound();
  const currentLevel = levels.find(l => l.slug === slug);
  if (!currentLevel) return notFound();
  const { data: categories } = await supabase
    .from("categories").select("*, skills(*)").eq("level_id", currentLevel.id).order("sort_order");
  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div><h1 className="text-3xl font-bold text-white mb-1">{currentLevel.name}</h1>
      <p className="text-slate-400">{currentLevel.description}</p></div>
      <LevelTabs levels={levels} />
      <div className="grid gap-4 md:grid-cols-2">
        {(categories || []).map(cat => (
          <CategoryCardReadonly key={cat.id} name={cat.name} maxScore={cat.max_score} skills={cat.skills || []} />
        ))}
      </div>
    </main>
  );
}
