"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
export default function StudyInline({ text }: { text: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={STUDY_INLINE_COMPONENTS}>
      {escapeBlockMarkers(text)}
    </ReactMarkdown>
  );
}
