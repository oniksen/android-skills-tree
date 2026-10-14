"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import DifficultyBadge from "@/components/shared/DifficultyBadge";
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
          className="flex w-full items-center justify-between px-3 py-1 text-left disabled:cursor-default"
        >
          <div className="flex min-w-0 items-center gap-2">
            {hasContent && <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />}
            <span className="truncate text-base text-slate-300">{name}</span>
          </div>
          <DifficultyBadge skillId={skillId} />
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
