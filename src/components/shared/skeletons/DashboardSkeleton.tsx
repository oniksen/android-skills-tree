import { Skeleton } from "./Skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy>
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Дашборд</h1>
        <p className="mt-1 text-slate-400">Ваш прогресс на пути к senior.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="card-surface rounded-2xl p-5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-4 h-8 w-40" />
          <Skeleton className="mt-6 h-2.5 w-full" />
          <div className="mt-5 flex items-center justify-between">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
        <div className="card-surface grid grid-cols-2 gap-4 rounded-2xl p-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-7 w-16" />
              <Skeleton className="h-3.5 w-20" />
            </div>
          ))}
        </div>
      </div>
      <div className="card-surface flex items-center gap-4 rounded-2xl p-5">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3.5 w-48" />
        </div>
      </div>
      <div className="card-surface rounded-2xl p-5">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="mt-4 h-3.5 w-full" />
        <Skeleton className="mt-2 h-3.5 w-2/3" />
      </div>
    </div>
  );
}
