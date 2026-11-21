import { Suspense } from "react";
import { getLevelBySlug, levels } from "@/data/levels";
import { notFound } from "next/navigation";
import TreeClient from "@/features/tree/components/TreeClient";
import DeepLinkedSkillModal from "@/features/tree/components/DeepLinkedSkillModal";

export function generateStaticParams() {
  return levels.map((level) => ({ slug: level.slug }));
}

export default async function LevelPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const currentLevel = getLevelBySlug(slug);
  if (!currentLevel) return notFound();

  return (
    <>
      <TreeClient slug={slug} />
      <Suspense fallback={null}>
        <DeepLinkedSkillModal slug={slug} />
      </Suspense>
    </>
  );
}
