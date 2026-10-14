import { notFound } from "next/navigation";
import { getCategoriesByLevelId, getLevelBySlug, getSkillById } from "@/data";
import SkillDetailPageClient from "./SkillDetailPageClient";

export default async function SkillDetailPage({
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

  return <SkillDetailPageClient slug={slug} skillId={skillId} />;
}
