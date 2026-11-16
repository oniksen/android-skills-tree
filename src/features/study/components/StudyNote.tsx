"use client";

import { memo } from "react";
import { blockClass } from "../model/study-blocks";
import type { StudyNoteVariant } from "../model/parse-study-document";
import StudyProse from "./StudyProse";

const NOTE = blockClass("note");
const NOTE_WARN = `${NOTE} ${blockClass("noteWarn")}`;

function StudyNote({
  content,
  variant,
}: {
  content: string;
  variant: StudyNoteVariant;
}) {
  return (
    <div className={variant === "warn" ? NOTE_WARN : NOTE}>
      <StudyProse markdown={content} />
    </div>
  );
}

export default memo(StudyNote);
