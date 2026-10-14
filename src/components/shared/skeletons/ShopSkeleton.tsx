import { Skeleton } from "./Skeleton";

export default function ShopSkeleton() {
  return (
    <div className="space-y-8" aria-busy>
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Магазин</h1>
        <Skeleton className="mt-2 h-4 w-64" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="card-surface flex items-start gap-4 rounded-xl p-4">
            <Skeleton className="h-14 w-14 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-14" />
              </div>
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-2/3" />
              <div className="flex items-center justify-between gap-3 pt-1">
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="h-8 w-24 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="card-surface rounded-xl p-4">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="mt-2 h-3 w-full" />
        <Skeleton className="mt-1.5 h-3 w-3/4" />
        <div className="mt-4 grid grid-cols-5 gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-full" />
          ))}
        </div>
      </section>
    </div>
  );
}
