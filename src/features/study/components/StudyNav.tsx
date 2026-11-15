"use client";

import { blockClass } from "../model/study-blocks";
import type { StudySection } from "../model/parse-study-document";
import { stripMarkdownInline } from "../model/parse-study-document";

export default function StudyNav({ sections }: { sections: StudySection[] }) {
  if (sections.length === 0) return null;

  return (
    <nav className={blockClass("nav")} aria-label="Содержание">
      {sections.map((section) => (
        <a
          key={section.id}
          className={blockClass("navLink")}
          href={`#${section.id}`}
        >
          {stripMarkdownInline(section.title)}
        </a>
      ))}
    </nav>
  );
}
