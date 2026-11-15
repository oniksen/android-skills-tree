"use client";

import { blockClass } from "../model/study-blocks";
import type { StudySection as StudySectionData } from "../model/parse-study-document";
import StudyCards from "./StudyCards";
import StudyInline from "./StudyInline";
import StudyNote from "./StudyNote";
import StudyProse from "./StudyProse";

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
      {section.blocks.map((block, index) => {
        if (block.type === "cards") {
          return <StudyCards key={`cards-${index}`} items={block.items} />;
        }
        if (block.type === "note") {
          return (
            <StudyNote
              key={`note-${index}`}
              content={block.content}
              variant={block.variant}
            />
          );
        }
        return (
          <StudyProse
            key={`markdown-${index}`}
            markdown={block.content}
            sources={section.isSources}
          />
        );
      })}
    </section>
  );
}
