import { Skeleton } from "./Skeleton";

export default function TreeSkeleton() {
  return (
    <div className="space-y-6" aria-busy>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,380px)] xl:items-start">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-full max-w-[85ch]" />
          <Skeleton className="h-4 w-3/4 max-w-[85ch]" />
        </div>

        <div className="card-surface rounded-lg p-5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-10" />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="mt-2 h-2 w-full" />
          <div className="mt-4 flex gap-6 border-t border-white/[0.06] pt-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-b border-white/[0.06] pb-4 nav-md:flex-row nav-md:items-center nav-md:justify-between">
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-11 w-24 rounded-md" />
          ))}
        </div>
        <Skeleton className="h-8 w-40 rounded-md" />
      </div>

      <div className="tree-grid auto-rows-fr">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="card-surface flex min-h-[9.5rem] flex-col rounded-lg p-5"
          >
            <div className="flex items-start justify-between gap-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-10" />
            </div>
            <div className="mt-auto pt-5">
              <div className="flex items-center justify-between gap-3">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="mt-2 h-2 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
