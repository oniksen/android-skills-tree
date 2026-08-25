import { getLevelBySlug } from "@/data/levels";
import { notFound } from "next/navigation";
import TreeClient from "@/components/tree/TreeClient";

export default async function LevelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const currentLevel = getLevelBySlug(slug);
  if (!currentLevel) return notFound();

  return <TreeClient slug={slug} />;
}
