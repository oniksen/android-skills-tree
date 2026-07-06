export default function GapList({ gaps }: { gaps: { skillName: string; categoryName: string; levelName: string; currentScore: number; maxScore: number; }[] }) {
  if (gaps.length === 0) {
    return (
      <div className="bg-emerald-900/20 border border-emerald-800 rounded-xl p-6 text-center">
        <p className="text-emerald-400 font-medium">Все навыки оценены! Отличная работа!</p>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {gaps.map((gap, i) => (
        <div key={i} className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
          <div>
            <span className="text-white font-medium">{gap.skillName}</span>
            <span className="text-slate-500 text-sm ml-2">{gap.categoryName} · {gap.levelName}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">{gap.currentScore}/{gap.maxScore}</span>
            <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${(gap.currentScore / gap.maxScore) * 100}%` }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
