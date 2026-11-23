import type { ReactNode } from "react";

/**
 * Keeps the quiz workspace identical in every state: a scrollable terminal on
 * the left and the session panel on the right from `xl` up. Height comes from
 * the route `main` (a stretched flex child), so the root relies on `h-full`.
 */
export default function QuizShell({
  children,
  panel,
}: {
  children: ReactNode;
  panel: ReactNode;
}) {
  return (
    <div className="mx-auto flex h-full w-full max-w-[2000px] flex-1 flex-col font-mono text-sm xl:flex-row xl:gap-4">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
      <div className="hidden xl:flex xl:w-[320px] xl:shrink-0 xl:flex-col">
        {panel}
      </div>
    </div>
  );
}
