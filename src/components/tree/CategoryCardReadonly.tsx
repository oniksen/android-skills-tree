import SkillRowReadonly from "./SkillRowReadonly";
export default function CategoryCardReadonly({ name, maxScore, skills }: {
  name: string; maxScore: number; skills: { id: string; name: string; max_weight: number; sort_order: number }[]
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-white">{name}</h3>
        <span className="text-xs text-slate-500">макс: {maxScore}</span>
      </div>
      <div className="space-y-0.5">
        {skills.sort((a,b) => a.sort_order - b.sort_order).map((skill) => (
          <SkillRowReadonly key={skill.id} name={skill.name} maxWeight={skill.max_weight} />
        ))}
      </div>
    </div>
  );
}
