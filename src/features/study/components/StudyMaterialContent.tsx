"use client";

import StudyMarkdownRenderer from "./StudyMarkdownRenderer";

export default function StudyMaterialContent({
  content,
  grade,
}: {
  content: string;
  grade: string;
}) {
  return <StudyMarkdownRenderer content={content} grade={grade} />;
}
