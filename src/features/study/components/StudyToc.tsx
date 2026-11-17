"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { blockClass } from "../model/study-blocks";
import type { StudySection } from "../model/parse-study-document";
import { buildStudyToc, type StudyTocGroup } from "./study-toc-model";

const TOC = blockClass("toc");
const TOC_RAIL = blockClass("tocRail");
const TOC_COMPACT = blockClass("tocCompact");
const TOC_SUMMARY = blockClass("tocSummary");
const TOC_LIST = blockClass("tocList");
const TOC_GROUP = blockClass("tocGroup");
const TOC_LINK = blockClass("tocLink");

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
 */
export default function StudyToc({ sections }: { sections: StudySection[] }) {
  const groups = useMemo(() => buildStudyToc(sections), [sections]);
  const ids = useMemo(
    () => groups.flatMap((group) => [group.id, ...group.items.map((item) => item.id)]),
    [groups],
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    if (elements.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }

        const next = ids.find((id) => visible.has(id)) ?? null;
        if (next) setActiveId(next);
      },
      { rootMargin: "-72px 0px -60% 0px" },
    );

    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  }, [ids]);

  useEffect(() => {
    const rail = railRef.current;
    if (!activeId || !rail) return;

    const link = rail.querySelector<HTMLElement>(`a[href="#${activeId}"]`);
    if (!link) return;

    rail.scrollTop = Math.max(
      0,
      link.offsetTop - rail.clientHeight / 2 + link.offsetHeight / 2,
    );
  }, [activeId]);

  return (
    <nav className={TOC} aria-label="Содержание материала">
      <div ref={railRef} className={TOC_RAIL}>
        <TocGroups groups={groups} activeId={activeId} />
      </div>
      <details className={TOC_COMPACT}>
        <summary className={TOC_SUMMARY}>Содержание</summary>
        <TocGroups groups={groups} activeId={activeId} />
      </details>
    </nav>
  );
}
