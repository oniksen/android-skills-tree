import { STUDY_BLOCK } from "@/features/study/model/study-blocks";
import { Skeleton } from "./Skeleton";

export default function StudySkeleton() {
  return (
    <div className={STUDY_BLOCK.page} aria-busy>
      <div className={STUDY_BLOCK.topbar}>
        <Skeleton className="h-4 w-32" />
      </div>
      <div className={STUDY_BLOCK.article}>
        <div className={STUDY_BLOCK.hero}>
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-3 h-8 w-2/3" />
          <Skeleton className="mt-4 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-4/5" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-7 w-28 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-32 rounded-full" />
        </div>
        <div className={STUDY_BLOCK.section}>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="mt-4 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-5/6" />
          <Skeleton className="mt-4 h-32 w-full" />
        </div>
      </div>
    </div>
  );
}
