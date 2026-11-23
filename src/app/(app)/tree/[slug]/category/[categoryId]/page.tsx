import { notFound } from "next/navigation";
import { getCategoriesByLevelId, getCategoryById, getLevelBySlug } from "@/data";
import CategoryPageClient from "./CategoryPageClient";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string; categoryId: string }>;
}) {
  const { slug, categoryId } = await params;
  const level = getLevelBySlug(slug);
  const category = getCategoryById(categoryId);
  if (!level || !category) return notFound();

  const belongsToLevel = getCategoriesByLevelId(level.id).some(
    (item) => item.id === categoryId,
  );
  if (!belongsToLevel) return notFound();

  return <CategoryPageClient slug={slug} categoryId={categoryId} />;
}
