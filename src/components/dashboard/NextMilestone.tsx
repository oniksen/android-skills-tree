interface MilestoneItem { label: string; done: boolean; }
interface NextMilestoneProps { items: MilestoneItem[]; canLevelUp: boolean; nextLevelName: string; }
export default function NextMilestone({ items, canLevelUp, nextLevelName }: NextMilestoneProps) {
  if (canLevelUp) {
    return (
      <div className="bg-emerald-900/30 border border-emerald-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-emerald-400 mb-2">🎉 Условия выполнены!</h2>
        <p className="text-slate-300">Вы готовы перейти на уровень <strong>{nextLevelName}</strong>.</p>
      </div>
    );
  }
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-3">Что нужно для {nextLevelName}</h2>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${item.done ? "bg-emerald-900/50 text-emerald-400" : "bg-slate-800 text-slate-600"}`}>
              {item.done ? "✓" : "○"}
            </span>
            <span className={item.done ? "text-slate-400" : "text-slate-300"}>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
