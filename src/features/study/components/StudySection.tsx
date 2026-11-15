"use client";

import { blockClass } from "../model/study-blocks";
import type { StudySection as StudySectionData } from "../model/parse-study-document";
import { StudyBlockRenderer } from "./study-block-renderer";
import StudyInline from "./StudyInline";

export default function StudySection({
  section,
}: {
  section: StudySectionData;
}) {
  return (
    <section
      id={section.id}
      className={blockClass("section")}
      aria-labelledby={`${section.id}-title`}
    >
      <h2 id={`${section.id}-title`} className={blockClass("sectionTitle")}>
        <StudyInline text={section.title} />
      </h2>
      {section.blocks.map((block, index) => (
        <StudyBlockRenderer
          key={`${block.type}-${index}`}
          block={block}
          sources={section.isSources}
        />
      ))}
    </section>
  );
}
