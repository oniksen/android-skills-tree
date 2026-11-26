"use client";

import { useMemo } from "react";
import { blockClass } from "../model/study-blocks";
import { parseStudyDocument } from "../model/parse-study-document";
import StudyFooter from "./StudyFooter";
import StudyHero from "./StudyHero";
import StudyToc from "./StudyToc";
import StudyProse from "./StudyProse";
import StudySection from "./StudySection";

const MARKDOWN = blockClass("markdown");
const LAYOUT = blockClass("layout");
const CONTENT = blockClass("content");

export default function StudyMarkdownRenderer({
  content,
  grade,
  materialId,
}: {
  content: string;
  grade?: string;
  materialId?: string;
}) {
  const studyDocument = useMemo(
    () => parseStudyDocument(content, { grade, materialId }),
    [content, grade, materialId],
  );

  if (!studyDocument) {
    return (
      <div className={MARKDOWN}>
        <StudyProse markdown={content} />
      </div>
    );
  }

  return (
    <div className={LAYOUT}>
      <StudyToc sections={studyDocument.sections} />
      <div className={CONTENT}>
        <StudyHero meta={studyDocument.meta} />
        {studyDocument.sections.map((section) => (
          <StudySection key={section.id} section={section} />
        ))}
        <StudyFooter meta={studyDocument.meta} />
      </div>
    </div>
  );
}
