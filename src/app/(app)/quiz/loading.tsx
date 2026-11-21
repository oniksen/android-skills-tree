import { Skeleton } from "@/shared/ui/skeletons";

export default function Loading() {
  return (
    <div
      className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-4 pt-6"
      aria-busy
    >
      <Skeleton className="h-5 w-40" />
      <div className="mt-4 flex-1 space-y-3">
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-20 w-2/3 rounded-xl" />
        <Skeleton className="h-14 w-full rounded-xl" />
      </div>
    </div>
  );
}
