"use client";

import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeStudyHighlight from "../model/study-highlight";
import {
  STUDY_MARKDOWN_COMPONENTS,
  STUDY_SOURCES_COMPONENTS,
} from "./markdown-components";

/** Stable arrays: `ReactMarkdown` rebuilds its processor on every render anyway. */
const REMARK_PLUGINS = [remarkGfm];
const REHYPE_PLUGINS = [rehypeStudyHighlight];

function StudyProse({
  markdown,
  sources = false,
}: {
  markdown: string;
  sources?: boolean;
}) {
  return (
    <ReactMarkdown
      remarkPlugins={REMARK_PLUGINS}
      rehypePlugins={REHYPE_PLUGINS}
      components={
        sources ? STUDY_SOURCES_COMPONENTS : STUDY_MARKDOWN_COMPONENTS
      }
    >
      {markdown}
    </ReactMarkdown>
  );
}

export default memo(StudyProse);
