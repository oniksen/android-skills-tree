import type { HTMLAttributes } from "react";

export function Skeleton({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={`animate-pulse rounded-lg bg-white/[0.06] ${className}`}
      {...props}
    />
  );
}
