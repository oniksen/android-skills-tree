import { Skeleton } from "./Skeleton";

export default function AchievementsSkeleton() {
  return (
    <div className="space-y-8" aria-busy>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,380px)] xl:items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Достижения
          </h1>
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <div className="card-surface rounded-lg p-5">
          <Skeleton className="h-3 w-20" />
          <div className="mt-3 flex items-baseline justify-between">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-5 w-14" />
          </div>
          <Skeleton className="mt-3 h-2 w-full" />
          <Skeleton className="mt-4 h-4 w-24" />
        </div>
      </div>

      {Array.from({ length: 3 }).map((_, group) => (
        <div key={group}>
          <Skeleton className="mb-4 h-6 w-40" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-[repeat(auto-fill,minmax(min(24rem,100%),1fr))]">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="card-surface flex items-center gap-4 rounded-xl p-5"
              >
                <Skeleton className="h-14 w-14 shrink-0 rounded-2xl" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3.5 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
