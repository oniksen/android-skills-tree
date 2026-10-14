import { Skeleton } from "./Skeleton";

export default function AchievementsSkeleton() {
  return (
    <div className="space-y-8" aria-busy>
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Достижения</h1>
        <Skeleton className="mt-2 h-4 w-36" />
      </div>
      {Array.from({ length: 3 }).map((_, group) => (
        <div key={group}>
          <Skeleton className="mb-4 h-6 w-40" />
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
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
