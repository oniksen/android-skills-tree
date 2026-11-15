"use client";

import { memo, useMemo } from "react";
import { renderMarkdown } from "../model/markdown-pipeline";
import {
  STUDY_MARKDOWN_COMPONENTS,
  STUDY_SOURCES_COMPONENTS,
} from "./markdown-components";

function StudyProse({
  markdown,
  sources = false,
}: {
  markdown: string;
  sources?: boolean;
}) {
  // The processor lives in `markdown-pipeline`, so only the tree conversion is
  // repeated per render.
  const content = useMemo(
    () =>
      renderMarkdown(
        markdown,
        sources ? STUDY_SOURCES_COMPONENTS : STUDY_MARKDOWN_COMPONENTS,
      ),
    [markdown, sources],
  );

  return <>{content}</>;
}

export default memo(StudyProse);
