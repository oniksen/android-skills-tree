import { Skeleton } from "./Skeleton";

export default function TreeSkeleton() {
  return (
    <div className="space-y-6" aria-busy>
      <div className="flex flex-col gap-3 nav-lg:flex-row nav-lg:justify-between nav-lg:items-start nav-lg:gap-0">
        <div>
          <Skeleton className="h-9 w-40" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <div className="space-y-2 nav-lg:text-right">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-32" />
        </div>
      </div>

      <div className="flex gap-2 border-b border-white/[0.06] pb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-11 w-24 rounded-xl" />
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-24 rounded-full" />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card-surface rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-12" />
            </div>
            <Skeleton className="mt-4 h-2 w-full" />
            <div className="mt-4 space-y-2.5">
              {Array.from({ length: 3 }).map((_, j) => (
                <Skeleton key={j} className="h-9 w-full rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
