"use client";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Level { slug: string; name: string; levelOrder: number }
const levelColors: Record<string, string> = {
  junior: "text-green-400 border-green-400",
  middle: "text-blue-400 border-blue-400",
  "strong-middle": "text-purple-400 border-purple-400",
  senior: "text-amber-400 border-amber-400",
};
export default function LevelTabs({ levels }: { levels: Level[] }) {
  const params = useParams();
  const currentSlug = params?.slug as string || levels[0]?.slug;
  return (
    <div className="flex gap-2 flex-wrap border-b border-slate-800 pb-4">
      {[...levels].sort((a,b) => a.levelOrder - b.levelOrder).map((level) => {
        const isActive = currentSlug === level.slug;
        const color = levelColors[level.slug] || "text-slate-400 border-slate-400";
        return (
          <Link key={level.slug} href={`/tree/${level.slug}`}
            className={`px-4 py-2.5 rounded-lg text-base font-medium transition-all ${
              isActive ? `bg-slate-800 border ${color}` : "text-slate-500 hover:text-slate-300 border border-transparent"
            }`}>{level.name}</Link>
        );
      })}
    </div>
  );
}
