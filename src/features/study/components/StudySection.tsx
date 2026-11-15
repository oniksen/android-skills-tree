"use client";

import { memo } from "react";
import { blockClass } from "../model/study-blocks";
import type { StudySection as StudySectionData } from "../model/parse-study-document";
import { StudyBlockRenderer } from "./study-block-renderer";
import StudyInline from "./StudyInline";

const SECTION = blockClass("section");
const SECTION_TITLE = blockClass("sectionTitle");

function StudySection({
  section,
}: {
  section: StudySectionData;
}) {
  return (
    <section
      id={section.id}
      className={SECTION}
      aria-labelledby={`${section.id}-title`}
    >
      <h2 id={`${section.id}-title`} className={SECTION_TITLE}>
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

export default memo(StudySection);
