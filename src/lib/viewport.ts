import { getSkillById } from "@/data";

export function categoryHref(slug: string, categoryId: string): string {
  return `/tree/${slug}/category/${categoryId}`;
}

/**
 * Canonical address of a skill: the block inside its category page. The old
 * `/tree/<slug>/skill/<id>` route redirects here.
 */
export function skillDetailHref(slug: string, skillId: string): string {
  const categoryId = getSkillById(skillId)?.categoryId;

  return categoryId
    ? `${categoryHref(slug, categoryId)}#skill-${skillId}`
    : `/tree/${slug}`;
}
