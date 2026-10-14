import { Skeleton } from "./Skeleton";

export default function RoadmapSkeleton() {
  return (
    <div className="space-y-6" aria-busy>
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Roadmap</h1>
        <p className="text-slate-400">
          Навыки, требующие внимания. Сосредоточьтесь на навыках с низкой оценкой.
        </p>
        <Skeleton className="mt-2 h-7 w-40 rounded-full" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-4"
          >
            <div className="flex min-w-0 items-start gap-3">
              <Skeleton className="h-6 w-6 shrink-0 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3.5 w-28" />
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-1.5 w-24 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
