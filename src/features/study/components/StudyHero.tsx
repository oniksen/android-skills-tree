"use client";

import { blockClass } from "../model/study-blocks";
import type { StudyDocumentMeta } from "../model/parse-study-document";
import { studyEyebrow, studyLead } from "../model/parse-study-document";
import StudyInline from "./StudyInline";

const HERO = blockClass("hero");
const EYEBROW = blockClass("eyebrow");
const TITLE = blockClass("title");
const LEAD = blockClass("lead");

export default function StudyHero({ meta }: { meta: StudyDocumentMeta }) {
  return (
    <header className={HERO}>
      <p className={EYEBROW}>{studyEyebrow(meta)}</p>
      <h1 className={TITLE}>
        <StudyInline text={meta.title} />
      </h1>
      <p className={LEAD}>
        <StudyInline text={studyLead(meta)} />
      </p>
    </header>
  );
}
