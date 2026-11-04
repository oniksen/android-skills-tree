import { Skeleton } from "./Skeleton";

export default function StudySkeleton() {
  return (
    <div className="study-page" aria-busy>
      <div className="study-topbar">
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="study-article space-y-4">
        <Skeleton className="h-9 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
