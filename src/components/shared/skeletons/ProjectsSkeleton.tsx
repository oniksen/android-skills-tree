import { Skeleton } from "./Skeleton";

export default function ProjectsSkeleton() {
  return (
    <div className="space-y-8" aria-busy>
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Проекты</h1>
        <p className="mt-1 text-slate-400">
          Практические проекты по уровням — отмечайте выполненные.
        </p>
      </div>
      {Array.from({ length: 2 }).map((_, group) => (
        <div key={group}>
          <Skeleton className="mb-4 h-6 w-28" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="card-surface flex items-start gap-4 rounded-2xl p-4"
              >
                <Skeleton className="h-5 w-5 shrink-0 rounded-md" />
                <div className="flex-1 space-y-2">
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
