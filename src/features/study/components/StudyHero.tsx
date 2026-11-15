"use client";

import { STUDY_BLOCK } from "../model/study-blocks";
import type { StudyDocumentMeta } from "../model/parse-study-document";
import { studyEyebrow, studyLead } from "../model/parse-study-document";
import StudyInline from "./StudyInline";

export default function StudyHero({ meta }: { meta: StudyDocumentMeta }) {
  return (
    <header className={STUDY_BLOCK.hero}>
      <p className={STUDY_BLOCK.eyebrow}>{studyEyebrow(meta)}</p>
      <h1 className={STUDY_BLOCK.title}>
        <StudyInline text={meta.title} />
      </h1>
      <p className={STUDY_BLOCK.lead}>
        <StudyInline text={studyLead(meta)} />
      </p>
    </header>
  );
}
