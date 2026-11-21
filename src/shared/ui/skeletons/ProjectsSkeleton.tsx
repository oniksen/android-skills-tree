import { Skeleton } from "./Skeleton";

export default function ProjectsSkeleton() {
  return (
    <div className="space-y-8" aria-busy>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,380px)] xl:items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Проекты
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Практические проекты по уровням — отмечайте выполненные.
          </p>
        </div>
        <div className="card-surface rounded-lg p-5">
          <Skeleton className="h-3 w-24" />
          <div className="mt-3 flex items-baseline justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-14" />
          </div>
          <Skeleton className="mt-3 h-2 w-full" />
          <Skeleton className="mt-4 h-4 w-24" />
        </div>
      </div>

      {Array.from({ length: 2 }).map((_, group) => (
        <div key={group}>
          <Skeleton className="mb-4 h-6 w-28" />
          <div className="content-grid">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="card-surface flex items-start gap-4 rounded-lg p-5"
              >
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-3.5 w-full" />
                  <div className="flex flex-wrap gap-2 pt-1">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <Skeleton key={j} className="h-5 w-16 rounded-full" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
