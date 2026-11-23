"use client";

import { useEffect, useState, type RefObject } from "react";

export interface RoadmapScrollMetrics {
  left: number;
  client: number;
  width: number;
}

export function RoadmapScrollbarView({
  metrics,
  onScrollTo,
}: {
  metrics: RoadmapScrollMetrics;
  onScrollTo: (left: number) => void;
}) {
  const maxLeft = Math.max(0, metrics.width - metrics.client);
  if (maxLeft <= 0) return null;

  const thumbWidthPct = Math.max(8, (metrics.client / metrics.width) * 100);
  const thumbLeftPct = (metrics.left / maxLeft) * (100 - thumbWidthPct);

  const scrollFromClientX = (clientX: number, rect: DOMRect) => {
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    onScrollTo(ratio * maxLeft);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 hidden px-3 pb-[max(env(safe-area-inset-bottom),0.5rem)] xl:block">
      <div className="glass-panel mx-auto flex max-w-[2000px] items-center gap-3 px-3 py-2">
        <div
          role="scrollbar"
          aria-controls="roadmap-diagram-scroll"
          aria-orientation="horizontal"
          aria-valuemin={0}
          aria-valuemax={Math.round(maxLeft)}
          aria-valuenow={Math.round(metrics.left)}
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              onScrollTo(metrics.left - metrics.client / 2);
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              onScrollTo(metrics.left + metrics.client / 2);
            } else if (event.key === "Home") {
              event.preventDefault();
              onScrollTo(0);
            } else if (event.key === "End") {
              event.preventDefault();
              onScrollTo(maxLeft);
            }
          }}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            scrollFromClientX(
              event.clientX,
              event.currentTarget.getBoundingClientRect(),
            );
          }}
          onPointerMove={(event) => {
            if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
            scrollFromClientX(
              event.clientX,
              event.currentTarget.getBoundingClientRect(),
            );
          }}
          onPointerUp={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.releasePointerCapture(event.pointerId);
            }
          }}
          className="relative h-2 flex-1 cursor-pointer rounded-full bg-slate-800/80 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60"
        >
          <span
            aria-hidden
            className="absolute inset-y-0 rounded-full bg-blue-500/70"
            style={{ left: `${thumbLeftPct}%`, width: `${thumbWidthPct}%` }}
          />
        </div>
        <span className="shrink-0 font-mono text-[10px] text-slate-500">
          {Math.round((metrics.left / Math.max(1, maxLeft)) * 100)}%
        </span>
      </div>
    </div>
  );
}

export default function RoadmapScrollbar({
  scrollRef,
}: {
  scrollRef: RefObject<HTMLDivElement | null>;
}) {
  const [metrics, setMetrics] = useState<RoadmapScrollMetrics>({
    left: 0,
    client: 0,
    width: 0,
  });

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const sync = () => {
      setMetrics({
        left: element.scrollLeft,
        client: element.clientWidth,
        width: element.scrollWidth,
      });
    };

    sync();
    element.addEventListener("scroll", sync, { passive: true });
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(sync);
    observer?.observe(element);

    return () => {
      element.removeEventListener("scroll", sync);
      observer?.disconnect();
    };
  }, [scrollRef]);

  const scrollTo = (left: number) => {
    const element = scrollRef.current;
    if (!element) return;
    const maxLeft = Math.max(0, element.scrollWidth - element.clientWidth);
    element.scrollLeft = Math.min(maxLeft, Math.max(0, left));
  };

  return <RoadmapScrollbarView metrics={metrics} onScrollTo={scrollTo} />;
}
