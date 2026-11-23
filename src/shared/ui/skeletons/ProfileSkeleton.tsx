import { Skeleton } from "./Skeleton";

function HeroSkeleton() {
  return (
    <div className="card-surface rounded-2xl p-5 sm:p-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-20 w-20 rounded-2xl" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-3.5 w-56" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  );
}

function AchievementsSkeleton() {
  return (
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
}

function SettingsSkeleton() {
  return (
    <div className="card-surface rounded-lg p-5">
      <Skeleton className="h-5 w-28" />
      <Skeleton className="mt-4 h-9 w-full rounded-md" />
      <Skeleton className="mt-4 h-3 w-24" />
      <div className="mt-6 border-t border-white/[0.06] pt-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-3 h-10 w-full rounded-md" />
      </div>
      <Skeleton className="mt-5 h-10 w-full rounded-md" />
    </div>
  );
}

export default function ProfileSkeleton({
  variant = "page",
}: {
  variant?: "page" | "modal";
}) {
  if (variant === "modal") {
    return (
      <div className="space-y-6" aria-busy>
        <HeroSkeleton />
        <AchievementsSkeleton />
        <SettingsSkeleton />
      </div>
    );
  }

  return (
    <div
      className="grid gap-4 md:grid-cols-2 xl:grid-cols-12"
      aria-busy
    >
      <div className="md:col-span-2 xl:col-span-12">
        <HeroSkeleton />
      </div>
      <div className="md:col-span-2 xl:col-span-8">
        <AchievementsSkeleton />
      </div>
      <div className="md:col-span-2 xl:col-span-4">
        <SettingsSkeleton />
      </div>
    </div>
  );
}
