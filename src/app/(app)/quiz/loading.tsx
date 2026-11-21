import { Skeleton } from "@/shared/ui/skeletons";

export default function Loading() {
  return (
    <div
      className="mx-auto flex w-full max-w-[1400px] flex-1 gap-4 px-4 pt-6"
      aria-busy
    >
      <div className="flex min-w-0 flex-1 flex-col space-y-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="mt-2 h-20 w-full rounded-xl" />
        <Skeleton className="h-20 w-2/3 rounded-xl" />
        <Skeleton className="mt-auto h-14 w-full rounded-xl" />
      </div>
      <div className="card-surface hidden w-[320px] shrink-0 space-y-4 rounded-lg p-4 xl:block">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-12 w-full rounded-md" />
      </div>
    </div>
  );
}
