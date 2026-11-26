"use client";

import StudyMarkdownRenderer from "./StudyMarkdownRenderer";

export default function StudyMaterialContent({
  content,
  grade,
  materialId,
}: {
  content: string;
  grade: string;
  materialId?: string;
}) {
  return <StudyMarkdownRenderer content={content} grade={grade} materialId={materialId} />;
}
