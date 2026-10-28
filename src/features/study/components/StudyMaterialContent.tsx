"use client";

import { useStudyMaterial } from "../hooks/useStudyMaterial";
import StudyMarkdownRenderer from "./StudyMarkdownRenderer";

export default function StudyMaterialContent({ materialId }: { materialId: string }) {
  const { data, isLoading, isError } = useStudyMaterial(materialId);

  if (isLoading) {
    return <p className="study-muted">Загрузка материала…</p>;
  }
  if (isError || !data) {
    return <p className="study-muted">Материал не найден.</p>;
  }
  return <StudyMarkdownRenderer content={data.content} />;
}
