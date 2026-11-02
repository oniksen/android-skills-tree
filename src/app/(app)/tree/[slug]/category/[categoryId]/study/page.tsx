import { notFound } from "next/navigation";
import { getCategoriesByLevelId, getCategoryById, getLevelBySlug } from "@/data";
import StudyMaterialPage from "@/features/study/components/StudyMaterialPage";
import StudyMaterialContent from "@/features/study/components/StudyMaterialContent";

export default async function CategoryStudyMaterialRoute({
  params,
}: {
  params: Promise<{ slug: string; categoryId: string }>;
}) {
  const { slug, categoryId } = await params;
  const level = getLevelBySlug(slug);
  const category = getCategoryById(categoryId);
  if (!level || !category) return notFound();

  const belongsToLevel = getCategoriesByLevelId(level.id).some((c) => c.id === categoryId);
  if (!belongsToLevel) return notFound();

  if (!category.studyMaterial) return notFound();

  return (
    <StudyMaterialPage backHref={`/tree/${slug}`} backLabel="Назад к дереву">
      <StudyMaterialContent materialId={category.studyMaterial} />
    </StudyMaterialPage>
  );
}
