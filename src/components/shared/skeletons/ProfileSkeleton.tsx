import { Skeleton } from "./Skeleton";

export default function ProfileSkeleton() {
  return (
    <div className="space-y-6" aria-busy>
      <div className="flex items-center gap-4">
        <Skeleton className="h-14 w-14 rounded-2xl" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3.5 w-56" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="card-surface rounded-lg p-4">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="mt-3 h-6 w-14" />
          </div>
        ))}
      </div>
      <div className="card-surface rounded-lg p-5">
        <Skeleton className="h-5 w-40" />
        <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="aspect-square w-full rounded-lg" />
          ))}
        </div>
      </div>
      <div className="card-surface rounded-lg p-5">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="mt-4 h-3.5 w-40" />
      </div>
    </div>
  );
}
