"use client";

import { blockClass } from "../model/study-blocks";
import type { StudyDocumentMeta } from "../model/parse-study-document";
import { studyFooterText } from "../model/parse-study-document";
import StudyInline from "./StudyInline";

export default function StudyFooter({ meta }: { meta: StudyDocumentMeta }) {
  return (
    <footer className={blockClass("footer")}>
      <StudyInline text={studyFooterText(meta)} />
    </footer>
  );
}
