interface QuickStatsProps {
  totalSkills: number;
  assessedSkills: number;
  completedProjects: number;
  totalProjects: number;
}
export default function QuickStats({ totalSkills, assessedSkills, completedProjects, totalProjects }: QuickStatsProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Статистика</h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-slate-400">Оценено навыков</span>
          <span className="text-white font-medium">{assessedSkills}/{totalSkills}</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${totalSkills > 0 ? (assessedSkills/totalSkills)*100 : 0}%` }} />
        </div>
        <div className="flex justify-between mt-4">
          <span className="text-slate-400">Выполнено проектов</span>
          <span className="text-white font-medium">{completedProjects}/{totalProjects}</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${totalProjects > 0 ? (completedProjects/totalProjects)*100 : 0}%` }} />
        </div>
      </div>
    </div>
  );
}
