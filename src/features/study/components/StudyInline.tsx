"use client";

import { memo, useMemo } from "react";
import { renderMarkdown } from "../model/markdown-pipeline";
import { STUDY_INLINE_COMPONENTS } from "./markdown-components";

/**
 * Section titles are single-line text, but `1. Объявление` or `- текст`
 * would be parsed as a list. Escape block markers so titles stay inline.
 */
function escapeBlockMarkers(text: string): string {
  return text
    .replace(/^(\s*)([#>])/, "$1\\$2")
    .replace(/^(\s*)([-+*])(\s+)/, "$1\\$2$3")
    .replace(/^(\s*)(\d+)([.)])(\s+)/, "$1$2\\$3$4");
}

/** Inline markdown for headings, card titles and hero copy. */
function StudyInline({ text }: { text: string }) {
  const content = useMemo(
    () => renderMarkdown(escapeBlockMarkers(text), STUDY_INLINE_COMPONENTS),
    [text],
  );

  return <>{content}</>;
}

export default memo(StudyInline);
