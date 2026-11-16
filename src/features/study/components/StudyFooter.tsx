"use client";

import { blockClass } from "../model/study-blocks";
import type { StudyDocumentMeta } from "../model/parse-study-document";
import { studyFooterText } from "../model/parse-study-document";
import StudyInline from "./StudyInline";

const FOOTER = blockClass("footer");

export default function StudyFooter({ meta }: { meta: StudyDocumentMeta }) {
  return (
    <footer className={FOOTER}>
      <StudyInline text={studyFooterText(meta)} />
    </footer>
  );
}
