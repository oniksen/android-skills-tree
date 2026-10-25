"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DifficultyBadge from "@/shared/ui/DifficultyBadge";
import QuizInfoIcon from "@/shared/ui/QuizInfoIcon";
import { isDesktopViewport, skillDetailHref } from "@/lib/viewport";
import SkillDetailModal from "./SkillDetailModal";

interface SkillRowReadonlyProps {
  skillId: string;
  name: string;
  description: string;
  subtopics: string[];
}

export default function SkillRowReadonly({ skillId, name, description, subtopics }: SkillRowReadonlyProps) {
  const router = useRouter();
  const params = useParams();
  const slug = (params?.slug as string) ?? "";

  const [open, setOpen] = useState(false);
  const hasContent = !!description || subtopics.length > 0;

  const handleOpen = () => {
    if (!hasContent) return;
    if (isDesktopViewport()) {
      setOpen(true);
    } else if (slug) {
      router.push(skillDetailHref(slug, skillId));
    }
  };

  return (
    <div className="py-1">
      <div className={`rounded-lg transition-colors ${hasContent ? "hover:bg-white/[0.03]" : ""}`}>
        <button
          type="button"
          onClick={handleOpen}
          disabled={!hasContent}
          aria-haspopup={hasContent ? "dialog" : undefined}
          className="flex w-full cursor-pointer flex-col gap-1.5 px-3 py-1 text-left disabled:cursor-default nav-md:flex-row nav-md:items-center nav-md:justify-between nav-md:gap-0"
        >
          <div className="flex min-w-0 items-center gap-2">
            <span className="w-3 shrink-0 text-center font-mono text-slate-600">·</span>
            <span className="text-base text-slate-300 nav-md:truncate">{name}</span>
          </div>
          <div className="flex shrink-0 items-center gap-2 pl-5 nav-md:pl-0">
            <DifficultyBadge skillId={skillId} />
            <QuizInfoIcon skillId={skillId} />
          </div>
        </button>
      </div>

      <SkillDetailModal
        open={open}
        onClose={() => setOpen(false)}
        skillId={skillId}
        name={name}
        description={description}
        subtopics={subtopics}
        subtopicState={{}}
        subtopicPercent={0}
        readonly
      />
    </div>
  );
}
