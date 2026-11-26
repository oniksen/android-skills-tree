import { notFound } from "next/navigation";
import { getCategoriesByLevelId, getCategoryById, getLevelBySlug } from "@/data";
import StudyMaterialPage from "@/features/study/components/StudyMaterialPage";
import StudyMaterialContent from "@/features/study/components/StudyMaterialContent";
import { fetchStudyMaterial } from "@/features/study/study-material";

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

  const materialId = category.studyMaterial;
  if (!materialId) return notFound();

  // Render the registry lookup on the server: keeps ~1 MB of study text out of
  // the client bundle. Only the current material is serialized to the browser.
  const material = await fetchStudyMaterial(materialId);
  if (!material) return notFound();

  return (
    <StudyMaterialPage>
      <StudyMaterialContent content={material.content} grade={material.grade} materialId={material.id} />
    </StudyMaterialPage>
  );
}
