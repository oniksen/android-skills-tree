"use client";

import { STUDY_BLOCK } from "../model/study-blocks";
import type { StudyNoteVariant } from "../model/parse-study-document";
import StudyProse from "./StudyProse";

export default function StudyNote({
  content,
  variant,
}: {
  content: string;
  variant: StudyNoteVariant;
}) {
  const className =
    variant === "warn"
      ? `${STUDY_BLOCK.note} ${STUDY_BLOCK.noteWarn}`
      : STUDY_BLOCK.note;

  return (
    <div className={className}>
      <StudyProse markdown={content} />
    </div>
  );
}
