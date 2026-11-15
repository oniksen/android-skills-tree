"use client";

import { blockClass } from "../model/study-blocks";
import type { StudyDocumentMeta } from "../model/parse-study-document";
import { studyEyebrow, studyLead } from "../model/parse-study-document";
import StudyInline from "./StudyInline";

export default function StudyHero({ meta }: { meta: StudyDocumentMeta }) {
  return (
    <header className={blockClass("hero")}>
      <p className={blockClass("eyebrow")}>{studyEyebrow(meta)}</p>
      <h1 className={blockClass("title")}>
        <StudyInline text={meta.title} />
      </h1>
      <p className={blockClass("lead")}>
        <StudyInline text={studyLead(meta)} />
      </p>
    </header>
  );
}
