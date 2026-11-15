"use client";

import { STUDY_BLOCK } from "../model/study-blocks";
import type { StudyDocumentMeta } from "../model/parse-study-document";
import { studyFooterText } from "../model/parse-study-document";
import StudyInline from "./StudyInline";

export default function StudyFooter({ meta }: { meta: StudyDocumentMeta }) {
  return (
    <footer className={STUDY_BLOCK.footer}>
      <StudyInline text={studyFooterText(meta)} />
    </footer>
  );
}
