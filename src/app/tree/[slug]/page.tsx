import { createServerSupabaseClient } from "@/lib/supabase/server";
import LevelTabs from "@/components/tree/LevelTabs";
import CategoryCard from "@/components/tree/CategoryCard";
import CategoryCardReadonly from "@/components/tree/CategoryCardReadonly";
import LevelGate from "@/components/tree/LevelGate";
import LevelUpHandler from "./LevelUpHandler";
import { getAssessmentMap } from "@/lib/queries";
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
  if (!categories) return notFound();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <>
        <div><h1 className="text-3xl font-bold text-white mb-1">{currentLevel.name}</h1>
        <p className="text-slate-400">{currentLevel.description}</p></div>
        <LevelTabs levels={levels} />
        <div className="grid gap-4 md:grid-cols-2">
          {categories.map(cat => (
            <CategoryCardReadonly key={cat.id} name={cat.name} maxScore={cat.max_score} skills={cat.skills || []} />
          ))}
        </div>
      </>
    );
  }

  const { data: userProgress } = await supabase
    .from("user_progress").select("*").eq("user_id", user.id).single();
  const assessmentMap = await getAssessmentMap(user.id);

  const currentLevelId = userProgress?.current_level_id || levels[0].id;
  const currentLevelIndex = levels.findIndex(l => l.id === currentLevelId);
  const levelIndex = levels.findIndex(l => l.id === currentLevel.id);
  const isCurrentOrPast = levelIndex <= currentLevelIndex;
  const isCompleted = levelIndex < currentLevelIndex;
  const currentScore = userProgress?.total_score || 0;
  const nextLevel = levels[currentLevelIndex + 1] || null;

  return (
    <>
      <LevelUpHandler />
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">{currentLevel.name}</h1>
          <p className="text-slate-400">{currentLevel.description}</p>
        </div>
        <div className="text-right text-sm text-slate-500">
          <div>Всего XP: {currentScore}</div>
          {nextLevel && <div>До {nextLevel.name}: {Math.max(0, nextLevel.min_score - currentScore)} XP</div>}
        </div>
      </div>

      <LevelTabs levels={levels} />

      {!isCurrentOrPast && (
        <LevelGate isUnlocked={false} isCompleted={false}
          requiredScore={levels[levelIndex - 1]?.max_score || 9999}
          currentScore={currentScore} levelName={currentLevel.name} />
      )}
      {isCompleted && (
        <LevelGate isUnlocked={false} isCompleted={true}
          requiredScore={0} currentScore={currentScore} levelName={currentLevel.name} />
      )}
      {isCurrentOrPast && !isCompleted && (
        <div className="grid gap-4 md:grid-cols-2">
          {categories.map(cat => (
            <CategoryCard key={cat.id} name={cat.name} maxScore={cat.max_score}
              skills={cat.skills || []} assessments={assessmentMap} />
          ))}
        </div>
      )}
    </>
  );
}
