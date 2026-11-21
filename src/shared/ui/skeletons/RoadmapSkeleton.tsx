import { Skeleton } from "./Skeleton";

export default function RoadmapSkeleton() {
  return (
    <div className="space-y-6" aria-busy>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,380px)] xl:items-start">
        <div>
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-white">
            Roadmap
          </h1>
          <p className="text-sm text-slate-400">
            Все навыки текущего грейда и прогресс по ним. Выберите порядок
            сортировки.
          </p>
          <Skeleton className="mt-3 h-7 w-40 rounded-md" />
        </div>
        <div className="card-surface rounded-lg p-5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-14" />
          </div>
          <Skeleton className="mt-3 h-2 w-full" />
          <Skeleton className="mt-4 h-4 w-32" />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-b border-white/[0.06] pb-4">
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-7 w-40 rounded-md" />
      </div>

      <div className="content-grid-wide">
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
