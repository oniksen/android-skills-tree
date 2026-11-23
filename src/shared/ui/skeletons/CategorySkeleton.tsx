import { Skeleton } from "./Skeleton";
import SkillDetailSkeleton from "./SkillDetailSkeleton";

export default function CategorySkeleton() {
  return (
    <div className="w-full space-y-4" aria-busy>
      <div className="glass-panel relative overflow-hidden p-5">
        <div className="space-y-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-8 w-2/3" />
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-4 w-20" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="card-surface rounded-lg p-5">
            <SkillDetailSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}
