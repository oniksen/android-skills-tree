"use client";

import { blockClass } from "../model/study-blocks";
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
      ? `${blockClass("note")} ${blockClass("noteWarn")}`
      : blockClass("note");

  return (
    <div className={className}>
      <StudyProse markdown={content} />
    </div>
  );
}
