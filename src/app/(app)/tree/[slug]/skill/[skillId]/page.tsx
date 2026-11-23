import { notFound, redirect } from "next/navigation";
import { getCategoriesByLevelId, getLevelBySlug, getSkillById } from "@/data";
import { skillDetailHref } from "@/lib/viewport";

/**
 * Legacy skill URL: the topic now lives inside its category page, so keep old
 * links and roadmap shortcuts working by redirecting to the matching block.
 */
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
    (category) => category.id === skill.categoryId,
  );
  if (!belongsToLevel) return notFound();

  redirect(skillDetailHref(slug, skillId));
}
