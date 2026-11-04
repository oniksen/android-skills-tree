"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import {
  STUDY_MARKDOWN_COMPONENTS,
  STUDY_SOURCES_COMPONENTS,
} from "./markdown-components";

export default function StudyProse({
  markdown,
  sources = false,
}: {
  markdown: string;
  sources?: boolean;
}) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={
        sources ? STUDY_SOURCES_COMPONENTS : STUDY_MARKDOWN_COMPONENTS
      }
    >
      {markdown}
    </ReactMarkdown>
  );
}
