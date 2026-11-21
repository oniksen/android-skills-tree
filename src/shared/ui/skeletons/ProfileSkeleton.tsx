import { Skeleton } from "./Skeleton";

export default function ProfileSkeleton({
  variant = "page",
}: {
  variant?: "page" | "modal";
}) {
  const stats = (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="card-surface rounded-lg p-4">
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="mt-3 h-6 w-14" />
        </div>
      ))}
    </div>
  );

  const achievements = (
    <div className="card-surface rounded-lg p-5">
      <Skeleton className="h-5 w-40" />
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center gap-3 rounded-lg p-3">
            <Skeleton className="h-12 w-12 shrink-0 rounded-2xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const links = (
    <div className="card-surface rounded-lg p-5">
      <Skeleton className="h-5 w-24" />
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-full rounded-md" />
        ))}
      </div>
    </div>
  );

  const settings = (
    <>
      <div className="card-surface rounded-lg p-5">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="mt-4 h-9 w-full rounded-md" />
      </div>
      <div className="card-surface rounded-lg p-5">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="mt-4 h-10 w-full rounded-md" />
      </div>
    </>
  );

  if (variant === "modal") {
    return (
      <div className="space-y-6" aria-busy>
        <div className="flex items-center gap-4">
          <Skeleton className="h-14 w-14 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3.5 w-56" />
          </div>
        </div>
        {stats}
        {achievements}
        {links}
        {settings}
      </div>
    );
  }

  return (
    <div className="space-y-6" aria-busy>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,380px)] xl:items-start">
        <div className="flex items-center gap-4">
          <Skeleton className="h-14 w-14 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3.5 w-56" />
          </div>
        </div>
        <div className="card-surface rounded-lg p-5">
          <Skeleton className="h-3 w-24" />
          <div className="mt-3 flex items-baseline justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="mt-3 h-2 w-full" />
          <Skeleton className="mt-4 h-4 w-32" />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] xl:items-start">
        <div className="space-y-6">
          {stats}
          {achievements}
        </div>
        <div className="space-y-6">
          {links}
          {settings}
        </div>
      </div>
    </div>
  );
}
