export default function SkillRowReadonly({ name, maxWeight }: { name: string; maxWeight: number }) {
  return (
    <div className="flex items-center justify-between py-1.5 px-3 rounded-lg hover:bg-slate-800/50 transition-colors">
      <span className="text-sm text-slate-300">{name}</span>
      <span className="text-xs text-slate-600">вес: {maxWeight}</span>
    </div>
  );
}
