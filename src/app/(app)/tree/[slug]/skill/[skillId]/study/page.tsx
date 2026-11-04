import { notFound } from "next/navigation";
import { getCategoriesByLevelId, getLevelBySlug, getSkillById } from "@/data";
import StudyMaterialPage from "@/features/study/components/StudyMaterialPage";
import StudyMaterialContent from "@/features/study/components/StudyMaterialContent";
import { fetchStudyMaterial } from "@/features/study/study-material";

export default async function StudyMaterialRoute({
  params,
}: {
  params: Promise<{ slug: string; skillId: string }>;
}) {
  const { slug, skillId } = await params;
  const level = getLevelBySlug(slug);
  const skill = getSkillById(skillId);
  if (!level || !skill) return notFound();

  const belongsToLevel = getCategoriesByLevelId(level.id).some(
    (c) => c.id === skill.categoryId,
  );
  if (!belongsToLevel) return notFound();

  const materialId = skill.studyMaterial;
  if (!materialId) return notFound();

  // Render the registry lookup on the server: keeps ~1 MB of study text out of
  // the client bundle. Only the current material is serialized to the browser.
  const material = await fetchStudyMaterial(materialId);
  if (!material) return notFound();

  return (
    <StudyMaterialPage
      backHref={`/tree/${slug}`}
      backLabel="Назад к дереву"
    >
      <StudyMaterialContent content={material.content} grade={material.grade} />
    </StudyMaterialPage>
  );
}
