"use client";

import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { STUDY_INLINE_COMPONENTS } from "./markdown-components";

const REMARK_PLUGINS = [remarkGfm];

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
  return (
    <ReactMarkdown remarkPlugins={REMARK_PLUGINS} components={STUDY_INLINE_COMPONENTS}>
      {escapeBlockMarkers(text)}
    </ReactMarkdown>
  );
}

export default memo(StudyInline);
