import { notFound } from "next/navigation";
import { getCategoriesByLevelId, getLevelBySlug, getSkillById } from "@/data";
import { getStudyMaterial } from "@/features/study/study-materials";
import StudyMaterialPage from "@/features/study/components/StudyMaterialPage";

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

  const material = getStudyMaterial(skill.studyMaterial);
  if (!material) return notFound();

  const Material = material.component;

  return (
    <StudyMaterialPage
      backHref={`/tree/${slug}/skill/${skillId}`}
      backLabel="Назад к навыку"
    >
      <Material />
    </StudyMaterialPage>
  );
}
