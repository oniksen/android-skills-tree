import { Skeleton } from "./Skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,380px)] xl:items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Дашборд
          </h1>
          <p className="mt-1 text-slate-400">Ваш прогресс на пути к senior.</p>
        </div>
        <div className="card-surface rounded-lg p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Skeleton className="h-3 w-28" />
              <Skeleton className="mt-3 h-8 w-40" />
            </div>
            <Skeleton className="h-24 w-24 shrink-0 rounded-full" />
          </div>
          <Skeleton className="mt-4 h-4 w-40" />
        </div>
      </div>

      <div className="grid items-start gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card-surface rounded-lg p-5">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="mt-4 h-8 w-40" />
            <Skeleton className="mt-4 h-2.5 w-full" />
            <div className="mt-5 flex items-center justify-between">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
