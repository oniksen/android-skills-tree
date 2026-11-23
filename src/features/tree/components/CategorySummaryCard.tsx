import Link from "next/link";
import { BookOpen } from "lucide-react";
import ProgressBar from "@/shared/ui/ProgressBar";

interface CategorySummaryCardProps {
  href: string;
  name: string;
  score: number;
  maxScore: number;
  skillsDone: number;
  skillsTotal: number;
  studyHref?: string;
  isComplete?: boolean;
  /** Dims the card for a grade the user has not reached yet. */
  muted?: boolean;
}

/**
 * Compact block card for the tree page: the category name, its XP and a
 * progress bar. The whole card leads to the category page with its topics.
 */
export default function CategorySummaryCard({
  href,
  name,
  score,
  maxScore,
  skillsDone,
  skillsTotal,
  studyHref,
  isComplete = false,
  muted = false,
}: CategorySummaryCardProps) {
  return (
    <div
      className={`group card-surface relative flex h-full flex-col overflow-hidden rounded-lg p-5 transition-colors duration-200 ${
        muted ? "opacity-60" : ""
      } ${isComplete ? "border-amber-500/40" : "hover:border-blue-500/40"}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
      <Link
        href={href}
        aria-label={`Открыть блок «${name}»`}
        className="absolute inset-0 z-0 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
      />

      <div className="pointer-events-none relative z-10 flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold leading-snug text-white">{name}</h3>
          <div className="flex shrink-0 items-center gap-1.5">
            {isComplete && (
              <span className="rounded-full bg-yellow-600/20 px-2 py-0.5 text-xs font-medium text-yellow-500">
                макс
              </span>
            )}
            {studyHref && (
              <Link
                href={studyHref}
                aria-label="Учебный материал"
                className="pointer-events-auto inline-flex items-center justify-center rounded-md p-1 text-blue-600 transition-colors hover:text-blue-500"
              >
                <BookOpen className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>

        <div className="mt-auto pt-5">
          <div className="flex items-baseline justify-between gap-3 font-mono text-sm">
            <span className="text-slate-500">
              {skillsDone}/{skillsTotal} тем
            </span>
            <span className="whitespace-nowrap text-slate-500">
              {score}/{maxScore} XP
            </span>
          </div>
          <div className="mt-1.5">
            <ProgressBar
              current={score}
              max={maxScore}
              tone={isComplete ? "amber" : "coral"}
              showLabel={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
