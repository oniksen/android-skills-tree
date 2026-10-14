import { Skeleton } from "./Skeleton";

export default function SkillDetailSkeleton() {
  return (
    <div className="space-y-4" aria-busy>
      <div className="space-y-2">
        <Skeleton className="h-3 w-24" />
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-4 w-12" />
      </div>

      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-10" />
        </div>
        <div className="space-y-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-2 py-2.5">
              <Skeleton className="h-6 w-6 shrink-0 rounded-md" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
        <Skeleton className="h-1.5 w-full rounded-full" />
      </div>
    </div>
  );
}
