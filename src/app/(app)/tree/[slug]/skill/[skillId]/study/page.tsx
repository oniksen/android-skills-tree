import { notFound } from "next/navigation";
import { getCategoriesByLevelId, getLevelBySlug, getSkillById } from "@/data";
import StudyMaterialPage from "@/features/study/components/StudyMaterialPage";
import StudyMaterialContent from "@/features/study/components/StudyMaterialContent";

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

  if (!skill.studyMaterial) return notFound();

  return (
    <StudyMaterialPage
      backHref={`/tree/${slug}`}
      backLabel="Назад к дереву"
    >
      <StudyMaterialContent materialId={skill.studyMaterial} />
    </StudyMaterialPage>
  );
}
