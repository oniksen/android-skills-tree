import { Skeleton } from "@/shared/ui/skeletons";
import SkillDetailSkeleton from "@/shared/ui/skeletons/SkillDetailSkeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <Skeleton className="h-4 w-36" />
      <div className="card-surface relative overflow-hidden rounded-lg p-5">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
        <SkillDetailSkeleton />
      </div>
    </div>
  );
}
