"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { blockClass } from "../model/study-blocks";
import type { StudySection } from "../model/parse-study-document";
import {
  buildStudyToc,
  selectActiveId,
  type StudyTocGroup,
  type StudyTocPosition,
  type StudyTocTarget,
} from "./study-toc-model";
import {
  easeOutCubic,
  scrollTargetTop,
  TOC_SCROLL_DURATION,
} from "./study-toc-scroll";

const TOC = blockClass("toc");
const TOC_RAIL = blockClass("tocRail");
const TOC_COMPACT = blockClass("tocCompact");
const TOC_SUMMARY = blockClass("tocSummary");
const TOC_LIST = blockClass("tocList");
const TOC_GROUP = blockClass("tocGroup");
const TOC_LINK = blockClass("tocLink");

const SCROLL_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " ",
]);

function TocLink({
  id,
  title,
  activeId,
}: {
  id: string;
  title: string;
  activeId: string | null;
}) {
  return (
    <a
      className={TOC_LINK}
      href={`#${id}`}
      aria-current={activeId === id ? "location" : undefined}
    >
      {title}
    </a>
  );
}

function TocGroups({
  groups,
  activeId,
}: {
  groups: StudyTocGroup[];
  activeId: string | null;
}) {
  return (
    <ol className={TOC_LIST}>
      {groups.map((group) => (
        <li key={group.id} className={TOC_GROUP}>
          <TocLink id={group.id} title={group.title} activeId={activeId} />
          {group.items.length > 0 ? (
            <ul className={TOC_LIST}>
              {group.items.map((item) => (
                <li key={item.id}>
                  <TocLink id={item.id} title={item.title} activeId={activeId} />
                </li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

/**
 * Table of contents for a study material.
 *
 * Desktop shows a sticky rail; narrow screens show one collapsible block.
 * Both render the same groups. The active entry follows the reader through
 * the document, so the panel answers "where am I" as well as "where can I go".
 *
 * Clicking an entry scrolls the page with a short custom animation and pins
 * the indicator to the clicked entry immediately, so it never jumps back to
 * the position the viewport is still leaving. The rail itself never scrolls
 * on its own: only the indicator moves while the reader scrolls the page.
 */
export default function StudyToc({ sections }: { sections: StudySection[] }) {
  const groups = useMemo(() => buildStudyToc(sections), [sections]);
  const targets = useMemo<StudyTocTarget[]>(
    () =>
      groups.flatMap((group) => [
        { domId: `${group.id}-title`, tocId: group.id },
        ...group.items.map((item) => ({
          domId: item.id,
          tocId: item.id,
        })),
      ]),
    [groups],
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (typeof window === "undefined" || !nav) return;

    let frame = 0;
    let animationFrame = 0;
    let locked = false;
    let restoreScrollBehavior: (() => void) | null = null;

    const measure = () => {
      frame = 0;
      if (locked) return;

      const positions: StudyTocPosition[] = [];

      for (const target of targets) {
        const element = document.getElementById(target.domId);
        if (!element) continue;

        positions.push({
          domId: target.domId,
          tocId: target.tocId,
          top: element.getBoundingClientRect().top,
        });
      }

      if (positions.length === 0) return;

      const readingLine = Math.max(120, window.innerHeight * 0.3);
      setActiveId(selectActiveId(positions, readingLine));
    };

    const schedule = () => {
      if (locked || frame) return;
      frame = window.requestAnimationFrame(measure);
    };

    const restoreSmoothness = () => {
      restoreScrollBehavior?.();
      restoreScrollBehavior = null;
    };

    const disableNativeSmoothScrolling = () => {
      const root = document.documentElement;
      const previous = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      restoreScrollBehavior = () => {
        root.style.scrollBehavior = previous;
      };
    };

    const stopAnimation = (resume: boolean) => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
      restoreSmoothness();
      locked = false;
      if (resume) measure();
    };

    const animateTo = (target: HTMLElement) => {
      const margin =
        Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      const from = window.scrollY;
      const to = scrollTargetTop(
        target.getBoundingClientRect().top,
        from,
        margin,
      );
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduced || Math.abs(to - from) < 2) {
        disableNativeSmoothScrolling();
        window.scrollTo(0, to);
        restoreSmoothness();
        locked = false;
        measure();
        return;
      }

      disableNativeSmoothScrolling();
      const start = window.performance.now();

      const step = (now: number) => {
        const progress = Math.min(1, (now - start) / TOC_SCROLL_DURATION);
        window.scrollTo(0, from + (to - from) * easeOutCubic(progress));

        if (progress < 1) {
          animationFrame = window.requestAnimationFrame(step);
        } else {
          animationFrame = 0;
          restoreSmoothness();
          locked = false;
          measure();
        }
      };

      animationFrame = window.requestAnimationFrame(step);
    };

    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const source = event.target;
      const link =
        source instanceof Element
          ? source.closest<HTMLAnchorElement>('a[href^="#"]')
          : null;
      if (!link) return;

      let id: string;
      try {
        id = decodeURIComponent(link.hash.slice(1));
      } catch {
        return;
      }

      const target = id ? document.getElementById(id) : null;
      if (!target) return;

      event.preventDefault();
      stopAnimation(false);
      setActiveId(id);
      locked = true;
      window.history.pushState(null, "", link.hash);
      animateTo(target);
    };

    const handleInterrupt = () => {
      if (locked) stopAnimation(true);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (locked && SCROLL_KEYS.has(event.key)) stopAnimation(true);
    };

    measure();
    nav.addEventListener("click", handleClick);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("wheel", handleInterrupt, { passive: true });
    window.addEventListener("touchstart", handleInterrupt, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      nav.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("wheel", handleInterrupt);
      window.removeEventListener("touchstart", handleInterrupt);
      window.removeEventListener("keydown", handleKeyDown);
      if (frame) window.cancelAnimationFrame(frame);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      restoreSmoothness();
    };
  }, [targets]);

  return (
    <nav ref={navRef} className={TOC} aria-label="Содержание материала">
      <div className={TOC_RAIL}>
        <TocGroups groups={groups} activeId={activeId} />
      </div>
      <details className={TOC_COMPACT}>
        <summary className={TOC_SUMMARY}>Содержание</summary>
        <TocGroups groups={groups} activeId={activeId} />
      </details>
    </nav>
  );
}
