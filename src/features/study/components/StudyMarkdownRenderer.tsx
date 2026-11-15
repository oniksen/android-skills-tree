"use client";

import { useMemo } from "react";
import { STUDY_BLOCK } from "../model/study-blocks";
import { parseStudyDocument } from "../model/parse-study-document";
import StudyFooter from "./StudyFooter";
import StudyHero from "./StudyHero";
import StudyNav from "./StudyNav";
import StudyProse from "./StudyProse";
import StudySection from "./StudySection";

export default function StudyMarkdownRenderer({
  content,
  grade,
}: {
  content: string;
  grade?: string;
}) {
  const studyDocument = useMemo(
    () => parseStudyDocument(content, { grade }),
    [content, grade],
  );

  if (!studyDocument) {
    return (
      <div className={STUDY_BLOCK.markdown}>
        <StudyProse markdown={content} />
      </div>
    );
  }

  return (
    <>
      <StudyHero meta={studyDocument.meta} />
      <StudyNav sections={studyDocument.sections} />
      {studyDocument.sections.map((section) => (
        <StudySection key={section.id} section={section} />
      ))}
      <StudyFooter meta={studyDocument.meta} />
    </>
  );
}
