import type { ReactNode } from "react";

interface PageHeroProps {
  title: string;
  prefix?: string;
  description?: string;
  /** Extra line under the description, e.g. a focus chip or a counter. */
  meta?: ReactNode;
  /** Rendered before the title, e.g. an avatar on the profile page. */
  leading?: ReactNode;
  /** Summary card shown on the right on wide screens. */
  aside?: ReactNode;
}

/**
 * Page heading shared by the collection pages. On wide screens it follows the
 * skills tree: title on the left, compact summary card on the right.
 */
export default function PageHero({
  title,
  prefix = "#",
  description,
  meta,
  leading,
  aside,
}: PageHeroProps) {
  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,380px)] xl:items-start">
      <div className="flex min-w-0 items-center gap-4">
        {leading}
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            <span className="text-blue-600">{prefix}</span> {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-slate-400">{description}</p>
          )}
          {meta && <div className="mt-3">{meta}</div>}
        </div>
      </div>
      {aside ? <div className="min-w-0">{aside}</div> : null}
    </section>
  );
}
