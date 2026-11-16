import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { blockClass } from "../model/study-blocks";

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
    <div className={blockClass("page")}>
      <div className={blockClass("topbar")}>
        <Link href={backHref} className={blockClass("back")}>
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
      </div>
      <article className={blockClass("article")}>{children}</article>
    </div>
  );
}
