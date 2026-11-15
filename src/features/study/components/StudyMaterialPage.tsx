import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { STUDY_BLOCK } from "../model/study-blocks";

export default function StudyMaterialPage({
  backHref,
  backLabel = "Назад",
  children,
}: {
  backHref: string;
  backLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={STUDY_BLOCK.page}>
      <div className={STUDY_BLOCK.topbar}>
        <Link href={backHref} className={STUDY_BLOCK.back}>
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
      </div>
      <article className={STUDY_BLOCK.article}>{children}</article>
    </div>
  );
}
