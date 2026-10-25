import { notFound } from "next/navigation";
import { getCategoriesByLevelId, getLevelBySlug } from "@/data";
import { getCategoryById } from "@/data/categories";
import { getStudyMaterial } from "@/features/study/study-materials";
import StudyMaterialPage from "@/features/study/components/StudyMaterialPage";

export default async function CategoryStudyMaterialRoute({
  params,
}: {
  params: Promise<{ slug: string; categoryId: string }>;
}) {
  const { slug, categoryId } = await params;
  const level = getLevelBySlug(slug);
  const category = getCategoryById(categoryId);
  if (!level || !category) return notFound();

  const belongsToLevel = getCategoriesByLevelId(level.id).some(
    (c) => c.id === category.id,
  );
  if (!belongsToLevel) return notFound();

  const material = getStudyMaterial(category.studyMaterial);
  if (!material) return notFound();

  const Material = material.component;

  return (
    <StudyMaterialPage
      backHref={`/tree/${slug}`}
      backLabel="Назад к дереву"
    >
      <Material />
    </StudyMaterialPage>
  );
}
